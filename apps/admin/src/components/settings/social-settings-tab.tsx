"use client"

import {
  AdminButton,
  AdminField,
  AdminInput,
  AdminSectionCard,
} from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

function newSocialLinkId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID()
  }
  return `social-${Date.now()}`
}

export function SocialSettingsTab({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm

  return (
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
  )
}
