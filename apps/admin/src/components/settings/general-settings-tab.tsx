"use client"

import {
  AdminField,
  AdminInput,
  AdminSectionCard,
  AdminTextarea,
} from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

export function GeneralSettingsTab({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm

  return (
    <>
      <AdminSectionCard title={s.siteIdentityTitle} description={s.siteIdentityDescription}>
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
      </AdminSectionCard>

      <AdminSectionCard title={s.contactTitle} description={s.contactDescription}>
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
      </AdminSectionCard>

      <AdminSectionCard title={s.businessTitle} description={s.businessDescription}>
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
      </AdminSectionCard>    </>
  )
}
