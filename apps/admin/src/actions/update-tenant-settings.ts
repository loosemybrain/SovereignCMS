"use server"

import type { UpdateTenantSettingsInput, UpdateTenantSettingsResult } from "@sovereign-cms/core"
import { createRuntime } from "@sovereign-cms/runtime"

export async function updateTenantSettingsAction(
  input: UpdateTenantSettingsInput,
): Promise<UpdateTenantSettingsResult> {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid updateTenantSettings input")
  }

  const runtime = createRuntime()

  return runtime.settingsPersistence.updateTenantSettings(input)
}
