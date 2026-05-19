"use server"

import type { SavePageDraftInput, SavePageDraftResult } from "@sovereign-cms/core"
import { stripMediaCompositionMetadata } from "@sovereign-cms/runtime"
import { resolveAdminContentWriteScope } from "@/lib/resolve-admin-content-write-scope"

/**
 * Server-side save boundary for page editor drafts.
 *
 * Phase 71: tenant scope is resolved centrally; block writes go through
 * ContentPersistenceAdapter.saveBlocks with page-ownership checks.
 */
export async function savePageDraftAction(
  input: SavePageDraftInput,
): Promise<SavePageDraftResult> {
  if (!input.tenantId || typeof input.tenantId !== "string") {
    throw new Error("Invalid input: tenantId is required")
  }

  if (!input.pageId || typeof input.pageId !== "string") {
    throw new Error("Invalid input: pageId is required")
  }

  if (!input.locale || typeof input.locale !== "string") {
    throw new Error("Invalid input: locale is required")
  }

  if (!Array.isArray(input.blocks)) {
    throw new Error("Invalid input: blocks must be an array")
  }

  const { runtime, scope } = resolveAdminContentWriteScope({
    clientTenantId: input.tenantId,
    locale: input.locale,
    operation: "page:update",
  })

  return runtime.editorPersistence.savePageDraft({
    ...input,
    tenantId: scope.tenantId,
    blocks: stripMediaCompositionMetadata(input.blocks),
  })
}
