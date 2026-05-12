import type { BrandCompositionDefinition } from "@sovereign-cms/core"

export const brandCompositions: BrandCompositionDefinition[] = [
  {
    id: "demo",
    label: "Demo",
    allowedTemplateIds: ["empty-page-template", "basic-page-template", "landing-page-template"],
    defaultTemplateId: "basic-page-template",
    defaultThemePresetId: "theme-demo",
    defaultNavigationId: "nav-demo-default",
    defaultLocale: "de",
    enabledLocales: ["de", "en"],
  },
  {
    id: "physiotherapy",
    label: "Physiotherapy",
    allowedTemplateIds: ["empty-page-template", "basic-page-template"],
    defaultTemplateId: "basic-page-template",
    defaultThemePresetId: "theme-physiotherapy",
    defaultNavigationId: "nav-physiotherapy-default",
    defaultLocale: "de",
    enabledLocales: ["de", "en"],
  },
  {
    id: "physio-konzept",
    label: "Physio Konzept",
    allowedTemplateIds: ["empty-page-template", "basic-page-template", "landing-page-template"],
    defaultTemplateId: "landing-page-template",
    defaultThemePresetId: "theme-physio-konzept",
    defaultNavigationId: "nav-physio-konzept-default",
    defaultLocale: "de",
    enabledLocales: ["de"],
  },
]
