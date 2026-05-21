"use client"

import { SocialSettingsTab } from "@/components/settings/social-settings-tab"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"
import { SettingsInlineHint, SettingsTabPanel } from "@/components/settings/settings-ux-primitives"
import { useAdminI18n } from "@/components/admin-i18n-provider"

export function SocialExternalSettingsTab(props: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm

  return (
    <SettingsTabPanel>
      <SettingsInlineHint>{s.socialExternalGuidance}</SettingsInlineHint>
      <SocialSettingsTab {...props} />
    </SettingsTabPanel>
  )
}
