import type { CmsBlock } from "@sovereign-cms/core"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asNumber(value: unknown, fallback = 3): number {
  return typeof value === "number" ? value : fallback
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

export function FeatureGridAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const headline = asString(props.headline)
  const intro = asString(props.intro)
  const columns = asNumber(props.columns, 3)
  const items = asArray(props.items)

  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns as 2 | 3 | 4] || "grid-cols-3"

  return (
    <div className="space-y-4">
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
