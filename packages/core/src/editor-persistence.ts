import type { SavePageDraftInput, SavePageDraftResult } from "./editor"

/**
 * Interface für Editor-Persistenz.
 * Abstrahiert Speichervorgänge (Mock, API, später DB).
 */
export interface EditorPersistence {
  savePageDraft(input: SavePageDraftInput): Promise<SavePageDraftResult>
}
