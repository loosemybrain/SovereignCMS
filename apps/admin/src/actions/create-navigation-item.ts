"use server"

import type { CreateNavigationItemInput, CreateNavigationItemResult } from "@sovereign-cms/core"
import { resolveAdminWriteScope } from "@/lib/resolve-admin-write-scope"

/**
 * Server-side navigation item creation (main + footer via scope).
 * Phase 72: tenant-scoped adapter with page-ownership check for page links.
 */
export async function createNavigationItemAction(
  input: CreateNavigationItemInput,
): Promise<CreateNavigationItemResult> {
  if (
    typeof input.tenantId !== "string" ||
    input.tenantId.length === 0 ||
    typeof input.locale !== "string" ||
    input.locale.length === 0 ||
    typeof input.label !== "string" ||
    input.label.length === 0
  ) {
    throw new Error("Invalid createNavigationItem input")
  }

  if (input.scope !== undefined && input.scope !== "main" && input.scope !== "footer") {
    throw new Error("Invalid navigation scope")
  }

  const { runtime, scope } = resolveAdminWriteScope({
    clientTenantId: input.tenantId,
    locale: input.locale,
    operation: "navigation:manage",
  })

  return runtime.navigationPersistence.createNavigationItem({
    ...input,
    tenantId: scope.tenantId,
  })
}
