import type { DatabaseAdapter } from "../contracts"
import type { SettingsPersistenceAdapter } from "./types"
import { assertTenantOwnedSettings } from "./assert-operational-read-tenant"
import { requireScopedContentTenantId } from "./assert-content-write-tenant"
import { normalizeAdapterError } from "./errors"
import { requireAdapterTenantId } from "./require-tenant-id"

export function createSettingsAdapterFromDatabase(db: DatabaseAdapter): SettingsPersistenceAdapter {
  return {
    async getTenantSettings(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getTenantSettings")
      try {
        const settings = await db.settings.getByTenant({ tenantId })
        assertTenantOwnedSettings(settings, tenantId, "getTenantSettings")
        return settings
      } catch (error) {
        throw normalizeAdapterError("getTenantSettings", error)
      }
    },

    async getBrandSettings(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getBrandSettings")
      void params.brand
      try {
        const settings = await db.settings.getByTenant({ tenantId })
        assertTenantOwnedSettings(settings, tenantId, "getBrandSettings")
        return settings
      } catch (error) {
        throw normalizeAdapterError("getBrandSettings", error)
      }
    },

    async updateTenantSettings(params) {
      const tenantId = requireScopedContentTenantId(
        params.tenantId,
        params.input.tenantId,
        "updateTenantSettings",
      )
      try {
        return await db.settings.update({ ...params.input, tenantId })
      } catch (error) {
        throw normalizeAdapterError("updateTenantSettings", error)
      }
    },
  }
}
