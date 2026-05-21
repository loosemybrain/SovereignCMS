import type { TenantSettings } from "@sovereign-cms/core"

/** Stable JSON snapshot for unsaved-change detection (editor state only). */
export function serializeSettingsDirtySnapshot(settings: TenantSettings): string {
  return JSON.stringify({
    siteIdentity: settings.siteIdentity,
    contact: settings.contact,
    business: settings.business,
    legal: settings.legal,
    socialLinks: settings.socialLinks,
    appearance: settings.appearance,
  })
}
