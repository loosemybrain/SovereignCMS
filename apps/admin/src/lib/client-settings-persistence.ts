/**
 * Client-side settings persistence adapter.
 *
 * Delegates to server-side boundaries via server actions so runtime objects
 * are never exposed to the client.
 */
import type { UpdateTenantSettingsInput } from "@sovereign-cms/core"
import { loadTenantSettingsAction } from "@/actions/load-tenant-settings"
import { updateTenantSettingsAction } from "@/actions/update-tenant-settings"

export const clientSettingsPersistence = {
  async loadTenantSettings(input: { tenantId: string }) {
    return loadTenantSettingsAction(input)
  },

  async updateTenantSettings(input: UpdateTenantSettingsInput) {
    return updateTenantSettingsAction(input)
  },
}
