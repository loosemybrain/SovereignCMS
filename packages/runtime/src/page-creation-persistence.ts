import type { CreatePageInput, CreatePageResult } from "@sovereign-cms/core"
import type { ContentPersistenceAdapter } from "@sovereign-cms/db"

export type CreatePageCreationPersistenceInput = {
  content: ContentPersistenceAdapter
}

/**
 * Creates a runtime-managed page creation persistence adapter.
 * Delegates page creation to ContentPersistenceAdapter.createPage (tenant-scoped, Phase 71).
 * persisted=false indicates this is InMemory/Mock persistence (no durable storage).
 */
export function createPageCreationPersistence(input: CreatePageCreationPersistenceInput) {
  return {
    async createPage(createInput: CreatePageInput): Promise<CreatePageResult> {
      try {
        const page = await input.content.createPage({
          tenantId: createInput.tenantId,
          input: createInput,
        })

        return {
          success: true,
          page,
          createdAt: new Date().toISOString(),
          persisted: false, // InMemory/Mock – not durable
        }
      } catch (error) {
        console.error("[runtime-page-creation-persistence] creation failed", error)
        throw error
      }
    },
  }
}
