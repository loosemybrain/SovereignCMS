import type { AdminTenantContext } from "./types"

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
  if (host === "localhost") {
    return { tenantId: "demo", source: "host" }
  }

  return { tenantId: "demo", source: "fallback" }
}

