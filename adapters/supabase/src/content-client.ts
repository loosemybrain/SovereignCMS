import type {
  SupabaseBlockRow,
  SupabaseContentClientPort,
  SupabasePageRow,
  SupabaseQueryResult,
} from "@sovereign-cms/db"
import { PersistenceAdapterError } from "@sovereign-cms/db"

const PAGES_TABLE = "pages"
const BLOCKS_TABLE = "blocks"

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
        "Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY for server-side content reads",
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
 * Server-side Supabase query port for sovereign-aligned `pages` / `blocks` tables.
 *
 * Phase 70: all reads filter by `tenant_id` when the column exists on the table.
 * If a deployment uses legacy tables without `tenant_id`, queries may return empty
 * or incorrect rows until a schema migration adds tenant columns — see
 * `docs/architecture/tenant-enforcement-runtime-phase-70.md`.
 */
export async function createSupabaseContentClientPort(): Promise<SupabaseContentClientPort> {
  const supabase = await createSupabaseServerClient()

  return {
    async listPages(input): Promise<SupabaseQueryResult<SupabasePageRow[]>> {
      let query = supabase.from(PAGES_TABLE).select("*").eq("tenant_id", input.tenantId)
      if (input.locale) {
        query = query.eq("locale", input.locale)
      }
      const { data, error } = await query.order("updated_at", { ascending: false })
      return { data: (data ?? null) as SupabasePageRow[] | null, error: toQueryError(error) }
    },

    async getPageBySlug(input): Promise<SupabaseQueryResult<SupabasePageRow | null>> {
      const { data, error } = await supabase
        .from(PAGES_TABLE)
        .select("*")
        .eq("tenant_id", input.tenantId)
        .eq("locale", input.locale)
        .eq("slug", input.slug)
        .maybeSingle()

      return { data: (data ?? null) as SupabasePageRow | null, error: toQueryError(error) }
    },

    async getPageById(input): Promise<SupabaseQueryResult<SupabasePageRow | null>> {
      const { data, error } = await supabase
        .from(PAGES_TABLE)
        .select("*")
        .eq("tenant_id", input.tenantId)
        .eq("id", input.pageId)
        .maybeSingle()

      return { data: (data ?? null) as SupabasePageRow | null, error: toQueryError(error) }
    },

    async listBlocks(input): Promise<SupabaseQueryResult<SupabaseBlockRow[]>> {
      const { data, error } = await supabase
        .from(BLOCKS_TABLE)
        .select("*")
        .eq("tenant_id", input.tenantId)
        .eq("page_id", input.pageId)
        .order("sort_order", { ascending: true })

      return { data: (data ?? null) as SupabaseBlockRow[] | null, error: toQueryError(error) }
    },
  }
}
