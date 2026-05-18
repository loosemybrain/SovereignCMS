import type { ContentTransitionAction } from "@sovereign-cms/core"
import { isContentStatus } from "@sovereign-cms/core"
import type { AdminUiLocale } from "@/lib/admin-i18n"
import { getAdminMessages } from "@/lib/admin-i18n"

/** Admin editor: display for persisted page status (UI locale). */
export function getEditorPageStatusDisplay(status: string, locale: AdminUiLocale): string {
  const m = getAdminMessages(locale).contentStatus
  if (isContentStatus(status)) {
    return m[status]
  }
  return status
}

/** Admin editor: button labels for workflow actions (UI only; transitions unchanged). */
export function getEditorTransitionActionLabel(
  action: ContentTransitionAction,
  locale: AdminUiLocale,
): string {
  const m = getAdminMessages(locale).contentStatus
  switch (action) {
    case "publish":
      return m.publish
    case "archive":
      return m.archive
    case "restoreDraft":
      return m.restoreDraft
    default:
      return action
  }
}
