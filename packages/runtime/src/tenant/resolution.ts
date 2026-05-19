import { assertTenantScope, TenantScopeError, type TenantRuntimeScope } from "./scope"

export type TenantResolutionSource =
  | "explicit"
  | "host"
  | "route"
  | "default"
  | "admin-selection"
  | "preview"

export type ResolvedTenantContext = {
  tenantId: string
  source: TenantResolutionSource
  host?: string
  routeTenant?: string
  locale?: string
  brand?: string
}

export function createResolvedTenantContext(input: {
  tenantId: string
  source: TenantResolutionSource
  host?: string
  routeTenant?: string
  locale?: string
  brand?: string
}): ResolvedTenantContext {
  const tenantId = input.tenantId?.trim()
  if (!tenantId) {
    throw new TenantScopeError("tenantId is required after tenant resolution")
  }

  const locale = input.locale?.trim()
  const brand = input.brand?.trim()
  const host = input.host?.trim()
  const routeTenant = input.routeTenant?.trim()

  return {
    tenantId,
    source: input.source,
    ...(host ? { host } : {}),
    ...(routeTenant ? { routeTenant } : {}),
    ...(locale ? { locale } : {}),
    ...(brand ? { brand } : {}),
  }
}

export function toTenantRuntimeScope(context: ResolvedTenantContext): TenantRuntimeScope {
  return assertTenantScope({
    tenantId: context.tenantId,
    locale: context.locale,
    brand: context.brand,
  })
}
