"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import { normalizeMediaReference } from "@sovereign-cms/core"
import type { ReactNode } from "react"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { bp } from "@/components/block-renderers/preview-classes"
import { cn } from "@sovereign-cms/ui"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function ImageTextAdminRenderer({ block }: { block: CmsBlock }) {
  const { messages: t } = useAdminI18n()
  const mp = t.mediaPreview

  const props = asRecord(block.props)
  const headline = asString(props.headline)
  const body = asString(props.body)
  const imagePosition = asString(props.imagePosition, "right")
  const ctaLabel = asString(props.ctaLabel)

  const normalized = normalizeMediaReference({
    imageUrl: props.imageUrl,
    imageAlt: props.imageAlt,
    assetId: props.mediaAssetId,
  })

  const displayAlt = normalized.alt || headline || "Image"

  let preview: ReactNode
  if (normalized.isRenderable && normalized.sourceType === "internal" && normalized.safeUrl) {
    preview = (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={normalized.safeUrl} alt={displayAlt} className="max-h-32 max-w-full object-contain" />
      </>
    )
  } else if (normalized.sourceType === "external" && normalized.safeUrl) {
    preview = (
      <div className="px-4 text-center">
        <p className={cn(bp.meta, "break-all")}>{normalized.safeUrl}</p>
        <p className={cn(bp.meta, "mt-1")}>{mp.externalNotLoaded}</p>
      </div>
    )
  } else if (normalized.sourceType === "placeholder") {
    preview = <p className={cn(bp.meta, "px-4 text-center")}>{mp.placeholder}</p>
  } else if (normalized.sourceType === "missing") {
    preview = <p className={cn(bp.meta, "px-4 text-center")}>{normalized.warning ?? mp.noImage}</p>
  } else {
    preview = (
      <div className="px-4 text-center">
        <p className={bp.noticeWarning}>{mp.invalidUrl}</p>
        {normalized.warning ? (
          <p className={cn(bp.meta, "mt-1 break-words")}>{normalized.warning}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className={bp.stack}>
      <div className={bp.media}>
        {preview}
      </div>

      <div className={bp.stack}>
        {headline ? <p className={bp.title}>{headline}</p> : null}
        {body ? <p className={bp.body}>{body}</p> : null}
        {asString(props.imageUrl) ? (
          <p className={bp.meta}>
            <span className="font-medium">Position:</span> {imagePosition}
          </p>
        ) : null}
        {ctaLabel ? (
          <p className={bp.link}>
            <span className="font-medium">CTA:</span> {ctaLabel}
          </p>
        ) : null}
      </div>
    </div>
  )
}
