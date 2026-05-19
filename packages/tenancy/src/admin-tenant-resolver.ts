import { readConfiguredTenantId } from "./default-tenant-id"
import type { AdminTenantContext } from "./types"

/**
 * Admin tenant id for server actions (legacy shape).
 * Prefer `resolveAdminTenantContext` from `@sovereign-cms/runtime` for new code.
 */

function normalizeHost(host?: string): string | undefined {
  if (!host) return undefined
  const trimmed = host.trim().toLowerCase()
  if (!trimmed) return undefined
  return (trimmed.split(":")[0] ?? trimmed) || undefined
}

export function resolveAdminTenant(input: {
  host?: string
  env?: NodeJS.ProcessEnv
}): AdminTenantContext {
  const env = input.env ?? process.env

  const envTenantId = env.LOCAL_TENANT_ID?.trim()
  if (envTenantId) {
    return { tenantId: envTenantId, source: "env" }
  }

  const host = normalizeHost(input.host)
  const tenantId = readConfiguredTenantId(env)
  if (host === "localhost") {
    return { tenantId, source: "host" }
  }

  return { tenantId, source: "fallback" }
}

