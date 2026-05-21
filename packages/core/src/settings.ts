export type SiteIdentitySettings = {
  siteName: string
  tagline?: string
  logoUrl?: string
}

export type ContactSettings = {
  email?: string
  phone?: string
  addressLine1?: string
  addressLine2?: string
  postalCode?: string
  city?: string
  country?: string
}

export type BusinessSettings = {
  openingHoursNote?: string
  appointmentNote?: string
}

export type SocialLink = {
  id: string
  label: string
  href: string
}

export type LegalSettings = {
  responsibleName?: string
  imprintSlug?: string
  privacySlug?: string
  cookieSlug?: string
}

import type { TenantAppearanceSettings } from "./settings-appearance"
import { createDefaultTenantAppearanceSettings } from "./settings-appearance"

export type TenantSettings = {
  tenantId: string
  siteIdentity: SiteIdentitySettings
  contact: ContactSettings
  business: BusinessSettings
  socialLinks: SocialLink[]
  legal: LegalSettings
  appearance: TenantAppearanceSettings
  updatedAt: string
}

export type UpdateTenantSettingsInput = {
  tenantId: string
  settings: Partial<Omit<TenantSettings, "tenantId" | "updatedAt">>
}

/** How tenant settings were persisted (Phase 91). */
export type SettingsPersistenceMode = "memory" | "database" | "unavailable"

/** Adapter-level save outcome (settings hardening / persistence foundation). */
export type TenantSettingsPersistenceResult = {
  settings: TenantSettings
  persisted: boolean
  persistenceMode: SettingsPersistenceMode
  warning?: string
}

/** @deprecated Alias — prefer TenantSettingsPersistenceResult */
export type TenantSettingsSaveResult = TenantSettingsPersistenceResult

export type UpdateTenantSettingsResult = {
  success: boolean
  settings: TenantSettings
  updatedAt: string
  persisted: boolean
  persistenceMode: SettingsPersistenceMode
  warning?: string
}

export function createDefaultTenantSettings(tenantId: string): TenantSettings {
  return {
    tenantId,
    siteIdentity: {
      siteName: "SovereignCMS",
      tagline: "",
      logoUrl: "",
    },
    contact: {},
    business: {},
    socialLinks: [],
    legal: {},
    appearance: createDefaultTenantAppearanceSettings(),
    updatedAt: new Date().toISOString(),
  }
}
