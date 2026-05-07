/**
 * Client-side editor persistence adapter.
 * 
 * Implements EditorPersistence interface but delegates actual persistence
 * to the server-side save boundary via savePageDraftAction.
 * 
 * This ensures:
 * - Runtime objects are never exposed to client
 * - Clean server/client boundary
 * - Type-safe persistence contracts
 * - InMemory/Mock persistence (persisted=false)
 *
 * In future phases, the underlying server action can be replaced with
 * a real API route or enhanced with authentication/authorization.
 */
import type { EditorPersistence, SavePageDraftInput, SavePageDraftResult } from "@sovereign-cms/core"
import { savePageDraftAction } from "@/actions/save-page-draft"

export const clientEditorPersistence: EditorPersistence = {
  async savePageDraft(input: SavePageDraftInput): Promise<SavePageDraftResult> {
    try {
      console.log("[client-editor-persistence] delegating to server action", {
        tenantId: input.tenantId,
        pageId: input.pageId,
        locale: input.locale,
        blockCount: input.blocks.length,
      })

      // Delegate to server-side save boundary
      const result = await savePageDraftAction(input)

      console.log("[client-editor-persistence] server action succeeded", {
        success: result.success,
        savedAt: result.savedAt,
        persisted: result.persisted,
      })

      return result
    } catch (error) {
      console.error("[client-editor-persistence] server action failed", error)

      return {
        success: false,
        savedAt: new Date().toISOString(),
        persisted: false,
        updatedBlocks: input.blocks,
      }
    }
  },
}
