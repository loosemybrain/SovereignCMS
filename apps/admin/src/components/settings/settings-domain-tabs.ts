export const SETTINGS_DOMAIN_TABS = [
  "branding",
  "appearance",
  "navigationLayout",
  "socialExternal",
  "legalGovernance",
  "systemRuntime",
] as const

export type SettingsDomainTab = (typeof SETTINGS_DOMAIN_TABS)[number]
