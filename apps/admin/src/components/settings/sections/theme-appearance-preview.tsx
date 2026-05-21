"use client"

import { buildAdminPreviewAppearanceCss } from "@sovereign-cms/core"
import type { TenantAppearanceSettings } from "@sovereign-cms/core"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import {
  SettingsPreviewFrame,
  SettingsSectionCard,
} from "@/components/settings/settings-ux-primitives"

type ThemeAppearancePreviewProps = {
  appearance: TenantAppearanceSettings
}

export function ThemeAppearancePreview({ appearance }: ThemeAppearancePreviewProps) {
  const d = useAdminI18n().messages.settingsDomains
  const css = buildAdminPreviewAppearanceCss(appearance)

  return (
    <SettingsSectionCard title={d.themePreviewTitle} description={d.themePreviewDescription}>
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <SettingsPreviewFrame label={d.previewFrameLabel}>
        <div className="admin-preview-surface space-y-4">
          <div className="space-y-1">
            <p
              className="text-base font-semibold tracking-tight"
              style={{ color: "var(--public-foreground, inherit)" }}
            >
              {d.themePreviewSampleTitle}
            </p>
            <p className="text-sm leading-relaxed admin-text-muted">{d.themePreviewSampleBody}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-sm font-medium shadow-sm"
              style={{
                background: "var(--public-primary, #0f172a)",
                color: "var(--public-primary-foreground, #fff)",
                borderRadius: "var(--public-radius, 0.375rem)",
              }}
            >
              {d.themePreviewSampleButton}
            </button>
            <span
              className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm"
              style={{
                borderColor: "var(--public-border, currentColor)",
                color: "var(--public-muted-foreground, inherit)",
                borderRadius: "var(--public-radius, 0.375rem)",
              }}
            >
              {d.themePreviewSampleMuted}
            </span>
          </div>
        </div>
      </SettingsPreviewFrame>
    </SettingsSectionCard>
  )
}
