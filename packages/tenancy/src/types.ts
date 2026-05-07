export type TenantId = string

export type TenantContext = {
  id: TenantId
  slug: string
  displayName: string
  /** Optionale Metadaten (Plan, Region, …) ohne Vendor-Lock-in. */
  attributes?: Readonly<Record<string, string | number | boolean>>
}

export type TenantResolutionInput = {
  hostname?: string
  /** z. B. aus einem internen Header für Edge-/API-Gateways */
  headerTenantId?: string
  /** Explizite Tenant-ID (CLI, Jobs) */
  explicitTenantId?: string
}

export type AdminTenantContext = {
  tenantId: string
  source: "host" | "env" | "fallback"
}
