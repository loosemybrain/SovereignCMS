import type { InspectorSectionKey } from "@sovereign-cms/core"
import type { AdminUiLocale } from "@/lib/admin-i18n"
import { getAdminMessages } from "@/lib/admin-i18n"

/**
 * Fixed render order for inspector sections (admin block inspector).
 */
export const INSPECTOR_SECTION_ORDER: readonly InspectorSectionKey[] = [
  "content",
  "media",
  "actions",
  "layout",
  "advanced",
] as const

export function getInspectorSectionLabels(
  locale: AdminUiLocale,
): Record<InspectorSectionKey, string> {
  return getAdminMessages(locale).inspector.sections
}

export function resolveInspectorSectionKey(
  field: { section?: InspectorSectionKey },
): InspectorSectionKey {
  return field.section ?? "content"
}

export function bucketInspectorFieldsBySection<F extends { section?: InspectorSectionKey }>(
  fields: readonly F[],
): Record<InspectorSectionKey, F[]> {
  const buckets: Record<InspectorSectionKey, F[]> = {
    content: [],
    media: [],
    actions: [],
    layout: [],
    advanced: [],
  }
  for (const field of fields) {
    buckets[resolveInspectorSectionKey(field)].push(field)
  }
  return buckets
}
