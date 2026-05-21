import {
  createDefaultTenantSettings,
  mergeTenantSettingsPatch,
  normalizeTenantSettingsFromStorage,
  tenantSettingsToStoragePayload,
} from "@sovereign-cms/core"
import type { SettingsPersistenceAdapter } from "../types"
import { PersistenceAdapterError, normalizeAdapterError } from "../errors"
import { assertTenantOwnedSettings } from "../assert-operational-read-tenant"
import { requireScopedContentTenantId } from "../assert-content-write-tenant"
import { requireAdapterTenantId } from "../require-tenant-id"
import type { SupabaseSettingsClientPort } from "./settings-client-port"

const TABLE_MISSING_CODES = new Set(["42P01", "PGRST205", "PGRST204"])

function assertNoQueryError(
  operation: string,
  error: { message: string; code?: string } | null,
): void {
  if (!error) return
  if (error.code && TABLE_MISSING_CODES.has(error.code)) {
    throw new PersistenceAdapterError(
      "settings_table_unavailable",
      `${operation}: tenant_settings table is missing or not exposed (${error.code})`,
    )
  }
  throw new PersistenceAdapterError(
    "supabase_query_failed",
    `${operation} failed: ${error.message}`,
  )
}

function isSettingsUnavailableError(error: unknown): boolean {
  return (
    error instanceof PersistenceAdapterError &&
    (error.code === "settings_table_unavailable" ||
      error.code === "config_missing" ||
      error.code === "sdk_unavailable")
  )
}

export function createSupabaseSettingsAdapter(
  client: SupabaseSettingsClientPort,
): SettingsPersistenceAdapter {
  async function loadTenantSettings(tenantId: string, operation: string) {
    try {
      const result = await client.getTenantSettings({ tenantId })
      assertNoQueryError(operation, result.error)
      if (!result.data) {
        return createDefaultTenantSettings(tenantId)
      }
      const settings = normalizeTenantSettingsFromStorage(
        tenantId,
        result.data.settings_json,
        result.data.updated_at,
      )
      assertTenantOwnedSettings(settings, tenantId, operation)
      return settings
    } catch (error) {
      if (isSettingsUnavailableError(error)) {
        return createDefaultTenantSettings(tenantId)
      }
      throw normalizeAdapterError(operation, error)
    }
  }

  return {
    async getTenantSettings(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getTenantSettings")
      return loadTenantSettings(tenantId, "getTenantSettings")
    },

    async getBrandSettings(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getBrandSettings")
      void params.brand
      return loadTenantSettings(tenantId, "getBrandSettings")
    },

    async updateTenantSettings(params) {
      const tenantId = requireScopedContentTenantId(
        params.tenantId,
        params.input.tenantId,
        "updateTenantSettings",
      )
      try {
        const currentResult = await client.getTenantSettings({ tenantId })
        assertNoQueryError("updateTenantSettings.read", currentResult.error)
        const current = currentResult.data
          ? normalizeTenantSettingsFromStorage(
              tenantId,
              currentResult.data.settings_json,
              currentResult.data.updated_at,
            )
          : createDefaultTenantSettings(tenantId)

        const merged = mergeTenantSettingsPatch(current, params.input.settings)
        const payload = tenantSettingsToStoragePayload(merged)

        const writeResult = await client.upsertTenantSettings({
          tenantId,
          settingsJson: payload,
          updatedAt: merged.updatedAt,
        })
        assertNoQueryError("updateTenantSettings.write", writeResult.error)

        const saved = normalizeTenantSettingsFromStorage(
          tenantId,
          writeResult.data?.settings_json ?? payload,
          writeResult.data?.updated_at ?? merged.updatedAt,
        )
        assertTenantOwnedSettings(saved, tenantId, "updateTenantSettings")

        return {
          settings: saved,
          persisted: true,
          persistenceMode: "database",
        }
      } catch (error) {
        if (isSettingsUnavailableError(error)) {
          const fallback = createDefaultTenantSettings(tenantId)
          const merged = mergeTenantSettingsPatch(fallback, params.input.settings)
          const message =
            error instanceof PersistenceAdapterError
              ? error.message
              : "Database settings persistence is not available"
          return {
            settings: merged,
            persisted: false,
            persistenceMode: "unavailable",
            warning: message,
          }
        }
        throw normalizeAdapterError("updateTenantSettings", error)
      }
    },
  }
}
