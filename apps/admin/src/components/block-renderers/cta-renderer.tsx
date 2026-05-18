import type { CmsBlock } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function CtaAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const eyebrow = asString(props.eyebrow)
  const headline = asString(props.headline, "(ohne headline)")
  const body = asString(props.body)
  const primaryLabel = asString(props.primaryLabel)
  const secondaryLabel = asString(props.secondaryLabel)
  const align = asString(props.align, "center")

  return (
    <div className="space-y-3">
      <div className={cn("text-sm", align === "center" && "text-center")}>
        {eyebrow ? (
          <p className="text-xs font-medium uppercase admin-text-muted">{eyebrow}</p>
        ) : null}
        <p className="font-semibold admin-text">{headline}</p>
        {body ? <p className="mt-1 text-sm admin-text-muted">{body}</p> : null}
      </div>

      <div className={cn("flex flex-wrap gap-2", align === "center" ? "justify-center" : "justify-start")}>
        {primaryLabel ? (
          <span className="rounded px-4 py-2 text-sm font-medium admin-accent bg-[color-mix(in_oklab,var(--admin-accent)_18%,var(--admin-surface))]">
            {primaryLabel}
          </span>
        ) : null}
        {secondaryLabel ? (
          <span className="rounded border admin-border px-4 py-2 text-sm font-medium admin-text">
            {secondaryLabel}
          </span>
        ) : null}
      </div>
    </div>
  )
}
