import type { CmsPage } from "@sovereign-cms/core"
import { PersistenceAdapterError } from "./errors"
import { requireAdapterTenantId } from "./require-tenant-id"

/**
 * Validates explicit adapter scope tenantId and optional input tenantId match (Phase 71).
 */
export function requireScopedContentTenantId(
  scopeTenantId: string,
  inputTenantId: string | undefined,
  operation: string,
): string {
  const tenantId = requireAdapterTenantId(scopeTenantId, operation)

  if (inputTenantId !== undefined) {
    const inputTrimmed = inputTenantId.trim()
    if (inputTrimmed.length > 0 && inputTrimmed !== tenantId) {
      throw new PersistenceAdapterError(
        "tenant_scope_mismatch",
        `${operation}: input tenantId does not match scoped tenantId`,
      )
    }
  }

  return tenantId
}

export function assertPageOwnedByTenant(
  page: CmsPage | null,
  tenantId: string,
  pageId: string,
  operation: string,
): asserts page is CmsPage {
  if (!page) {
    throw new PersistenceAdapterError(
      "page_not_found",
      `${operation}: page not found for tenant ${tenantId} (pageId=${pageId})`,
    )
  }

  if (page.tenantId !== tenantId) {
    throw new PersistenceAdapterError(
      "tenant_scope_mismatch",
      `${operation}: page ${pageId} belongs to tenant ${page.tenantId}, not ${tenantId}`,
    )
  }
}
