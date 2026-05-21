import type { SettingsPersistenceMode, TenantSettings } from "@sovereign-cms/core"
import type { Dispatch, SetStateAction } from "react"

export type SettingsTabProps = {
  settings: TenantSettings
  setSettings: Dispatch<SetStateAction<TenantSettings>>
  isSaving: boolean
}

export type SettingsRuntimeFeedback = {
  persistenceMode: SettingsPersistenceMode | null
  persisted: boolean | null
  persistenceWarning: string | null
  successMessage: string | null
  themeSanitizedNotice: string | null
}
