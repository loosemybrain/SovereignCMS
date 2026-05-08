import type { CmsBlock } from "@sovereign-cms/core"

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
    <div className="space-y-3">
      {/* Hero Image Preview */}
      {mediaUrl && (
        <div className="rounded-lg bg-zinc-900 border border-zinc-700 overflow-hidden h-32 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl}
            alt={mediaAlt || headline}
            className="max-h-32 max-w-full object-contain"
          />
        </div>
      )}

      {/* Text Content */}
      <div>
        <p>
          <span className="font-medium">headline:</span> {headline}
        </p>
        <p>
          <span className="font-medium">subline:</span> {subline || "-"}
        </p>
        {mediaUrl && (
          <p className="text-xs text-zinc-500 mt-1">
            <span className="font-medium">mediaUrl:</span> {mediaUrl.substring(0, 30)}...
          </p>
        )}
      </div>
    </div>
  )
}
