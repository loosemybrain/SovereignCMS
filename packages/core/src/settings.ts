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

export type TenantSettings = {
  tenantId: string
  siteIdentity: SiteIdentitySettings
  contact: ContactSettings
  business: BusinessSettings
  socialLinks: SocialLink[]
  legal: LegalSettings
  updatedAt: string
}

export type UpdateTenantSettingsInput = {
  tenantId: string
  settings: Partial<Omit<TenantSettings, "tenantId" | "updatedAt">>
}

export type UpdateTenantSettingsResult = {
  success: boolean
  settings: TenantSettings
  updatedAt: string
  persisted: boolean
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
    updatedAt: new Date().toISOString(),
  }
}
