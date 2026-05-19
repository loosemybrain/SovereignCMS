import type { InspectorFieldDefinition } from "@/components/inspector/field-types"
import { getAdminBlockDefinition } from "@/block-definitions/registry"
import { getAdminMessages } from "@/lib/admin-i18n"
import type { AdminMessages, AdminUiLocale } from "@/lib/admin-i18n/types"

type BlockCatalogKey = keyof AdminMessages["blocks"]

export function getLocalizedBlockLabel(blockType: string, locale: AdminUiLocale): string {
  const block = getAdminMessages(locale).blocks[blockType as BlockCatalogKey]
  if (block?.label) {
    return block.label
  }
  return getAdminBlockDefinition(blockType)?.label ?? blockType
}

export function getLocalizedBlockCategory(category: string, locale: AdminUiLocale): string {
  const categories = getAdminMessages(locale).blockCategories
  const key = category as keyof typeof categories
  return categories[key] ?? category
}

export function localizeInspectorFields(
  blockType: string,
  fields: InspectorFieldDefinition[],
  locale: AdminUiLocale,
): InspectorFieldDefinition[] {
  const block = getAdminMessages(locale).blocks[blockType as BlockCatalogKey]
  if (!block) {
    return fields
  }

  return fields.map((field) => ({
    ...field,
    label: block.fields[field.key] ?? field.label,
    options: field.options?.map((option) => ({
      ...option,
      label: block.select?.[`${field.key}.${option.value}`] ?? option.label,
    })),
  }))
}
