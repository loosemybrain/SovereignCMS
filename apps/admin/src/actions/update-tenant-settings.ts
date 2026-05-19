"use server"

import type { UpdateTenantSettingsInput, UpdateTenantSettingsResult } from "@sovereign-cms/core"
import { resolveAdminWriteScope } from "@/lib/resolve-admin-write-scope"

/** Server-side tenant settings update. Phase 72: scoped settings adapter write. */
export async function updateTenantSettingsAction(
  input: UpdateTenantSettingsInput,
): Promise<UpdateTenantSettingsResult> {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid updateTenantSettings input")
  }

  const { runtime, scope } = resolveAdminWriteScope({
    clientTenantId: input.tenantId,
    operation: "settings:manage",
  })

  return runtime.settingsPersistence.updateTenantSettings({
    ...input,
    tenantId: scope.tenantId,
  })
}
