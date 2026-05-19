import type { TenantId } from "./cms"

export type MediaAssetId = string

export type MediaStorageProvider =
  | "supabase"
  | "s3"
  | "local"
  | "external"
  | "unknown"

export type MediaVisibility = "public" | "private"

export type MediaAssetStatus = "active" | "draft" | "archived" | "orphaned"

export type MediaAssetRecord = {
  id: MediaAssetId
  tenantId: TenantId
  storageProvider: MediaStorageProvider
  storageKey?: string
  publicUrl?: string
  externalUrl?: string
  mimeType?: string
  fileName?: string
  alt?: string
  label?: string
  visibility: MediaVisibility
  status: MediaAssetStatus
  createdAt?: string
  updatedAt?: string
}

export type MediaAssetInput = {
  tenantId: TenantId
  storageProvider: MediaStorageProvider
  storageKey?: string
  publicUrl?: string
  externalUrl?: string
  mimeType?: string
  fileName?: string
  alt?: string
  label?: string
  visibility?: MediaVisibility
  status?: MediaAssetStatus
}

export function isMediaAssetOwnedByTenant(
  asset: Pick<MediaAssetRecord, "tenantId">,
  tenantId: TenantId,
): boolean {
  const scopedTenant = tenantId?.trim()
  if (!scopedTenant) {
    return false
  }
  return asset.tenantId?.trim() === scopedTenant
}

export function isRenderableMediaAsset(asset: MediaAssetRecord): boolean {
  if (asset.status === "archived" || asset.status === "orphaned") {
    return false
  }
  if (asset.visibility === "private") {
    return false
  }

  const url = asset.publicUrl?.trim() || asset.externalUrl?.trim()
  if (!url) {
    return false
  }

  const lower = url.toLowerCase()
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

  return url.startsWith("https://") || (url.startsWith("/") && !url.startsWith("//"))
}

export function getMediaAssetDisplayLabel(asset: MediaAssetRecord): string {
  const label = asset.label?.trim()
  if (label) {
    return label
  }

  const fileName = asset.fileName?.trim()
  if (fileName) {
    return fileName
  }

  return asset.id
}
