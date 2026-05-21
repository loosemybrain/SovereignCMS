"use client"

import { useAdminI18n } from "@/components/admin-i18n-provider"
import { LegalSettingsTab } from "@/components/settings/legal-settings-tab"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"
import {
  SettingsSectionCard,
  SettingsTabPanel,
} from "@/components/settings/settings-ux-primitives"

export function LegalGovernanceSettingsTab(props: SettingsTabProps) {
  const d = useAdminI18n().messages.settingsDomains

  return (
    <SettingsTabPanel>
      <SettingsSectionCard title={d.consentGovernanceTitle} description={d.consentGovernanceDescription}>
        <p className="text-sm leading-relaxed admin-text-muted">{d.consentGovernanceNote}</p>
      </SettingsSectionCard>
      <LegalSettingsTab {...props} />
    </SettingsTabPanel>
  )
}
