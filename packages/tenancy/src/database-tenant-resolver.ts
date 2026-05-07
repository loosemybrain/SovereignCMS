import type { DatabaseAdapter } from "@sovereign-cms/db"
import type { TenantContext } from "./types"

export interface TenantResolver {
  resolveByHost(host: string): Promise<TenantContext | null>
}

function normalizeHost(host: string): string {
  const trimmed = host.trim().toLowerCase()
  return trimmed.split(":")[0] ?? trimmed
}

function tenantRowToContext(row: unknown): TenantContext | null {
  if (!row || typeof row !== "object") return null
  const o = row as Record<string, unknown>
  if (
    typeof o.id !== "string" ||
    typeof o.slug !== "string" ||
    typeof o.displayName !== "string"
  ) {
    return null
  }
  return { id: o.id, slug: o.slug, displayName: o.displayName }
}

export function createDatabaseTenantResolver(db: DatabaseAdapter): TenantResolver {
  return {
    async resolveByHost(host) {
      const key = normalizeHost(host)
      if (!key) return null
      const row = await db.tenants.findByDomain(key)
      return tenantRowToContext(row)
    },
  }
}
