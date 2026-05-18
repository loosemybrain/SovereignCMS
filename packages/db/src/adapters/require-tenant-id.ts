import { PersistenceAdapterError } from "./errors"

/** Adapter-layer guard: content reads must receive an explicit tenant id. */
export function requireAdapterTenantId(tenantId: string, operation: string): string {
  const trimmed = tenantId?.trim()
  if (!trimmed) {
    throw new PersistenceAdapterError(
      "tenant_scope_required",
      `${operation}: tenantId is required`,
    )
  }
  return trimmed
}
