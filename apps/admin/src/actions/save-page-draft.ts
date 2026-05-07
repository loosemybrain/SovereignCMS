"use server"

import { createRuntime } from "@sovereign-cms/runtime"
import type { SavePageDraftInput, SavePageDraftResult } from "@sovereign-cms/core"

/**
 * Server-side save boundary for page editor drafts.
 * 
 * This action:
 * 1. Creates runtime on the server (safe - no client exposure)
 * 2. Validates input
 * 3. Delegates to runtime.editorPersistence.savePageDraft
 * 4. Returns result to client
 *
 * In future phases, this can be replaced with a real API route
 * or enhanced with authentication/authorization checks.
 */
export async function savePageDraftAction(
  input: SavePageDraftInput,
): Promise<SavePageDraftResult> {
  // Minimal input validation
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

  // Create runtime on server (safe - no exposure to client)
  const runtime = createRuntime()

  // Delegate to runtime persistence layer
  return runtime.editorPersistence.savePageDraft(input)
}
