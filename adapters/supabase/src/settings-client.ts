import type {
  SupabaseSettingsClientPort,
  SupabaseSettingsQueryResult,
  SupabaseTenantSettingsRow,
} from "@sovereign-cms/db"
import type { TenantSettingsStoragePayload } from "@sovereign-cms/core"
import { PersistenceAdapterError } from "@sovereign-cms/db"

const TENANT_SETTINGS_TABLE = "tenant_settings"

function readEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new PersistenceAdapterError(
      "config_missing",
      `Missing required environment variable: ${name}`,
    )
  }
  return value
}

function toQueryError(error: unknown): { message: string; code?: string } | null {
  if (!error) return null
  if (typeof error === "object" && error !== null && "message" in error) {
    const record = error as { message?: string; code?: string }
    return {
      message: typeof record.message === "string" ? record.message : "Supabase query failed",
      code: typeof record.code === "string" ? record.code : undefined,
    }
  }
  return { message: "Supabase query failed" }
}

async function createSupabaseServerClient() {
  try {
    const { createClient } = await import("@supabase/supabase-js")
    const url = readEnv("SUPABASE_URL")
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      process.env.SUPABASE_ANON_KEY?.trim() ||
      ""

    if (!key) {
      throw new PersistenceAdapterError(
        "config_missing",
        "Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY for server-side settings persistence",
      )
    }

    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  } catch (error) {
    if (error instanceof PersistenceAdapterError) {
      throw error
    }
    throw new PersistenceAdapterError(
      "sdk_unavailable",
      "Install @supabase/supabase-js to use DATABASE_ADAPTER=supabase",
      { cause: error },
    )
  }
}

/**
 * Server-side Supabase port for `tenant_settings` (Phase 91).
 * Requires table from docs/migration/sql/phase-91-settings-persistence-runtime-foundation.sql
 */
export async function createSupabaseSettingsClientPort(): Promise<SupabaseSettingsClientPort> {
  const supabase = await createSupabaseServerClient()

  return {
    async getTenantSettings(input): Promise<
      SupabaseSettingsQueryResult<SupabaseTenantSettingsRow | null>
    > {
      const { data, error } = await supabase
        .from(TENANT_SETTINGS_TABLE)
        .select("tenant_id, settings_json, updated_at, updated_by")
        .eq("tenant_id", input.tenantId)
        .maybeSingle()

      return {
        data: (data ?? null) as SupabaseTenantSettingsRow | null,
        error: toQueryError(error),
      }
    },

    async upsertTenantSettings(input): Promise<
      SupabaseSettingsQueryResult<SupabaseTenantSettingsRow>
    > {
      const row = {
        tenant_id: input.tenantId,
        settings_json: input.settingsJson as TenantSettingsStoragePayload,
        updated_at: input.updatedAt,
        updated_by: input.updatedBy ?? null,
      }

      const { data, error } = await supabase
        .from(TENANT_SETTINGS_TABLE)
        .upsert(row, { onConflict: "tenant_id" })
        .select("tenant_id, settings_json, updated_at, updated_by")
        .single()

      return {
        data: (data ?? null) as SupabaseTenantSettingsRow | null,
        error: toQueryError(error),
      }
    },
  }
}
