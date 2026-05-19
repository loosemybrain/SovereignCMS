"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import { bp } from "@/components/block-renderers/preview-classes"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { cn } from "@sovereign-cms/ui"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function HeroAdminRenderer({ block }: { block: CmsBlock }) {
  const { messages } = useAdminI18n()
  const l = messages.blockPreview
  const props = asRecord(block.props)
  const headline = asString(props.headline, l.emptyHeadline)
  const subline = asString(props.subline)
  const mediaUrl = asString(props.mediaUrl)
  const mediaAlt = asString(props.mediaAlt)

  return (
    <div className={bp.stack}>
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

      <div className={bp.stack}>
        <p className={bp.body}>
          <span className="font-medium admin-text">{l.headline}:</span> {headline}
        </p>
        <p className={bp.body}>
          <span className="font-medium admin-text">{l.subline}:</span> {subline || "—"}
        </p>
        {mediaUrl && (
          <p className={cn(bp.meta, "mt-1")}>
            <span className="font-medium">{l.mediaUrl}:</span> {mediaUrl.substring(0, 30)}...
          </p>
        )}
      </div>
    </div>
  )
}
