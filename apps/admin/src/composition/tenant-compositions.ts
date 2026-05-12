import type { TenantCompositionDefinition } from "@sovereign-cms/core"

export const tenantCompositions: TenantCompositionDefinition[] = [
  {
    tenantId: "demo",
    brandId: "demo",
    defaultTemplateId: "basic-page-template",
    defaultThemePresetId: "theme-demo",
    enabledTemplateIds: ["empty-page-template", "basic-page-template", "landing-page-template"],
    enabledLocales: ["de", "en"],
  },
  {
    tenantId: "tenant-physiotherapie-kroll",
    brandId: "physiotherapy",
    defaultTemplateId: "basic-page-template",
    defaultThemePresetId: "theme-physiotherapy",
    enabledTemplateIds: ["empty-page-template", "basic-page-template"],
    enabledLocales: ["de", "en"],
  },
  {
    tenantId: "tenant-physio-konzept",
    brandId: "physio-konzept",
    defaultTemplateId: "landing-page-template",
    defaultThemePresetId: "theme-physio-konzept",
    enabledTemplateIds: ["empty-page-template", "landing-page-template"],
    enabledLocales: ["de"],
  },
]
