import type { EditorPersistence, SavePageDraftInput, SavePageDraftResult } from "@sovereign-cms/core"

/**
 * Creates a runtime-managed editor persistence adapter.
 * Currently uses in-memory mock. Later phases will integrate with API or DB.
 */
export function createEditorPersistence(): EditorPersistence {
  return {
    async savePageDraft(input: SavePageDraftInput): Promise<SavePageDraftResult> {
      console.log("[runtime-persistence] save draft", input)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        success: true,
        savedAt: new Date().toISOString(),
      }
    },
  }
}
