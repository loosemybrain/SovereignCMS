"use server"

import { createRuntime } from "@sovereign-cms/runtime"
import type { TransitionPageStatusInput, TransitionPageStatusResult } from "@sovereign-cms/core"

/**
 * Server-side status transition boundary for pages.
 * 
 * This action:
 * 1. Validates input on server
 * 2. Creates runtime on the server (safe - no client exposure)
 * 3. Delegates to runtime.pageStatusPersistence.transitionPageStatus
 * 4. Returns result to client
 *
 * In future phases, this can be replaced with a real API route
 * or enhanced with authentication/authorization checks.
 */
export async function transitionPageStatusAction(
  input: TransitionPageStatusInput,
): Promise<TransitionPageStatusResult> {
  // Minimal input validation
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

  // Create runtime on server (safe - no exposure to client)
  const runtime = createRuntime()

  // Delegate to runtime persistence layer
  return runtime.pageStatusPersistence.transitionPageStatus(input)
}
