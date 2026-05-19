import type { MediaAssetRecord } from "./media-ownership"
import { isRenderableMediaAsset } from "./media-ownership"

/**
 * Block-level media pointer stored in editor props (Phase 76).
 * Maps to `imageUrl` / `mediaUrl`, `imageAlt` / `mediaAlt`, `mediaAssetId`.
 */
export type MediaReference = {
  assetId?: string
  url?: string
  alt?: string
}

function trimOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function mediaReferenceFromProps(input: {
  url?: unknown
  alt?: unknown
  assetId?: unknown
}): MediaReference {
  return {
    assetId: trimOptionalString(input.assetId),
    url: trimOptionalString(input.url),
    alt: trimOptionalString(input.alt),
  }
}

export function hasMediaReferenceInput(ref: MediaReference): boolean {
  return Boolean(ref.assetId?.trim() || ref.url?.trim())
}

/**
 * Validates URL for synthetic metadata records (no network).
 * Allows internal paths and HTTPS only.
 */
export function isAllowedMediaReferenceUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) {
    return false
  }

  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:")
  ) {
    return false
  }

  if (lower.startsWith("http://")) {
    return false
  }

  if (trimmed.startsWith("https://")) {
    return true
  }

  return trimmed.startsWith("/") && !trimmed.startsWith("//")
}

export function isResolvedMediaReferenceRenderable(
  record: MediaAssetRecord | undefined,
): boolean {
  if (!record) {
    return false
  }
  return isRenderableMediaAsset(record)
}

/** Renderable HTTPS or internal path from resolved metadata (no signing). */
export function toRenderableMediaUrl(record: MediaAssetRecord): string | undefined {
  if (!isRenderableMediaAsset(record)) {
    return undefined
  }
  return record.publicUrl?.trim() || record.externalUrl?.trim()
}
