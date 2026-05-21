"use client"

import { buildAdminPreviewAppearanceCss } from "@sovereign-cms/core"
import type { TenantAppearanceSettings } from "@sovereign-cms/core"
import { AdminSectionCard } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"

type SpinnerPreviewProps = {
  appearance: TenantAppearanceSettings
}

export function SpinnerPreview({ appearance }: SpinnerPreviewProps) {
  const s = useAdminI18n().messages.settingsForm
  const css = buildAdminPreviewAppearanceCss(appearance)

  return (
    <AdminSectionCard title={s.spinnerPreviewTitle} description={s.spinnerPreviewDescription}>
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <div className="admin-preview-surface flex min-h-[120px] items-center justify-center rounded-lg border admin-border admin-surface-muted p-6">
        <div
          className="h-10 w-10 rounded-full border-2 border-current border-t-transparent animate-spin admin-accent"
          style={{
            animationDuration: "var(--sovereign-spinner-duration, 1s)",
          }}
          aria-hidden
        />
        <span className="sr-only">{s.spinnerPreviewTitle}</span>
      </div>
    </AdminSectionCard>
  )
}
