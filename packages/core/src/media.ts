import type { ContentStatus } from "./content-status"

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
