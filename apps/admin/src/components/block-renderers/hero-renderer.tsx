import type { CmsBlock } from "@sovereign-cms/core"
import { bp } from "@/components/block-renderers/preview-classes"
import { cn } from "@sovereign-cms/ui"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function HeroAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const headline = asString(props.headline, "(ohne headline)")
  const subline = asString(props.subline)
  const mediaUrl = asString(props.mediaUrl)
  const mediaAlt = asString(props.mediaAlt)

  return (
    <div className={bp.stack}>
      {/* Hero Image Preview */}
      {mediaUrl && (
        <div className={cn(bp.media, "h-32")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl}
            alt={mediaAlt || headline}
            className="max-h-32 max-w-full object-contain"
          />
        </div>
      )}

      {/* Text Content */}
      <div className={bp.stack}>
        <p className={bp.body}>
          <span className="font-medium admin-text">headline:</span> {headline}
        </p>
        <p className={bp.body}>
          <span className="font-medium admin-text">subline:</span> {subline || "-"}
        </p>
        {mediaUrl && (
          <p className={cn(bp.meta, "mt-1")}>
            <span className="font-medium">mediaUrl:</span> {mediaUrl.substring(0, 30)}...
          </p>
        )}
      </div>
    </div>
  )
}
