"use client"

import { useAdminI18n } from "@/components/admin-i18n-provider"
import { FontSettingsTab } from "@/components/settings/font-settings-tab"
import { SpinnerPreview } from "@/components/settings/spinner-preview"
import { SiteIdentitySettingsSection } from "@/components/settings/sections/site-identity-settings-section"
import { SpinnerSettingsSection } from "@/components/settings/sections/spinner-settings-section"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"
import { SettingsInlineHint, SettingsTabPanel } from "@/components/settings/settings-ux-primitives"

export function BrandingSettingsTab(props: SettingsTabProps) {
  const d = useAdminI18n().messages.settingsDomains

  return (
    <SettingsTabPanel>
      <SiteIdentitySettingsSection {...props} />
      <FontSettingsTab {...props} />
      <SpinnerSettingsSection {...props} />
      <SpinnerPreview appearance={props.settings.appearance} />
      <SettingsInlineHint>{d.brandingMarkHint}</SettingsInlineHint>
    </SettingsTabPanel>
  )
}
