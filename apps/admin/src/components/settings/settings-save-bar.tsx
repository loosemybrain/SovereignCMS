"use client"

import { AdminButton } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { cn } from "@sovereign-cms/ui"

type SettingsSaveBarProps = {
  isSaving: boolean
  onSave: () => void
}

export function SettingsSaveBar({ isSaving, onSave }: SettingsSaveBarProps) {
  const { messages } = useAdminI18n()
  const s = messages.settingsForm

  return (
    <div className="flex justify-end">
      <AdminButton
        type="button"
        variant="primary"
        disabled={isSaving}
        onClick={onSave}
        className={cn(isSaving && "cursor-not-allowed opacity-70")}
      >
        {isSaving ? s.saving : s.saveButton}
      </AdminButton>
    </div>
  )
}
