"use client"

import { ALLOWED_THEME_TOKEN_KEYS } from "@sovereign-cms/core"
import { AdminField, AdminInput, AdminSectionCard } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { getInvalidThemeTokenFields } from "@/lib/settings/theme-token-validation"
import type { AllowedThemeTokenKey } from "@sovereign-cms/core"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

const TOKEN_LABELS: Record<AllowedThemeTokenKey, string> = {
  primary: "Primary",
  primaryForeground: "Primary foreground",
  accent: "Accent",
  accentForeground: "Accent foreground",
  background: "Background",
  foreground: "Foreground",
  muted: "Muted",
  mutedForeground: "Muted foreground",
  border: "Border",
  radius: "Radius",
}

export function ThemeSettingsTab({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm
  const invalidKeys = new Set(getInvalidThemeTokenFields(settings.appearance.themeTokens))

  return (
    <AdminSectionCard title={s.themeTitle} description={s.themeDescription}>
      <div className="grid gap-3 md:grid-cols-2">
        {ALLOWED_THEME_TOKEN_KEYS.map((key) => {
          const isInvalid = invalidKeys.has(key)
          return (
            <AdminField key={key} id={`theme-token-${key}`} label={TOKEN_LABELS[key]}>
              {(fp) => (
                <div className="space-y-1">
                  <AdminInput
                    {...fp}
                    value={settings.appearance.themeTokens[key] ?? ""}
                    placeholder={key === "radius" ? "0.5rem" : "#0f172a"}
                    aria-invalid={isInvalid}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          themeTokens: {
                            ...prev.appearance.themeTokens,
                            [key]: e.target.value,
                          },
                        },
                      }))
                    }
                    disabled={isSaving}
                  />
                  {isInvalid ? (
                    <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                      {s.themeTokenInvalid}
                    </p>
                  ) : null}
                </div>
              )}
            </AdminField>
          )
        })}
      </div>
    </AdminSectionCard>
  )
}
