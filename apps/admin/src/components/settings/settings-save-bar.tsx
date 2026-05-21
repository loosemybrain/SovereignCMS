"use client"

import type { SettingsPersistenceMode } from "@sovereign-cms/core"
import { AdminButton } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { cn } from "@sovereign-cms/ui"

export type SettingsSaveBarStatus =
  | "idle"
  | "dirty"
  | "saving"
  | "saved_persisted"
  | "saved_memory"
  | "saved_unavailable"

type SettingsSaveBarProps = {
  isSaving: boolean
  hasUnsavedChanges: boolean
  lastPersistenceMode: SettingsPersistenceMode | null
  lastPersisted: boolean | null
  onSave: () => void
}

function resolveSaveBarStatus(
  isSaving: boolean,
  hasUnsavedChanges: boolean,
  lastPersistenceMode: SettingsPersistenceMode | null,
  lastPersisted: boolean | null,
): SettingsSaveBarStatus {
  if (isSaving) return "saving"
  if (hasUnsavedChanges) return "dirty"
  if (lastPersistenceMode === "database" && lastPersisted) return "saved_persisted"
  if (lastPersistenceMode === "memory") return "saved_memory"
  if (lastPersistenceMode === "unavailable") return "saved_unavailable"
  return "idle"
}

export function SettingsSaveBar({
  isSaving,
  hasUnsavedChanges,
  lastPersistenceMode,
  lastPersisted,
  onSave,
}: SettingsSaveBarProps) {
  const { messages } = useAdminI18n()
  const s = messages.settingsForm
  const status = resolveSaveBarStatus(
    isSaving,
    hasUnsavedChanges,
    lastPersistenceMode,
    lastPersisted,
  )

  const statusTitle: Record<SettingsSaveBarStatus, string> = {
    idle: s.saveStatusIdle,
    dirty: s.saveStatusUnsaved,
    saving: s.saveStatusSaving,
    saved_persisted: s.saveStatusPersisted,
    saved_memory: s.saveStatusMemory,
    saved_unavailable: s.saveStatusUnavailable,
  }

  const statusDetail: Record<SettingsSaveBarStatus, string> = {
    idle: s.saveStatusIdleDetail,
    dirty: s.saveStatusUnsavedDetail,
    saving: s.saveStatusSavingDetail,
    saved_persisted: s.saveStatusPersistedDetail,
    saved_memory: s.saveStatusMemoryDetail,
    saved_unavailable: s.saveStatusUnavailableDetail,
  }

  const statusTone: Record<SettingsSaveBarStatus, string> = {
    idle: "admin-text-muted",
    dirty: "text-amber-800 dark:text-amber-200",
    saving: "admin-text-muted",
    saved_persisted: "text-green-800 dark:text-green-200",
    saved_memory: "text-amber-800 dark:text-amber-200",
    saved_unavailable: "text-amber-800 dark:text-amber-200",
  }

  return (
    <div
      className="pointer-events-none sticky bottom-0 z-10 mt-10"
      role="region"
      aria-label={s.saveBarAriaLabel}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--admin-bg)] via-[color-mix(in_oklch,var(--admin-bg)_92%,transparent)] to-transparent"
        aria-hidden
      />
      <div className="relative px-0 pb-5 pt-3 sm:pb-6">
        <div
          className={cn(
            "pointer-events-auto admin-surface-section admin-surface-section--muted admin-surface-interactive",
            "flex flex-col gap-3 rounded-2xl border admin-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4",
            "shadow-[0_-2px_16px_-6px_color-mix(in_oklch,var(--admin-text)_10%,transparent),0_12px_28px_-16px_color-mix(in_oklch,black_22%,transparent)]",
            "backdrop-blur-md",
          )}
        >
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm font-semibold tracking-tight", statusTone[status])}>
              {statusTitle[status]}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed admin-text-muted">{statusDetail[status]}</p>
          </div>
          <AdminButton
            type="button"
            variant="primary"
            disabled={isSaving}
            onClick={onSave}
            className={cn("w-full shrink-0 sm:w-auto", isSaving && "cursor-not-allowed opacity-70")}
          >
            {isSaving ? s.saving : s.saveButton}
          </AdminButton>
        </div>
      </div>
    </div>
  )
}
