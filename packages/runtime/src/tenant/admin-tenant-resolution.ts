import { getDefaultTenantId } from "./default-tenant"
import { createResolvedTenantContext, type ResolvedTenantContext } from "./resolution"

/**
 * Synchronous admin tenant resolution (Phase 73).
 * No membership lookup, no tenant selector UI.
 */
export function resolveAdminTenantContext(input: {
  explicitTenantId?: string
  selectedTenantId?: string
  locale?: string
  brand?: string
  host?: string
}): ResolvedTenantContext {
  const explicit = input.explicitTenantId?.trim()
  if (explicit) {
    return createResolvedTenantContext({
      tenantId: explicit,
      source: "explicit",
      host: input.host,
      locale: input.locale,
      brand: input.brand,
    })
  }

  const selected = input.selectedTenantId?.trim()
  if (selected) {
    return createResolvedTenantContext({
      tenantId: selected,
      source: "admin-selection",
      host: input.host,
      locale: input.locale,
      brand: input.brand,
    })
  }

  return createResolvedTenantContext({
    tenantId: getDefaultTenantId(),
    source: "default",
    host: input.host,
    locale: input.locale,
    brand: input.brand,
  })
}
