import type { EditorPersistence, SavePageDraftInput, SavePageDraftResult } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export type CreateEditorPersistenceInput = {
  db: DatabaseAdapter
}

/**
 * Creates a runtime-managed editor persistence adapter.
 * Delegates block saves to DatabaseAdapter.blocks.replacePageBlocks.
 * persisted=false indicates this is InMemory/Mock persistence (no durable storage).
 */
export function createEditorPersistence(input: CreateEditorPersistenceInput): EditorPersistence {
  return {
    async savePageDraft(draftInput: SavePageDraftInput): Promise<SavePageDraftResult> {
      try {
        const blocks = await input.db.blocks.replacePageBlocks({
          tenantId: draftInput.tenantId,
          pageId: draftInput.pageId,
          locale: draftInput.locale,
          blocks: draftInput.blocks,
        })

        const savedAt = new Date().toISOString()

        return {
          success: true,
          savedAt,
          persisted: false, // InMemory/Mock – not durable
          updatedBlocks: blocks,
        }
      } catch (error) {
        console.error("[runtime-persistence] save draft failed", error)
        throw error
      }
    },
  }
}
