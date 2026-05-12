export type BrandCompositionDefinition = {
  id: string
  label: string
  allowedTemplateIds?: string[]
  defaultTemplateId?: string
  defaultThemePresetId?: string
  defaultNavigationId?: string
  defaultLocale?: string
  enabledLocales?: string[]
}

export type TenantCompositionDefinition = {
  tenantId: string
  brandId: string
  defaultThemePresetId?: string
  defaultTemplateId?: string
  enabledTemplateIds?: string[]
  enabledLocales?: string[]
}
