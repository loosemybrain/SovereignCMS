"use client"

import { Palette } from "lucide-react"
import { AdminEmptyState } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { SettingsSectionCard } from "@/components/settings/settings-ux-primitives"

export function ThemePresetSettingsSection() {
  const d = useAdminI18n().messages.settingsDomains

  return (
    <SettingsSectionCard title={d.themePresetTitle} description={d.themePresetDescription}>
      <AdminEmptyState
        title={d.themePresetEmptyTitle}
        description={d.themePresetEmptyDescription}
        icon={<Palette className="h-7 w-7" strokeWidth={1.75} aria-hidden />}
        className="py-10"
      />
      <p className="mt-4 text-xs leading-relaxed admin-text-muted">{d.themePresetNote}</p>
    </SettingsSectionCard>
  )
}
