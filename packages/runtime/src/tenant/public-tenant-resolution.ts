import { getDefaultTenantId } from "./default-tenant"
import { createResolvedTenantContext, type ResolvedTenantContext } from "./resolution"

/**
 * Synchronous public tenant resolution (Phase 73).
 * No DB/host lookup — host is recorded for future domain mapping.
 */
export function resolvePublicTenantContext(input: {
  host?: string
  routeTenant?: string
  locale?: string
  brand?: string
}): ResolvedTenantContext {
  const host = input.host?.trim()
  const routeTenant = input.routeTenant?.trim()

  if (routeTenant) {
    return createResolvedTenantContext({
      tenantId: routeTenant,
      source: "route",
      host,
      routeTenant,
      locale: input.locale,
      brand: input.brand,
    })
  }

  return createResolvedTenantContext({
    tenantId: getDefaultTenantId(),
    source: "default",
    host,
    locale: input.locale,
    brand: input.brand,
  })
}
