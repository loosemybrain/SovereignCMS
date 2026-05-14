import type { InspectorSectionKey } from "@sovereign-cms/core"

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

/**
 * Static German labels for inspector sections. No i18n / tenant logic.
 */
export const INSPECTOR_SECTION_LABELS: Record<InspectorSectionKey, string> = {
  content: "Inhalt",
  media: "Medien",
  actions: "Aktionen",
  layout: "Layout",
  advanced: "Erweitert",
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
