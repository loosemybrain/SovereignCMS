"use client"

import { buildAdminPreviewAppearanceCss } from "@sovereign-cms/core"
import type { TenantAppearanceSettings } from "@sovereign-cms/core"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import {
  SettingsPreviewFrame,
  SettingsSectionCard,
} from "@/components/settings/settings-ux-primitives"

type SpinnerPreviewProps = {
  appearance: TenantAppearanceSettings
}

export function SpinnerPreview({ appearance }: SpinnerPreviewProps) {
  const s = useAdminI18n().messages.settingsForm
  const d = useAdminI18n().messages.settingsDomains
  const css = buildAdminPreviewAppearanceCss(appearance)

  return (
    <SettingsSectionCard title={s.spinnerPreviewTitle} description={s.spinnerPreviewDescription}>
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <SettingsPreviewFrame label={d.previewFrameLabel}>
        <div className="admin-preview-surface flex min-h-[140px] flex-col items-center justify-center gap-3">
          <div
            className="h-10 w-10 rounded-full border-2 border-current border-t-transparent animate-spin"
            style={{
              color: "var(--public-primary, var(--admin-accent))",
              animationDuration: "var(--sovereign-spinner-duration, 1s)",
            }}
            aria-hidden
          />
          <p className="text-xs admin-text-muted">{s.spinnerPreviewCaption}</p>
        </div>
      </SettingsPreviewFrame>
      <span className="sr-only">{s.spinnerPreviewTitle}</span>
    </SettingsSectionCard>
  )
}
