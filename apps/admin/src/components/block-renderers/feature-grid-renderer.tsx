import type { CmsBlock } from "@sovereign-cms/core"
import { parseJsonSafe } from "@/lib/parse-json-safe"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asNumber(value: unknown, fallback = 3): number {
  const num = typeof value === "number" ? value : (typeof value === "string" ? parseInt(value, 10) : NaN)
  return isNaN(num) ? fallback : num
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

export function FeatureGridAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const headline = asString(props.headline)
  const intro = asString(props.intro)

  // Try to parse itemsJson first, fallback to items
  let items = asArray(props.items)
  const itemsJson = asString(props.itemsJson)
  if (itemsJson) {
    const parsed = parseJsonSafe<unknown[]>(itemsJson)
    if (parsed && Array.isArray(parsed)) {
      items = parsed
    }
  }

  // Handle columns as string or number
  const columnsRaw = props.columns ?? "3"
  const columns = asNumber(columnsRaw, 3)

  // Show warning if itemsJson is invalid
  const hasInvalidJson = itemsJson && !items.length

  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns as 2 | 3 | 4] || "grid-cols-3"

  return (
    <div className="space-y-4">
      {hasInvalidJson && (
        <div className="rounded border border-amber-600 bg-amber-50 p-2">
          <p className="text-xs text-amber-900 font-medium">
            ⚠️ itemsJson has invalid JSON. Using fallback items.
          </p>
        </div>
      )}

      {headline && (
        <p className="font-semibold text-gray-900">{headline}</p>
      )}
      {intro && (
        <p className="text-sm text-gray-600">{intro}</p>
      )}

      <div className={`grid ${gridColsClass} gap-4`}>
        {items.length > 0 ? (
          items.map((item, idx) => {
            const itemRecord = asRecord(item)
            const itemTitle = asString(itemRecord.title, `Item ${idx + 1}`)
            const itemBody = asString(itemRecord.body)

            return (
              <div
                key={String(itemRecord.id || `item-${idx}`)}
                className="rounded border border-gray-200 bg-gray-50 p-3"
              >
                <p className="font-medium text-sm text-gray-900">{itemTitle}</p>
                {itemBody && (
                  <p className="text-xs text-gray-600 mt-1">{itemBody}</p>
                )}
              </div>
            )
          })
        ) : (
          <p className="text-xs text-gray-500 col-span-full">Keine Items definiert</p>
        )}
      </div>
    </div>
  )
}
