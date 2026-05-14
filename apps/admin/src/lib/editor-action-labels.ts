import type { ContentStatus, ContentTransitionAction } from "@sovereign-cms/core"
import { isContentStatus } from "@sovereign-cms/core"

const STATUS_DE: Record<ContentStatus, string> = {
  draft: "Entwurf",
  published: "Veröffentlicht",
  archived: "Archiviert",
}

const TRANSITION_DE: Record<ContentTransitionAction, string> = {
  publish: "Veröffentlichen",
  archive: "Archivieren",
  restoreDraft: "Als Entwurf wiederherstellen",
}

/** Admin editor: German display for persisted page status. */
export function getEditorPageStatusDisplay(status: string): string {
  if (isContentStatus(status)) {
    return STATUS_DE[status]
  }
  return status
}

/** Admin editor: German button labels for workflow actions (UI only; transitions unchanged). */
export function getEditorTransitionActionLabel(action: ContentTransitionAction): string {
  return TRANSITION_DE[action]
}
