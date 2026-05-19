import { getDefaultTenantId } from "./default-tenant"
import { createResolvedTenantContext, type ResolvedTenantContext } from "./resolution"

/**
 * Preview/editor tenant resolution (Phase 73).
 * Prefer tenant from page/editor context; default fallback is temporary for open admin.
 */
export function resolvePreviewTenantContext(input: {
  tenantId?: string
  pageId?: string
  locale?: string
  brand?: string
}): ResolvedTenantContext {
  const tenantId = input.tenantId?.trim()
  if (tenantId) {
    return createResolvedTenantContext({
      tenantId,
      source: "preview",
      locale: input.locale,
      brand: input.brand,
    })
  }

  return createResolvedTenantContext({
    tenantId: getDefaultTenantId(),
    source: "default",
    locale: input.locale,
    brand: input.brand,
  })
}
