"use client"

import { AdminButton, AdminCard } from "@/components/admin-ui"
import { EditorHint, EditorStatusPanel } from "@/components/editor/patterns"

type EditorToolbarProps = {
  isDirty: boolean
  isSaving: boolean
  saveError: string | null
  lastSavedAt: string | null
  lastSavedStatus?: string | null
  currentPageStatus?: string
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
  onSave,
  canSave,
}: EditorToolbarProps) {
  return (
    <AdminCard className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm space-y-1" aria-live="polite">
          {isSaving ? <EditorHint tone="info">Saving in progress...</EditorHint> : null}
          {saveError ? <EditorHint tone="danger">Save error: {saveError}</EditorHint> : null}
          {!isSaving && isDirty ? <EditorHint tone="warning">Unsaved changes</EditorHint> : null}
          <EditorStatusPanel
            statusItems={[
              {
                label: "Last saved",
                value: lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : "Not saved yet",
                tone: lastSavedAt ? "success" : "muted",
              },
              {
                label: "Saved status",
                value: lastSavedStatus ? lastSavedStatus : "n/a",
                tone: lastSavedStatus ? "default" : "muted",
              },
              {
                label: "Current page status",
                value: currentPageStatus ?? "n/a",
                tone: currentPageStatus ? "default" : "muted",
              },
            ]}
          />
        </div>

        <AdminButton onClick={onSave} disabled={!canSave} variant="primary">
          {isSaving ? "Saving..." : "Save"}
        </AdminButton>
      </div>
    </AdminCard>
  )
}
