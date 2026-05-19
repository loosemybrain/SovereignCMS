"use server"

import type { CreatePageInput, CreatePageResult } from "@sovereign-cms/core"
import { resolveAdminContentWriteScope } from "@/lib/resolve-admin-content-write-scope"

/**
 * Server-side page creation boundary.
 *
 * Phase 71: tenant-scoped createPage via ContentPersistenceAdapter.
 */
export async function createPageAction(input: CreatePageInput): Promise<CreatePageResult> {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid input: tenantId is required")
  }

  if (typeof input.locale !== "string" || input.locale.length === 0) {
    throw new Error("Invalid input: locale is required")
  }

  if (typeof input.slug !== "string" || input.slug.length === 0) {
    throw new Error("Invalid input: slug is required")
  }

  if (typeof input.title !== "string" || input.title.length === 0) {
    throw new Error("Invalid input: title is required")
  }

  const { runtime, scope } = resolveAdminContentWriteScope({
    clientTenantId: input.tenantId,
    locale: input.locale,
    operation: "page:create",
  })

  return runtime.pageCreationPersistence.createPage({
    ...input,
    tenantId: scope.tenantId,
  })
}
