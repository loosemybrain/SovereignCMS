/**
 * Client-side page creation persistence adapter.
 *
 * Implements page creation by delegating to the server-side boundary
 * via createPageAction.
 *
 * This ensures:
 * - Runtime objects are never exposed to client
 * - Clean server/client boundary
 * - Type-safe page creation contracts
 * - InMemory/Mock persistence (persisted=false)
 */
import type { CreatePageInput, CreatePageResult } from "@sovereign-cms/core"
import { createPageAction } from "@/actions/create-page"

export const clientPageCreationPersistence = {
  async createPage(input: CreatePageInput): Promise<CreatePageResult> {
    try {
      console.log("[client-page-creation-persistence] delegating to server action", {
        tenantId: input.tenantId,
        locale: input.locale,
        slug: input.slug,
        title: input.title,
      })

      // Delegate to server-side creation boundary
      const result = await createPageAction(input)

      console.log("[client-page-creation-persistence] server action succeeded", {
        success: result.success,
        pageId: result.page.id,
        createdAt: result.createdAt,
        persisted: result.persisted,
      })

      return result
    } catch (error) {
      console.error("[client-page-creation-persistence] server action failed", error)

      // Return failure result
      throw error
    }
  },
}
