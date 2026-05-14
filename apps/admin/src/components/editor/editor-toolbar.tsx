"use client"

import type { ReactNode } from "react"
import { Save } from "lucide-react"
import { AdminButton } from "@/components/admin-ui"
import { EditorHint, EditorStatusPanel } from "@/components/editor/patterns"
import { getEditorPageStatusDisplay } from "@/lib/editor-action-labels"

type EditorToolbarProps = {
  isDirty: boolean
  isSaving: boolean
  saveError: string | null
  lastSavedAt: string | null
  lastSavedStatus?: string | null
  currentPageStatus?: string
  onSave: () => void
  canSave: boolean
  /** Editorial workflow actions (e.g. publish) — same handlers as before, grouped below metadata. */
  footer?: ReactNode
}

export function EditorToolbar({
  isDirty,
  isSaving,
  saveError,
  lastSavedAt,
  lastSavedStatus,
  currentPageStatus,
  onSave,
  canSave,
  footer,
}: EditorToolbarProps) {
  const statusLine = currentPageStatus ? getEditorPageStatusDisplay(currentPageStatus) : null

  return (
    <div className="admin-gov-editor-action-rail overflow-hidden">
      <div className="admin-editor-toolbar-sticky flex flex-col gap-3 border-b admin-border px-[var(--admin-toolbar-pad-x)] py-[var(--admin-toolbar-pad-y)] min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between">
        <div className="admin-editor-workflow-intro space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] admin-text-muted">Entwurf und Speichern</p>
          {statusLine ? (
            <p className="text-xs leading-snug admin-text">
              <span className="admin-text-muted">Seitenstatus · </span>
              <span className="font-medium tabular-nums">{statusLine}</span>
            </p>
          ) : (
            <p className="text-xs admin-text-muted">Speichern sichert den Entwurf. Veröffentlichen und Archiv steuern Sie im Workflow unten.</p>
          )}
        </div>
        <AdminButton
          onClick={onSave}
          disabled={!canSave}
          variant="primary"
          size="sm"
          isLoading={isSaving}
          className="admin-editor-save-primary min-w-[7.5rem] shrink-0 gap-2 px-4 shadow-sm"
          aria-label={isSaving ? "Entwurf wird gespeichert" : "Entwurf speichern"}
        >
          <Save className="h-4 w-4 opacity-90" aria-hidden />
          {isSaving ? "Speichern…" : "Speichern"}
        </AdminButton>
      </div>

      <div className="space-y-3 px-[var(--admin-toolbar-pad-x)] py-4">
        <div className="min-w-0 space-y-1.5 text-sm" aria-live="polite">
          {isSaving ? <EditorHint tone="info">Speichern läuft …</EditorHint> : null}
          {saveError ? <EditorHint tone="danger">Speichern fehlgeschlagen: {saveError}</EditorHint> : null}
          {!isSaving && isDirty ? <EditorHint tone="warning">Ungespeicherte Änderungen</EditorHint> : null}
          <EditorStatusPanel
            className="admin-gov-meta-panel p-2.5"
            statusItems={[
              {
                label: "Zuletzt gespeichert",
                value: lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : "Noch nicht gespeichert",
                tone: lastSavedAt ? "success" : "muted",
              },
              {
                label: "Stand nach Speichern",
                value: lastSavedStatus ? lastSavedStatus : "—",
                tone: lastSavedStatus ? "default" : "muted",
              },
              {
                label: "Seitenstatus",
                value: currentPageStatus ? getEditorPageStatusDisplay(currentPageStatus) : "—",
                tone: currentPageStatus ? "default" : "muted",
              },
            ]}
          />
        </div>
      </div>

      {footer ? (
        <div className="admin-surface-editor-rail-footer border-t admin-border px-[var(--admin-toolbar-pad-x)] py-3">
          {footer}
        </div>
      ) : null}
    </div>
  )
}
