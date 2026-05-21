"use client"

import { AdminField, AdminInput } from "@/components/admin-ui"
import { SettingsSectionCard } from "@/components/settings/settings-ux-primitives"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

export function ContactSettingsSection({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm

  return (
    <SettingsSectionCard title={s.contactTitle} description={s.contactDescription}>
      <div className="grid gap-3 md:grid-cols-2">
        <AdminField id="settings-email" label={s.email}>
          {(fp) => (
            <AdminInput
              {...fp}
              type="email"
              value={settings.contact.email ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField id="settings-phone" label={s.phone}>
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.contact.phone ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phone: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <div className="md:col-span-2">
          <AdminField id="settings-address1" label={s.address1}>
            {(fp) => (
              <AdminInput
                {...fp}
                value={settings.contact.addressLine1 ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, addressLine1: e.target.value },
                  }))
                }
                disabled={isSaving}
              />
            )}
          </AdminField>
        </div>
        <div className="md:col-span-2">
          <AdminField id="settings-address2" label={s.address2}>
            {(fp) => (
              <AdminInput
                {...fp}
                value={settings.contact.addressLine2 ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, addressLine2: e.target.value },
                  }))
                }
                disabled={isSaving}
              />
            )}
          </AdminField>
        </div>
        <AdminField id="settings-postal" label={s.postal}>
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.contact.postalCode ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, postalCode: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField id="settings-city" label={s.city}>
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.contact.city ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, city: e.target.value },
                }))
              }
              disabled={isSaving}
            />
          )}
        </AdminField>
        <AdminField id="settings-country" label={s.country}>
          {(fp) => (
            <AdminInput
              {...fp}
              value={settings.contact.country ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, country: e.target.value },
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
