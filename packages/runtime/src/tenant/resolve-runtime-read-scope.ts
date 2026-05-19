import { toTenantRuntimeScope, type ResolvedTenantContext } from "./resolution"
import type { TenantRuntimeScope } from "./scope"

export type ResolveRuntimeReadScopeInput = {
  resolved: ResolvedTenantContext
  locale?: string
  brand?: string
}

/**
 * Deterministic operational read scope from Phase 73 tenant resolution (Phase 74).
 * No ambient context — callers pass explicit resolved tenant context.
 */
export function resolveRuntimeReadScope(
  input: ResolveRuntimeReadScopeInput,
): TenantRuntimeScope {
  return toTenantRuntimeScope({
    ...input.resolved,
    ...(input.locale ? { locale: input.locale } : {}),
    ...(input.brand ? { brand: input.brand } : {}),
  })
}
