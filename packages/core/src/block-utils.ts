/**
 * Utility functions for block property normalization.
 */

/**
 * Simple list item shape used in repeaters.
 */
export type SimpleListItem = {
  id: string
  title: string
  body?: string
}

/**
 * Normalize a simple list items array.
 * Accepts unknown input and returns a safe array of items.
 *
 * Rules:
 * - Non-arrays return empty array
 * - Items without id or title are discarded
 * - Missing body is preserved as undefined
 * - Generates fallback id only if needed for display (admin context)
 */
export function normalizeSimpleListItems(value: unknown): SimpleListItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  const items: SimpleListItem[] = []

  for (const item of value) {
    if (typeof item !== "object" || !item) {
      continue
    }

    const record = item as Record<string, unknown>
    const id = typeof record.id === "string" && record.id.trim() ? record.id : null
    const title = typeof record.title === "string" && record.title.trim() ? record.title : null
    const body = typeof record.body === "string" ? record.body : undefined

    // Only keep items with valid id and title
    if (id && title) {
      items.push({
        id,
        title,
        body: body || undefined,
      })
    }
  }

  return items
}
