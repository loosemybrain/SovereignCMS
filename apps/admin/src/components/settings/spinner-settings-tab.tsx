"use client"

import { SpinnerPreview } from "@/components/settings/spinner-preview"
import { SpinnerSettingsSection } from "@/components/settings/sections/spinner-settings-section"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

/** Legacy technical tab — spinner section + preview. */
export function SpinnerSettingsTab(props: SettingsTabProps) {
  return (
    <>
      <SpinnerSettingsSection {...props} />
      <SpinnerPreview appearance={props.settings.appearance} />
    </>
  )
}
