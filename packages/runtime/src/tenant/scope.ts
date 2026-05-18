/**
 * Explicit tenant scope for server-side runtime operations (Phase 70).
 * No DB access, no provider logic, no client imports.
 */

export type TenantRuntimeScope = {
  tenantId: string
  locale?: string
  brand?: string
}

export class TenantScopeError extends Error {
  readonly code = "tenant_scope_invalid"

  constructor(message: string) {
    super(message)
    this.name = "TenantScopeError"
  }
}

export function assertTenantScope(scope: TenantRuntimeScope): TenantRuntimeScope {
  const tenantId = scope.tenantId?.trim()
  if (!tenantId) {
    throw new TenantScopeError("tenantId is required for tenant-scoped runtime operations")
  }

  const locale = scope.locale?.trim()
  const brand = scope.brand?.trim()

  return {
    tenantId,
    ...(locale ? { locale } : {}),
    ...(brand ? { brand } : {}),
  }
}
