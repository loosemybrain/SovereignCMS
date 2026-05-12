"use server"

import { createRuntime } from "@sovereign-cms/runtime"

export async function loadTenantSettingsAction(input: { tenantId: string }) {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid loadTenantSettings input")
  }

  const runtime = createRuntime()

  return runtime.settingsPersistence.getTenantSettings(input)
}
