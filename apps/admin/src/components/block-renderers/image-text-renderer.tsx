import type { CmsBlock } from "@sovereign-cms/core"
import { normalizeMediaReference } from "@sovereign-cms/core"
import type { ReactNode } from "react"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function ImageTextAdminRenderer({ block }: { block: CmsBlock }) {
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

  const displayAlt = normalized.alt || headline || "Bild"

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
        <p className="break-all text-xs text-zinc-400">{normalized.safeUrl}</p>
        <p className="mt-1 text-xs text-zinc-500">Externes Bild — in der Vorschau nicht geladen</p>
      </div>
    )
  } else if (normalized.sourceType === "placeholder") {
    preview = (
      <p className="px-4 text-center text-xs text-zinc-400">Medien-Platzhalter (Asset-ID ohne darstellbare URL)</p>
    )
  } else if (normalized.sourceType === "missing") {
    preview = (
      <p className="px-4 text-center text-xs text-zinc-500">{normalized.warning ?? "Kein Bild konfiguriert"}</p>
    )
  } else {
    preview = (
      <div className="px-4 text-center">
        <p className="text-xs font-medium text-amber-200/90">Ungültige Bild-URL</p>
        {normalized.warning ? (
          <p className="mt-1 break-words text-[11px] text-zinc-400">{normalized.warning}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
        {preview}
      </div>

      <div className="space-y-2">
        {headline ? <p className="font-semibold text-gray-900">{headline}</p> : null}
        {body ? <p className="text-sm text-gray-600">{body}</p> : null}
        {asString(props.imageUrl) ? (
          <p className="text-xs text-zinc-500">
            <span className="font-medium">Position:</span> {imagePosition}
          </p>
        ) : null}
        {ctaLabel ? (
          <p className="text-xs font-medium text-blue-600">
            <span className="font-medium">CTA:</span> {ctaLabel}
          </p>
        ) : null}
      </div>
    </div>
  )
}
