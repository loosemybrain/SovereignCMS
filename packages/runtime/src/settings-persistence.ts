import type {
  TenantSettings,
  UpdateTenantSettingsInput,
  UpdateTenantSettingsResult,
} from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export type CreateSettingsPersistenceInput = {
  db: DatabaseAdapter
}

export function createSettingsPersistence(input: CreateSettingsPersistenceInput) {
  const { db } = input

  return {
    async getTenantSettings(params: { tenantId: string }): Promise<TenantSettings> {
      return db.settings.getByTenant(params)
    },

    async updateTenantSettings(
      updateInput: UpdateTenantSettingsInput,
    ): Promise<UpdateTenantSettingsResult> {
      const settings = await db.settings.update(updateInput)

      return {
        success: true,
        settings,
        updatedAt: settings.updatedAt,
        persisted: false,
      }
    },
  }
}
