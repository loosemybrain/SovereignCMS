"use client"

import {
  SPINNER_PRESET_KEYS,
  SPINNER_SPEED_KEYS,
  type SpinnerPresetKey,
  type SpinnerSpeedKey,
} from "@sovereign-cms/core"
import { AdminField, AdminSectionCard, AdminSelect } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { SpinnerPreview } from "@/components/settings/spinner-preview"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"

export function SpinnerSettingsTab({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm

  return (
    <>
      <AdminSectionCard title={s.spinnerTitle} description={s.spinnerDescription}>
        <div className="grid gap-3 md:grid-cols-2">
          <AdminField id="settings-spinner-preset" label={s.spinnerPreset}>
            {(fp) => (
              <AdminSelect
                {...fp}
                value={settings.appearance.spinner.preset}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      spinner: {
                        ...prev.appearance.spinner,
                        preset: e.target.value as SpinnerPresetKey,
                      },
                    },
                  }))
                }
                disabled={isSaving}
              >
                {SPINNER_PRESET_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </AdminSelect>
            )}
          </AdminField>
          <AdminField id="settings-spinner-speed" label={s.spinnerSpeed}>
            {(fp) => (
              <AdminSelect
                {...fp}
                value={settings.appearance.spinner.speed}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      spinner: {
                        ...prev.appearance.spinner,
                        speed: e.target.value as SpinnerSpeedKey,
                      },
                    },
                  }))
                }
                disabled={isSaving}
              >
                {SPINNER_SPEED_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </AdminSelect>
            )}
          </AdminField>
        </div>
      </AdminSectionCard>
      <SpinnerPreview appearance={settings.appearance} />
    </>
  )
}
