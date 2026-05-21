"use client"

import { Share2 } from "lucide-react"
import { AdminButton, AdminEmptyState, AdminField, AdminInput } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"
import {
  SettingsNestedItemCard,
  SettingsSectionCard,
} from "@/components/settings/settings-ux-primitives"

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
    <SettingsSectionCard title={s.socialTitle} description={s.socialDescription}>
      <div className="space-y-4">
        {settings.socialLinks.length === 0 ? (
          <AdminEmptyState
            title={s.socialEmpty}
            description={s.socialEmptyDescription}
            icon={<Share2 className="h-7 w-7" strokeWidth={1.75} aria-hidden />}
            className="py-10"
          >
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
          </AdminEmptyState>
        ) : (
          <ul className="space-y-4">
            {settings.socialLinks.map((link) => (
              <li key={link.id}>
                <SettingsNestedItemCard>
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
                </SettingsNestedItemCard>
              </li>
            ))}
          </ul>
        )}
        {settings.socialLinks.length > 0 ? (
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
        ) : null}
      </div>
    </SettingsSectionCard>
  )
}
