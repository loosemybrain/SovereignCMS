import { createDefaultTenantSettings, mergeTenantSettingsPatch } from "@sovereign-cms/core"
import {
  createSettingsAdapterFromDatabase,
  createSupabaseSettingsAdapter,
  PersistenceAdapterError,
  type DatabaseAdapter,
  type SettingsPersistenceAdapter,
} from "@sovereign-cms/db"
import { createSupabaseSettingsClientPort } from "@sovereign-cms/adapter-supabase"
import type { DatabaseAdapterKind, RuntimeConfig } from "./config"

function createLazySupabaseSettingsAdapter(): SettingsPersistenceAdapter {
  let adapterPromise: Promise<SettingsPersistenceAdapter> | null = null

  const loadAdapter = () => {
    if (!adapterPromise) {
      adapterPromise = createSupabaseSettingsClientPort().then((port) =>
        createSupabaseSettingsAdapter(port),
      )
    }
    return adapterPromise
  }

  return {
    getTenantSettings: async (params) => (await loadAdapter()).getTenantSettings(params),
    getBrandSettings: async (params) => (await loadAdapter()).getBrandSettings(params),
    updateTenantSettings: async (params) =>
      (await loadAdapter()).updateTenantSettings(params),
  }
}

function createUnavailableSettingsAdapter(warning: string): SettingsPersistenceAdapter {
  return {
    async getTenantSettings(params) {
      return createDefaultTenantSettings(params.tenantId)
    },

    async getBrandSettings(params) {
      return createDefaultTenantSettings(params.tenantId)
    },

    async updateTenantSettings(params) {
      const tenantId = params.input.tenantId
      const merged = mergeTenantSettingsPatch(
        createDefaultTenantSettings(tenantId),
        params.input.settings,
      )
      return {
        settings: merged,
        persisted: false,
        persistenceMode: "unavailable",
        warning,
      }
    },
  }
}

/**
 * Server-side settings persistence resolution (Phase 91).
 * Explicit allowlist — no dynamic discovery.
 */
export function resolveSettingsPersistenceAdapter(
  config: Pick<RuntimeConfig, "databaseAdapter">,
  db: DatabaseAdapter,
): SettingsPersistenceAdapter {
  const kind: DatabaseAdapterKind = config.databaseAdapter

  switch (kind) {
    case "memory":
      return createSettingsAdapterFromDatabase(db)
    case "supabase":
      return createLazySupabaseSettingsAdapter()
    case "postgres":
      return createUnavailableSettingsAdapter(
        "DATABASE_ADAPTER=postgres is not implemented yet for tenant settings. Use memory or supabase.",
      )
    default: {
      const exhaustive: never = kind
      throw new PersistenceAdapterError(
        "unsupported_adapter",
        `Unsupported DATABASE_ADAPTER for settings: ${String(exhaustive)}`,
      )
    }
  }
}
