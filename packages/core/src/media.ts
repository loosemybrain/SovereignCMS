import type { ContentStatus } from "./content-status"

/** Semantic classification for CMS-authored media references (no I/O). */
export type MediaSourceType = "internal" | "external" | "placeholder" | "missing" | "invalid"

/** Normalized view for renderers and governance (pure, no network). */
export type NormalizedMediaReference = {
  sourceType: MediaSourceType
  /** Original URL when invalid or for diagnostics (not necessarily safe to render). */
  url?: string
  safeUrl?: string
  alt?: string
  assetId?: string
  label?: string
  isRenderable: boolean
  requiresAlt: boolean
  isExternal: boolean
  /** Short technical reason for invalid / missing / placeholder states. */
  warning?: string
}

function trimMediaString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const t = value.trim()
  return t.length > 0 ? t : undefined
}

function trimAssetId(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === "string") {
    const t = value.trim()
    return t.length > 0 ? t : undefined
  }
  return undefined
}

/**
 * Pure normalization of free-form image URL + optional alt/asset metadata.
 * Does not fetch URLs, transform images, or touch the database.
 */
export function normalizeMediaReference(input: {
  imageUrl?: unknown
  imageAlt?: unknown
  assetId?: unknown
  label?: unknown
}): NormalizedMediaReference {
  const urlRaw = trimMediaString(input.imageUrl)
  const alt = trimMediaString(input.imageAlt)
  const label = trimMediaString(input.label)
  const assetId = trimAssetId(input.assetId)

  const base = { alt, label, assetId }

  if (!urlRaw) {
    if (assetId) {
      return {
        ...base,
        sourceType: "placeholder",
        assetId,
        isRenderable: false,
        requiresAlt: false,
        isExternal: false,
        warning: "Asset ID set; no renderable image URL yet.",
      }
    }
    return {
      ...base,
      sourceType: "missing",
      isRenderable: false,
      requiresAlt: false,
      isExternal: false,
      warning: "No image URL or asset reference.",
    }
  }

  const lower = urlRaw.toLowerCase()
  if (lower.startsWith("javascript:") || lower.startsWith("vbscript:") || lower.startsWith("data:")) {
    return {
      ...base,
      sourceType: "invalid",
      url: urlRaw,
      isRenderable: false,
      requiresAlt: false,
      isExternal: false,
      warning: "Blocked URL scheme (data:, javascript:, or vbscript:).",
    }
  }

  if (lower.startsWith("http://")) {
    return {
      ...base,
      sourceType: "invalid",
      url: urlRaw,
      isRenderable: false,
      requiresAlt: false,
      isExternal: false,
      warning: "HTTP image URLs are not allowed; use HTTPS or an internal path.",
    }
  }

  if (urlRaw.startsWith("https://")) {
    return {
      ...base,
      sourceType: "external",
      url: urlRaw,
      safeUrl: urlRaw,
      isRenderable: true,
      requiresAlt: true,
      isExternal: true,
    }
  }

  if (urlRaw.startsWith("/") && !urlRaw.startsWith("//")) {
    return {
      ...base,
      sourceType: "internal",
      url: urlRaw,
      safeUrl: urlRaw,
      isRenderable: true,
      requiresAlt: true,
      isExternal: false,
    }
  }

  return {
    ...base,
    sourceType: "invalid",
    url: urlRaw,
    isRenderable: false,
    requiresAlt: false,
    isExternal: false,
    warning: "Image URL must be an internal path (/path) or https://…",
  }
}

export type MediaAssetType = "image" | "document" | "video" | "other"

export type MediaAsset = {
  id: string
  tenantId: string
  type: MediaAssetType
  title: string
  alt?: string
  url: string
  mimeType?: string
  size?: number
  width?: number
  height?: number
  status: ContentStatus
  createdAt: string
  updatedAt: string
}

export type CreateMediaAssetInput = {
  tenantId: string
  type: MediaAssetType
  title: string
  url: string
  alt?: string
  mimeType?: string
  size?: number
  width?: number
  height?: number
}

export type CreateMediaAssetResult = {
  success: boolean
  asset: MediaAsset
  createdAt: string
  persisted: boolean
}

export function validateMediaTitle(title: string): boolean {
  return title.trim().length > 0
}

export function validateMediaUrl(url: string): boolean {
  const value = url.trim()

  if (!value) {
    return false
  }

  return (
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("/")
  )
}

export const MEDIA_ASSET_TYPES: MediaAssetType[] = [
  "image",
  "document",
  "video",
  "other",
]

export function isMediaAssetType(value: unknown): value is MediaAssetType {
  return (
    value === "image" ||
    value === "document" ||
    value === "video" ||
    value === "other"
  )
}
