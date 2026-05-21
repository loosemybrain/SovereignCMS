import type { TenantSettings } from "@sovereign-cms/core"
import type { Dispatch, SetStateAction } from "react"

export type SettingsTabProps = {
  settings: TenantSettings
  setSettings: Dispatch<SetStateAction<TenantSettings>>
  isSaving: boolean
}
