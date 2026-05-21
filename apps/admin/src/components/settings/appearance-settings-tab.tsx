"use client"

import { ThemeAppearancePreview } from "@/components/settings/sections/theme-appearance-preview"
import { ThemePresetSettingsSection } from "@/components/settings/sections/theme-preset-settings-section"
import { ThemeTokenSettingsSection } from "@/components/settings/sections/theme-token-settings-section"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"
import { SettingsTabPanel } from "@/components/settings/settings-ux-primitives"

export function AppearanceSettingsTab(props: SettingsTabProps) {
  return (
    <SettingsTabPanel>
      <ThemePresetSettingsSection />
      <ThemeTokenSettingsSection {...props} />
      <ThemeAppearancePreview appearance={props.settings.appearance} />
    </SettingsTabPanel>
  )
}
