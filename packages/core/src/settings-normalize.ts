/**
 * Tenant settings merge/normalize helpers (provider-neutral).
 * Used by memory and database adapters — not a settings engine.
 */

import type { TenantSettings, UpdateTenantSettingsInput } from "./settings"
import { createDefaultTenantSettings } from "./settings"
import { sanitizeTenantAppearanceSettings } from "./settings-appearance"

/** JSON payload stored in `tenant_settings.settings_json` (no tenantId). */
export type TenantSettingsStoragePayload = Omit<TenantSettings, "tenantId" | "updatedAt">

export function mergeTenantSettingsPatch(
  base: TenantSettings,
  patch: UpdateTenantSettingsInput["settings"],
): TenantSettings {
  const now = new Date().toISOString()
  const rawAppearance = patch.appearance
  const mergedAppearance = rawAppearance
    ? {
        themeTokens: rawAppearance.themeTokens
          ? { ...base.appearance.themeTokens, ...rawAppearance.themeTokens }
          : { ...base.appearance.themeTokens },
        customFonts:
          rawAppearance.customFonts !== undefined
            ? rawAppearance.customFonts.map((font) => ({ ...font }))
            : base.appearance.customFonts.map((font) => ({ ...font })),
        spinner: rawAppearance.spinner
          ? { ...base.appearance.spinner, ...rawAppearance.spinner }
          : { ...base.appearance.spinner },
      }
    : {
        themeTokens: { ...base.appearance.themeTokens },
        customFonts: base.appearance.customFonts.map((font) => ({ ...font })),
        spinner: { ...base.appearance.spinner },
      }

  return {
    tenantId: base.tenantId,
    siteIdentity: patch.siteIdentity
      ? { ...base.siteIdentity, ...patch.siteIdentity }
      : { ...base.siteIdentity },
    contact: patch.contact ? { ...base.contact, ...patch.contact } : { ...base.contact },
    business: patch.business ? { ...base.business, ...patch.business } : { ...base.business },
    legal: patch.legal ? { ...base.legal, ...patch.legal } : { ...base.legal },
    socialLinks:
      patch.socialLinks !== undefined
        ? patch.socialLinks.map((link) => ({ ...link }))
        : base.socialLinks.map((link) => ({ ...link })),
    appearance: sanitizeTenantAppearanceSettings(mergedAppearance),
    updatedAt: now,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Defensively normalizes stored JSON into TenantSettings (defaults + sanitization).
 */
export function normalizeTenantSettingsFromStorage(
  tenantId: string,
  raw: unknown,
  updatedAt?: string,
): TenantSettings {
  const base = createDefaultTenantSettings(tenantId)
  if (!isRecord(raw)) {
    return { ...base, updatedAt: updatedAt ?? base.updatedAt }
  }

  const siteIdentity = isRecord(raw.siteIdentity)
    ? { ...base.siteIdentity, ...(raw.siteIdentity as TenantSettings["siteIdentity"]) }
    : base.siteIdentity

  const contact = isRecord(raw.contact)
    ? { ...base.contact, ...(raw.contact as TenantSettings["contact"]) }
    : base.contact

  const business = isRecord(raw.business)
    ? { ...base.business, ...(raw.business as TenantSettings["business"]) }
    : base.business

  const legal = isRecord(raw.legal)
    ? { ...base.legal, ...(raw.legal as TenantSettings["legal"]) }
    : base.legal

  const socialLinks = Array.isArray(raw.socialLinks)
    ? (raw.socialLinks as TenantSettings["socialLinks"])
    : base.socialLinks

  const appearance = sanitizeTenantAppearanceSettings(raw.appearance ?? base.appearance)

  return {
    tenantId,
    siteIdentity,
    contact,
    business,
    legal,
    socialLinks,
    appearance,
    updatedAt:
      typeof raw.updatedAt === "string" && raw.updatedAt.trim().length > 0
        ? raw.updatedAt
        : (updatedAt ?? base.updatedAt),
  }
}

export function tenantSettingsToStoragePayload(settings: TenantSettings): TenantSettingsStoragePayload {
  const { tenantId: _tenantId, updatedAt, ...payload } = settings
  void _tenantId
  return {
    ...payload,
    appearance: sanitizeTenantAppearanceSettings(settings.appearance),
  }
}
