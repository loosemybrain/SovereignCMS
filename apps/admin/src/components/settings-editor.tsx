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
          setError(
            "Social links: Jedes Eintrag braucht einen nicht-leeren Namen und eine gültige URL (https://, http:// oder /…).",
          )
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
        setSuccessMessage("Settings saved. InMemory data is not permanently persisted.")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save settings"
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {error ? (
        <AdminAlert variant="destructive" title="Speichern nicht möglich">
          {error}
        </AdminAlert>
      ) : null}

      {successMessage ? (
        <AdminAlert variant="success">{successMessage}</AdminAlert>
      ) : null}

      <AdminSectionCard
        title="Site identity"
        description="Public-facing name and branding hints."
      >
        <div className="space-y-3">
          <AdminField id="settings-site-name" label="Site name">
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
          <AdminField id="settings-tagline" label="Tagline">
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
          <AdminField id="settings-logo-url" label="Logo URL">
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

      <AdminSectionCard
        title="Contact"
        description="How visitors can reach this tenant."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <AdminField id="settings-email" label="Email">
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
          <AdminField id="settings-phone" label="Phone">
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
            <AdminField id="settings-address1" label="Address line 1">
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
            <AdminField id="settings-address2" label="Address line 2">
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
          <AdminField id="settings-postal" label="Postal code">
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
          <AdminField id="settings-city" label="City">
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
          <AdminField id="settings-country" label="Country">
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

      <AdminSectionCard
        title="Business"
        description="Optional notes for visitors."
      >
        <div className="space-y-3">
          <AdminField id="settings-opening-hours" label="Opening hours note">
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
          <AdminField id="settings-appointment" label="Appointment note">
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

      <AdminSectionCard
        title="Legal"
        description="References to legal pages by slug."
      >
        <AdminConfigGrid columns={2}>
          <AdminField id="settings-responsible" label="Responsible name">
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
            label="Imprint slug"
            description="Used by the public footer to generate locale-aware legal links."
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
            label="Privacy slug"
            description="Used by the public footer to generate locale-aware legal links."
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
          <AdminField id="settings-cookie-slug" label="Cookie slug">
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

      <AdminSectionCard
        title="Social links"
        description="Werden im öffentlichen Footer als Textlinks angezeigt (Reihenfolge = Liste)."
      >
        <div className="space-y-4">
          {settings.socialLinks.length === 0 ? (
            <p className="text-sm admin-text-muted">Keine Social Links — „Social Link hinzufügen“ nutzen.</p>
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
                      Entfernen
                    </AdminButton>
                  </div>
                  <AdminField id={`social-label-${link.id}`} label="Label">
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
                    label="URL"
                    description="https://…, http://… oder /pfad"
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
            Social Link hinzufügen
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
          {isSaving ? "Saving..." : "Save settings"}
        </AdminButton>
      </div>
    </div>
  )
}
