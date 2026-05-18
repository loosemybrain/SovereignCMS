import type { CmsBlock } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import { bp } from "@/components/block-renderers/preview-classes"
import { parseJsonSafe } from "@/lib/parse-json-safe"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asNumber(value: unknown, fallback = 3): number {
  const num = typeof value === "number" ? value : typeof value === "string" ? parseInt(value, 10) : NaN
  return isNaN(num) ? fallback : num
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

export function FeatureGridAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const headline = asString(props.headline)
  const intro = asString(props.intro)

  let items = asArray(props.items)
  let usedFallback = false

  if (items.length === 0) {
    const itemsJson = asString(props.itemsJson)
    if (itemsJson) {
      const parsed = parseJsonSafe<unknown[]>(itemsJson)
      if (parsed && Array.isArray(parsed)) {
        items = parsed
        usedFallback = true
      }
    }
  }

  const columnsRaw = props.columns ?? "3"
  const columns = asNumber(columnsRaw, 3)

  const gridColsClass =
    {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    }[columns as 2 | 3 | 4] || "grid-cols-3"

  return (
    <div className={bp.stack}>
      {usedFallback ? (
        <p className={bp.noticeWarning}>
          ℹ️ Using legacy itemsJson format. Consider re-saving with the new items editor.
        </p>
      ) : null}

      {headline ? <p className={bp.title}>{headline}</p> : null}
      {intro ? <p className={bp.body}>{intro}</p> : null}

      <div className={cn("grid gap-3", gridColsClass)}>
        {items.length > 0 ? (
          items.map((item, idx) => {
            const itemRecord = asRecord(item)
            const itemTitle = asString(itemRecord.title, `Item ${idx + 1}`)
            const itemBody = asString(itemRecord.body)

            return (
              <div key={String(itemRecord.id || `item-${idx}`)} className={bp.card}>
                <p className={cn(bp.title, "text-sm")}>{itemTitle}</p>
                {itemBody ? <p className={cn(bp.body, "mt-1 text-xs")}>{itemBody}</p> : null}
              </div>
            )
          })
        ) : (
          <p className={cn(bp.meta, "col-span-full")}>Keine Items definiert</p>
        )}
      </div>
    </div>
  )
}
