"use client"

import type { ContentTransitionAction } from "@sovereign-cms/core"
import { isContentStatus } from "@sovereign-cms/core"
import { Save } from "lucide-react"
import { cn } from "@sovereign-cms/ui"
import { AdminButton } from "@/components/admin-ui"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { getEditorPageStatusDisplay, getEditorTransitionActionLabel } from "@/lib/editor-action-labels"

type EditorToolbarProps = {
  isDirty: boolean
  isSaving: boolean
  saveError: string | null
  lastSavedAt: string | null
  lastSavedStatus?: string | null
  currentPageStatus?: string
  governanceReady?: boolean
  statusTransitionError?: string | null
  isTransitioningStatus?: boolean
  transitionActions?: ContentTransitionAction[]
  onTransitionAction?: (action: ContentTransitionAction) => void
  onSave: () => void
  canSave: boolean
}

export function EditorToolbar({
  isDirty,
  isSaving,
  saveError,
  lastSavedAt,
  lastSavedStatus,
  currentPageStatus,
  governanceReady,
  statusTransitionError,
  isTransitioningStatus = false,
  transitionActions = [],
  onTransitionAction,
  onSave,
  canSave,
}: EditorToolbarProps) {
  const { locale, messages: t } = useAdminI18n()
  const e = t.editor
  const g = t.publishGovernance
  const statusLine = currentPageStatus ? getEditorPageStatusDisplay(currentPageStatus, locale) : null
  const lastSavedLabel = lastSavedAt
    ? `${e.lastSaved} ${new Date(lastSavedAt).toLocaleTimeString()}`
    : e.notSavedYet
  const hasAlerts = Boolean(saveError || statusTransitionError)

  return (
    <div className="admin-editor-action-rail">
      <div className="admin-editor-action-bar" role="region" aria-label={e.draftAndSave}>
        <div className="admin-editor-action-meta">
          {currentPageStatus && isContentStatus(currentPageStatus) ? (
            <ContentStatusBadge status={currentPageStatus} />
          ) : statusLine ? (
            <span className="admin-editor-status-fallback">{statusLine}</span>
          ) : null}
          <span
            className={cn(
              "admin-editor-save-state",
              isDirty && "admin-editor-save-state--dirty",
              !isDirty && lastSavedAt && "admin-editor-save-state--saved",
            )}
            aria-live="polite"
          >
            {isSaving ? e.saveRunning : isDirty ? e.unsavedChanges : lastSavedLabel}
          </span>
          {lastSavedStatus && !isDirty ? (
            <span className="admin-editor-save-state-secondary" title={e.statusAfterSave}>
              {lastSavedStatus}
            </span>
          ) : null}
        </div>

        <div className="admin-editor-action-state">
          {governanceReady !== undefined ? (
            <span
              role="status"
              className={cn(
                "admin-editor-governance-pill",
                governanceReady
                  ? "admin-editor-governance-pill--ready"
                  : "admin-editor-governance-pill--review",
              )}
              aria-label={governanceReady ? g.toolbarReady : g.toolbarReview}
              title={governanceReady ? g.toolbarReady : g.toolbarReview}
            >
              {governanceReady ? g.toolbarReadyShort : g.toolbarReviewShort}
            </span>
          ) : null}
        </div>

        <div className="admin-editor-action-buttons">
          <AdminButton
            onClick={onSave}
            disabled={!canSave}
            variant="primary"
            size="sm"
            isLoading={isSaving}
            className="admin-editor-save-primary shrink-0 gap-1.5 px-3"
            aria-label={isSaving ? e.savingAria : e.saveAria}
          >
            <Save className="h-3.5 w-3.5 opacity-90" aria-hidden />
            {isSaving ? e.saving : e.save}
          </AdminButton>
          {transitionActions.map((action) => (
            <AdminButton
              key={action}
              type="button"
              variant={
                action === "publish" ? "primary" : action === "archive" ? "destructive" : "secondary"
              }
              size="sm"
              onClick={() => onTransitionAction?.(action)}
              disabled={isTransitioningStatus}
              className="shrink-0"
              aria-label={getEditorTransitionActionLabel(action, locale)}
            >
              {isTransitioningStatus ? "…" : getEditorTransitionActionLabel(action, locale)}
            </AdminButton>
          ))}
        </div>
      </div>

      {hasAlerts ? (
        <div className="admin-editor-action-alerts" aria-live="assertive">
          {saveError ? (
            <p className="admin-editor-action-alert admin-error text-xs font-medium" role="alert">
              <span className="font-semibold">{e.saveFailed}:</span> {saveError}
            </p>
          ) : null}
          {statusTransitionError ? (
            <p className="admin-editor-action-alert admin-error text-xs font-medium" role="alert">
              <span className="font-semibold">{e.statusTransitionFailed}:</span> {statusTransitionError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
