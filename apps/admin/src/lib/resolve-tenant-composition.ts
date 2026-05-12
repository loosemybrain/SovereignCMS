import { contentTemplates } from "@/content-templates/template-registry"
import { brandCompositions } from "@/composition/brand-compositions"
import { tenantCompositions } from "@/composition/tenant-compositions"

export type ResolvedTenantComposition = {
  tenantId: string
  brandId: string
  allowedTemplateIds: string[]
  defaultTemplateId: string
  defaultThemePresetId?: string
  defaultNavigationId?: string
  defaultLocale: string
  enabledLocales: string[]
}

const EMPTY_TEMPLATE_ID = "empty-page-template"
const FALLBACK_LOCALES = ["de"]

function toUniqueNonEmpty(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)))
}

export function resolveTenantComposition(input: { tenantId: string }): ResolvedTenantComposition {
  const tenantComposition =
    tenantCompositions.find((item) => item.tenantId === input.tenantId) ??
    (input.tenantId === "demo" ? tenantCompositions.find((item) => item.tenantId === "demo") : undefined)
  const brandComposition = tenantComposition
    ? brandCompositions.find((item) => item.id === tenantComposition.brandId)
    : undefined

  const allTemplateIds = contentTemplates.map((template) => template.id)
  const brandAllowed = brandComposition?.allowedTemplateIds ?? allTemplateIds
  const tenantAllowed = tenantComposition?.enabledTemplateIds ?? brandAllowed
  const allowedTemplateIds = toUniqueNonEmpty(tenantAllowed).filter((id) => allTemplateIds.includes(id))
  const safeAllowedTemplateIds =
    allowedTemplateIds.length > 0
      ? allowedTemplateIds
      : allTemplateIds.includes(EMPTY_TEMPLATE_ID)
        ? [EMPTY_TEMPLATE_ID]
        : allTemplateIds

  const requestedDefaultTemplateId =
    tenantComposition?.defaultTemplateId ?? brandComposition?.defaultTemplateId ?? EMPTY_TEMPLATE_ID
  const defaultTemplateId = safeAllowedTemplateIds.includes(requestedDefaultTemplateId)
    ? requestedDefaultTemplateId
    : safeAllowedTemplateIds[0] ?? EMPTY_TEMPLATE_ID

  const mergedLocales = toUniqueNonEmpty(
    tenantComposition?.enabledLocales ?? brandComposition?.enabledLocales ?? FALLBACK_LOCALES,
  )
  const enabledLocales = mergedLocales.length > 0 ? mergedLocales : FALLBACK_LOCALES

  const requestedDefaultLocale = brandComposition?.defaultLocale ?? enabledLocales[0] ?? FALLBACK_LOCALES[0]
  const defaultLocale = enabledLocales.includes(requestedDefaultLocale)
    ? requestedDefaultLocale
    : enabledLocales[0] ?? FALLBACK_LOCALES[0]

  return {
    tenantId: input.tenantId,
    brandId: tenantComposition?.brandId ?? brandComposition?.id ?? "generic",
    allowedTemplateIds: safeAllowedTemplateIds,
    defaultTemplateId,
    defaultThemePresetId: tenantComposition?.defaultThemePresetId ?? brandComposition?.defaultThemePresetId,
    defaultNavigationId: brandComposition?.defaultNavigationId,
    defaultLocale,
    enabledLocales,
  }
}
