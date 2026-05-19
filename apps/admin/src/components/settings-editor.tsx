"use client"

import { useState } from "react"
import type { TenantSettings } from "@sovereign-cms/core"
import { validateExternalHref } from "@sovereign-cms/core"
import {
  AdminAlert,
  AdminButton,
  AdminConfigGrid,
  AdminField,
  AdminInput,
  AdminSectionCard,
  AdminTextarea,
} from "@/components/admin-ui"
import { clientSettingsPersistence } from "@/lib/client-settings-persistence"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { cn } from "@sovereign-cms/ui"

type Props = {
  tenantId: string
  initialSettings: TenantSettings
}

function newSocialLinkId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID()
  }
  return `social-${Date.now()}`
}

export function SettingsEditor({ tenantId, initialSettings }: Props) {
  const { messages } = useAdminI18n()
  const s = messages.settingsForm
  const [settings, setSettings] = useState<TenantSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSave = async () => {
    try {
      setError(null)
      setSuccessMessage(null)
      setIsSaving(true)

      for (const link of settings.socialLinks) {
        const labelOk = link.label.trim().length > 0
        const hrefOk = validateExternalHref(link.href.trim())
        if (!labelOk || !hrefOk) {
          setError(s.socialValidationError)
          setIsSaving(false)
          return
        }
      }

      const result = await clientSettingsPersistence.updateTenantSettings({
        tenantId,
        settings: {
          siteIdentity: settings.siteIdentity,
          contact: settings.contact,
          business: settings.business,
          legal: settings.legal,
          socialLinks: settings.socialLinks,
        },
      })

      if (result.success) {
        setSettings(result.settings)
        setSuccessMessage(s.saveSuccess)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : s.saveErrorGeneric
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {error ? (
        <AdminAlert variant="destructive" title={s.saveFailed}>
          {error}
        </AdminAlert>
      ) : null}

      {successMessage ? (
        <AdminAlert variant="success">{successMessage}</AdminAlert>
      ) : null}

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
      </AdminSectionCard>

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

      <AdminSectionCard title={s.socialTitle} description={s.socialDescription}>
        <div className="space-y-4">
          {settings.socialLinks.length === 0 ? (
            <p className="text-sm admin-text-muted">{s.socialEmpty}</p>
          ) : (
            <ul className="space-y-4">
              {settings.socialLinks.map((link) => (
                <li
                  key={link.id}
                  className="space-y-3 rounded-lg border admin-border admin-surface-muted p-4 shadow-sm"
                >
                  <div className="flex justify-end">
                    <AdminButton
                      type="button"
                      variant="secondary"
                      disabled={isSaving}
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          socialLinks: prev.socialLinks.filter((l) => l.id !== link.id),
                        }))
                      }
                    >
                      {s.remove}
                    </AdminButton>
                  </div>
                  <AdminField id={`social-label-${link.id}`} label={s.socialLabel}>
                    {(fp) => (
                      <AdminInput
                        {...fp}
                        value={link.label}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            socialLinks: prev.socialLinks.map((l) =>
                              l.id === link.id ? { ...l, label: e.target.value } : l,
                            ),
                          }))
                        }
                        disabled={isSaving}
                      />
                    )}
                  </AdminField>
                  <AdminField
                    id={`social-href-${link.id}`}
                    label={s.socialUrl}
                    description={s.socialUrlDescription}
                  >
                    {(fp) => (
                      <AdminInput
                        {...fp}
                        type="url"
                        value={link.href}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            socialLinks: prev.socialLinks.map((l) =>
                              l.id === link.id ? { ...l, href: e.target.value } : l,
                            ),
                          }))
                        }
                        disabled={isSaving}
                      />
                    )}
                  </AdminField>
                </li>
              ))}
            </ul>
          )}
          <AdminButton
            type="button"
            variant="secondary"
            disabled={isSaving}
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                socialLinks: [...prev.socialLinks, { id: newSocialLinkId(), label: "", href: "" }],
              }))
            }
          >
            {s.addSocialLink}
          </AdminButton>
        </div>
      </AdminSectionCard>

      <div className="flex justify-end">
        <AdminButton
          type="button"
          variant="primary"
          disabled={isSaving}
          onClick={handleSave}
          className={cn(isSaving && "cursor-not-allowed opacity-70")}
        >
          {isSaving ? s.saving : s.saveButton}
        </AdminButton>
      </div>
    </div>
  )
}
