"use client"

import { AdminConfigGrid, AdminField, AdminInput, AdminSectionCard } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

export function LegalSettingsTab({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm

  return (
    <AdminSectionCard title={s.legalTitle} description={s.legalDescription}>
      <AdminConfigGrid columns={2}>
        <AdminField id="settings-responsible" label={s.responsible}>
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.legal.responsibleName ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  legal: { ...prev.legal, responsibleName: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField
          id="settings-imprint-slug"
          label={s.imprintSlug}
          description={s.imprintSlugDescription}
        >
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.legal.imprintSlug ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  legal: { ...prev.legal, imprintSlug: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField
          id="settings-privacy-slug"
          label={s.privacySlug}
          description={s.privacySlugDescription}
        >
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.legal.privacySlug ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  legal: { ...prev.legal, privacySlug: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField id="settings-cookie-slug" label={s.cookieSlug}>
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.legal.cookieSlug ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  legal: { ...prev.legal, cookieSlug: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
      </AdminConfigGrid>
    </AdminSectionCard>
  )
}
