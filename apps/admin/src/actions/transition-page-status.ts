"use server"

import type { TransitionPageStatusInput, TransitionPageStatusResult } from "@sovereign-cms/core"
import { resolveAdminContentWriteScope } from "@/lib/resolve-admin-content-write-scope"

/**
 * Server-side status transition boundary for pages.
 *
 * Phase 71: publish/archive/restore uses tenant-scoped transitionPageStatus.
 * Permission hook: page:publish (enforcement deferred until auth subject is reliable).
 */
export async function transitionPageStatusAction(
  input: TransitionPageStatusInput,
): Promise<TransitionPageStatusResult> {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid input: tenantId is required")
  }

  if (typeof input.pageId !== "string" || input.pageId.length === 0) {
    throw new Error("Invalid input: pageId is required")
  }

  if (typeof input.locale !== "string" || input.locale.length === 0) {
    throw new Error("Invalid input: locale is required")
  }

  if (!input.action) {
    throw new Error("Invalid input: action is required")
  }

  const { runtime, scope } = resolveAdminContentWriteScope({
    clientTenantId: input.tenantId,
    locale: input.locale,
    operation: "page:publish",
  })

  return runtime.pageStatusPersistence.transitionPageStatus({
    ...input,
    tenantId: scope.tenantId,
  })
}
