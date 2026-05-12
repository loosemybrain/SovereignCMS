"use client"

import type { SupportedLocale } from "@sovereign-cms/core"
import { EditorPanel, EditorStatusPanel } from "@/components/editor/patterns"
import { resolveCompositionLocales } from "@/lib/resolve-composition-locales"
import { resolveTenantComposition } from "@/lib/resolve-tenant-composition"

type CompositionDebugPanelProps = {
  tenantId: string
  runtimeSupportedLocales: SupportedLocale[]
  runtimeDefaultLocale: string
}

export function CompositionDebugPanel({
  tenantId,
  runtimeSupportedLocales,
  runtimeDefaultLocale,
}: CompositionDebugPanelProps) {
  const composition = resolveTenantComposition({ tenantId })
  const alignedLocales = resolveCompositionLocales({
    compositionLocales: composition.enabledLocales,
    compositionDefaultLocale: composition.defaultLocale,
    runtimeSupportedLocales,
    runtimeDefaultLocale,
  })

  return (
    <EditorPanel variant="muted" className="space-y-3">
      <h3 className="text-sm font-semibold admin-text">Composition Debug</h3>
      <EditorStatusPanel
        statusItems={[
          { label: "Tenant", value: composition.tenantId },
          { label: "Brand", value: composition.brandId },
          { label: "Default Template", value: composition.defaultTemplateId },
          { label: "Runtime Default Locale", value: runtimeDefaultLocale },
          { label: "Runtime Supported Locales", value: runtimeSupportedLocales.map((item) => item.code).join(", "), tone: "muted" },
          { label: "Composition Default Locale", value: composition.defaultLocale },
          { label: "Composition Enabled Locales", value: composition.enabledLocales.join(", "), tone: "muted" },
          { label: "Effective Default Locale", value: alignedLocales.defaultLocale },
          { label: "Effective Enabled Locales", value: alignedLocales.enabledLocales.join(", "), tone: "muted" },
          { label: "Dropped Composition Locales", value: alignedLocales.droppedLocales.join(", ") || "none", tone: "muted" },
          { label: "Allowed Templates", value: composition.allowedTemplateIds.join(", "), tone: "muted" },
          { label: "Theme Preset (default)", value: composition.defaultThemePresetId ?? "not set", tone: "muted" },
        ]}
      />
    </EditorPanel>
  )
}
