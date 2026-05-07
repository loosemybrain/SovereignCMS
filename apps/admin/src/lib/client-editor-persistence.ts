/**
 * Client-side editor persistence mock.
 * This is a TEMPORARY implementation for Phase 12.1.
 * In later phases, this will be replaced with a proper server-side Runtime boundary
 * that allows secure persistence via API routes or server actions.
 */
import type { EditorPersistence, SavePageDraftInput, SavePageDraftResult } from "@sovereign-cms/core"

export const clientEditorPersistence: EditorPersistence = {
  async savePageDraft(input: SavePageDraftInput): Promise<SavePageDraftResult> {
    console.log("[client-mock-save] saving draft", input)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      savedAt: new Date().toISOString(),
    }
  },
}
