import type { TransitionPageStatusInput, TransitionPageStatusResult } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export type CreatePageStatusPersistenceInput = {
  db: DatabaseAdapter
}

/**
 * Creates a runtime-managed page status persistence adapter.
 * Delegates status transitions to DatabaseAdapter.pages.transitionStatus.
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
        const page = await input.db.pages.transitionStatus(transitionInput)

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
