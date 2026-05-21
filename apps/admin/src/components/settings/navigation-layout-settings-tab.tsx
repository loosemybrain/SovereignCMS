"use client"

import { BusinessSettingsSection } from "@/components/settings/sections/business-settings-section"
import { ContactSettingsSection } from "@/components/settings/sections/contact-settings-section"
import { NavigationLayoutHintsSection } from "@/components/settings/sections/navigation-layout-hints-section"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"
import { SettingsTabPanel } from "@/components/settings/settings-ux-primitives"

export function NavigationLayoutSettingsTab(props: SettingsTabProps) {
  return (
    <SettingsTabPanel>
      <NavigationLayoutHintsSection />
      <ContactSettingsSection {...props} />
      <BusinessSettingsSection {...props} />
    </SettingsTabPanel>
  )
}
