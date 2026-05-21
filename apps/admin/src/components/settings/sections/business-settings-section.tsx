"use client"

import { AdminField, AdminTextarea } from "@/components/admin-ui"
import { SettingsSectionCard } from "@/components/settings/settings-ux-primitives"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

export function BusinessSettingsSection({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm

  return (
    <SettingsSectionCard title={s.businessTitle} description={s.businessDescription}>
      <div className="space-y-3">
        <AdminField id="settings-opening-hours" label={s.openingHours}>
          {(fp) => (
            <AdminTextarea
              {...fp}
              rows={3}
              value={settings.business.openingHoursNote ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  business: { ...prev.business, openingHoursNote: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField id="settings-appointment" label={s.appointment}>
          {(fp) => (
            <AdminTextarea
              {...fp}
              rows={3}
              value={settings.business.appointmentNote ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  business: { ...prev.business, appointmentNote: e.target.value },
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
