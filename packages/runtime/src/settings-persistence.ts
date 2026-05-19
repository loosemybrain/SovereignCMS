import type {
  TenantSettings,
  UpdateTenantSettingsInput,
  UpdateTenantSettingsResult,
} from "@sovereign-cms/core"
import type { SettingsPersistenceAdapter } from "@sovereign-cms/db"

export type CreateSettingsPersistenceInput = {
  settings: SettingsPersistenceAdapter
}

export function createSettingsPersistence(input: CreateSettingsPersistenceInput) {
  const { settings } = input

  return {
    async getTenantSettings(params: { tenantId: string }): Promise<TenantSettings> {
      return settings.getTenantSettings(params)
    },

    async getBrandSettings(params: {
      tenantId: string
      brand: string
    }): Promise<TenantSettings> {
      return settings.getBrandSettings(params)
    },

    async updateTenantSettings(
      updateInput: UpdateTenantSettingsInput,
    ): Promise<UpdateTenantSettingsResult> {
      const settingsResult = await settings.updateTenantSettings({
        tenantId: updateInput.tenantId,
        input: updateInput,
      })

      return {
        success: true,
        settings: settingsResult,
        updatedAt: settingsResult.updatedAt,
        persisted: false,
      }
    },
  }
}
