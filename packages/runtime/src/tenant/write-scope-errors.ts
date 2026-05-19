import { PersistenceAdapterError } from "@sovereign-cms/db"
import { TenantScopeError } from "./scope"

/**
 * Normalizes write-scope failures for server actions (Phase 71).
 * Avoids leaking provider/DB internals to the client.
 */
export function toWriteScopeUserMessage(error: unknown): string {
  if (error instanceof TenantScopeError) {
    return error.message
  }

  if (error instanceof PersistenceAdapterError) {
    if (error.code === "tenant_scope_mismatch" || error.code === "tenant_scope_required") {
      return "Tenant scope is invalid for this write operation."
    }
    if (error.code === "page_not_found") {
      return "Page was not found for the current tenant."
    }
    if (error.code === "scan_not_found") {
      return "Privacy scan was not found for the current tenant."
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return "Write operation failed."
}
