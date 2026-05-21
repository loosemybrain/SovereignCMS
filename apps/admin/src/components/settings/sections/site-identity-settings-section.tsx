"use client"

import { AdminField, AdminInput } from "@/components/admin-ui"
import { SettingsSectionCard } from "@/components/settings/settings-ux-primitives"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

export function SiteIdentitySettingsSection({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm

  return (
    <SettingsSectionCard title={s.siteIdentityTitle} description={s.siteIdentityDescription}>
      <div className="space-y-3">
        <AdminField id="settings-site-name" label={s.siteName}>
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.siteIdentity.siteName}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  siteIdentity: { ...prev.siteIdentity, siteName: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField id="settings-tagline" label={s.tagline}>
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.siteIdentity.tagline ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  siteIdentity: { ...prev.siteIdentity, tagline: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField id="settings-logo-url" label={s.logoUrl}>
          {(fp) => (
            <AdminInput
              {...fp}
              type="url"
              value={settings.siteIdentity.logoUrl ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  siteIdentity: { ...prev.siteIdentity, logoUrl: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
      </div>
    </SettingsSectionCard>
  )
}
