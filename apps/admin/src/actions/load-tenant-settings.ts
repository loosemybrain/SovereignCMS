"use server"

import { resolveAdminOperationalReadScope } from "@/lib/resolve-admin-operational-read-scope"

/**
 * Server-authoritative tenant settings read (settings hardening).
 * Client tenantId is only used to detect scope mismatch — not as authority.
 */
export async function loadTenantSettingsAction(input: { tenantId: string }) {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid loadTenantSettings input")
  }

  const { runtime, scope } = resolveAdminOperationalReadScope({
    operation: "settings:read",
  })

  if (input.tenantId !== scope.tenantId) {
    throw new Error("client tenantId does not match server-resolved tenant scope")
  }

  return runtime.settingsPersistence.getTenantSettings({
    tenantId: scope.tenantId,
  })
}
