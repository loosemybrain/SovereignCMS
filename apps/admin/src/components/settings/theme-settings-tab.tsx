"use client"

import { ThemeTokenSettingsSection } from "@/components/settings/sections/theme-token-settings-section"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

/** Legacy technical tab — thin wrapper over theme token section. */
export function ThemeSettingsTab(props: SettingsTabProps) {
  return <ThemeTokenSettingsSection {...props} />
}
