import type { TransitionPageStatusInput, TransitionPageStatusResult } from "@sovereign-cms/core"
import type { ContentPersistenceAdapter } from "@sovereign-cms/db"

export type CreatePageStatusPersistenceInput = {
  content: ContentPersistenceAdapter
}

/**
 * Creates a runtime-managed page status persistence facade.
 * Delegates to ContentPersistenceAdapter.transitionPageStatus (tenant-scoped, Phase 71).
 * persisted=false indicates this is InMemory/Mock persistence (no durable storage).
 */
export function createPageStatusPersistence(
  input: CreatePageStatusPersistenceInput,
) {
  return {
    async transitionPageStatus(
      transitionInput: TransitionPageStatusInput,
    ): Promise<TransitionPageStatusResult> {
      try {
        const page = await input.content.transitionPageStatus({
          tenantId: transitionInput.tenantId,
          input: transitionInput,
        })

        return {
          success: true,
          status: page.status,
          transitionedAt: new Date().toISOString(),
          persisted: false, // InMemory/Mock – not durable
        }
      } catch (error) {
        console.error("[runtime-page-status-persistence] transition failed", error)
        throw error
      }
    },
  }
}
