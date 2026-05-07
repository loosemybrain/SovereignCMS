"use server"

import { createRuntime } from "@sovereign-cms/runtime"
import type { CreatePageInput, CreatePageResult } from "@sovereign-cms/core"

/**
 * Server-side page creation boundary.
 *
 * This action:
 * 1. Validates input on server
 * 2. Creates runtime on the server (safe - no client exposure)
 * 3. Delegates to runtime.pageCreationPersistence.createPage
 * 4. Returns result to client
 */
export async function createPageAction(input: CreatePageInput): Promise<CreatePageResult> {
  // Minimal input validation
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

  // Create runtime on server (safe - no exposure to client)
  const runtime = createRuntime()

  // Delegate to runtime persistence layer
  return runtime.pageCreationPersistence.createPage(input)
}
