import type { ContentStatus } from "./content-status"
import type { CreateMediaAssetInput, MediaAsset, MediaAssetType } from "./media"
import type {
  MediaAssetInput,
  MediaAssetRecord,
  MediaAssetStatus,
  MediaStorageProvider,
  MediaVisibility,
} from "./media-ownership"

function inferStorageProviderFromUrl(url: string): MediaStorageProvider {
  const trimmed = url.trim()
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return "external"
  }
  if (trimmed.startsWith("/")) {
    return "local"
  }
  return "unknown"
}

function contentStatusToMediaStatus(status: ContentStatus): MediaAssetStatus {
  if (status === "published") {
    return "active"
  }
  if (status === "archived") {
    return "archived"
  }
  return "draft"
}

function mediaStatusToContentStatus(status: MediaAssetStatus): ContentStatus {
  if (status === "active") {
    return "published"
  }
  if (status === "archived" || status === "orphaned") {
    return "archived"
  }
  return "draft"
}

function inferMediaAssetType(record: MediaAssetRecord): MediaAssetType {
  const mime = record.mimeType?.toLowerCase() ?? ""
  if (mime.startsWith("image/")) {
    return "image"
  }
  if (mime.startsWith("video/")) {
    return "video"
  }
  if (mime.startsWith("application/") || mime.includes("pdf")) {
    return "document"
  }
  return "image"
}

/**
 * Maps legacy in-memory/admin MediaAsset rows to provider-neutral metadata (Phase 75).
 * Does not perform I/O or URL signing.
 */
export function legacyMediaAssetToRecord(asset: MediaAsset): MediaAssetRecord {
  const url = asset.url.trim()
  const storageProvider = inferStorageProviderFromUrl(url)
  const isExternal = storageProvider === "external"

  return {
    id: asset.id,
    tenantId: asset.tenantId,
    storageProvider,
    storageKey: isExternal ? undefined : url,
    publicUrl: isExternal ? undefined : url,
    externalUrl: isExternal ? url : undefined,
    mimeType: asset.mimeType,
    fileName: asset.title,
    alt: asset.alt,
    label: asset.title,
    visibility: asset.status === "published" ? "public" : "private",
    status: contentStatusToMediaStatus(asset.status),
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  }
}

/**
 * Maps provider-neutral metadata back to legacy MediaAsset for existing admin UI (Phase 75).
 */
export function mediaAssetRecordToLegacy(record: MediaAssetRecord): MediaAsset {
  const url =
    record.publicUrl?.trim() ||
    record.externalUrl?.trim() ||
    record.storageKey?.trim() ||
    ""

  return {
    id: record.id,
    tenantId: record.tenantId,
    type: inferMediaAssetType(record),
    title: getLegacyTitle(record),
    url,
    alt: record.alt,
    mimeType: record.mimeType,
    status: mediaStatusToContentStatus(record.status),
    createdAt: record.createdAt ?? new Date().toISOString(),
    updatedAt: record.updatedAt ?? new Date().toISOString(),
  }
}

function getLegacyTitle(record: MediaAssetRecord): string {
  return record.label?.trim() || record.fileName?.trim() || record.id
}

/**
 * Maps admin create input to metadata input (no binary upload).
 */
export function mediaAssetInputToCreateInput(input: MediaAssetInput): CreateMediaAssetInput {
  const url =
    input.publicUrl?.trim() ||
    input.externalUrl?.trim() ||
    input.storageKey?.trim() ||
    ""

  return {
    tenantId: input.tenantId,
    type: inferMediaAssetType({
      id: "pending",
      tenantId: input.tenantId,
      storageProvider: input.storageProvider,
      mimeType: input.mimeType,
      visibility: input.visibility ?? "private",
      status: input.status ?? "draft",
    }),
    title: input.label?.trim() || input.fileName?.trim() || "Untitled",
    url,
    alt: input.alt,
    mimeType: input.mimeType,
  }
}

export function createMediaAssetInputToMetadataInput(
  input: CreateMediaAssetInput,
): MediaAssetInput {
  const url = input.url.trim()
  const storageProvider = inferStorageProviderFromUrl(url)
  const isExternal = storageProvider === "external"

  return {
    tenantId: input.tenantId,
    storageProvider,
    storageKey: isExternal ? undefined : url,
    publicUrl: isExternal ? undefined : url,
    externalUrl: isExternal ? url : undefined,
    mimeType: input.mimeType,
    fileName: input.title.trim(),
    alt: input.alt,
    label: input.title.trim(),
    visibility: "private",
    status: "draft",
  }
}

/**
 * Builds a legacy MediaAsset row from metadata input (in-memory persistence).
 */
export function metadataInputToLegacyMediaAsset(
  input: MediaAssetInput,
  id: string,
  timestamps?: { createdAt?: string; updatedAt?: string },
): MediaAsset {
  const url =
    input.publicUrl?.trim() ||
    input.externalUrl?.trim() ||
    input.storageKey?.trim() ||
    ""

  const now = new Date().toISOString()

  return {
    id,
    tenantId: input.tenantId,
    type: inferMediaAssetType({
      id,
      tenantId: input.tenantId,
      storageProvider: input.storageProvider,
      mimeType: input.mimeType,
      visibility: input.visibility ?? "private",
      status: input.status ?? "draft",
    }),
    title: input.label?.trim() || input.fileName?.trim() || id,
    url,
    alt: input.alt,
    mimeType: input.mimeType,
    status: mediaStatusToContentStatus(input.status ?? "draft"),
    createdAt: timestamps?.createdAt ?? now,
    updatedAt: timestamps?.updatedAt ?? now,
  }
}

export function mergeMediaAssetInput(
  existing: MediaAssetRecord,
  patch: Partial<MediaAssetInput>,
): MediaAssetInput {
  return {
    tenantId: existing.tenantId,
    storageProvider: patch.storageProvider ?? existing.storageProvider,
    storageKey: patch.storageKey ?? existing.storageKey,
    publicUrl: patch.publicUrl ?? existing.publicUrl,
    externalUrl: patch.externalUrl ?? existing.externalUrl,
    mimeType: patch.mimeType ?? existing.mimeType,
    fileName: patch.fileName ?? existing.fileName,
    alt: patch.alt ?? existing.alt,
    label: patch.label ?? existing.label,
    visibility: patch.visibility ?? existing.visibility,
    status: patch.status ?? existing.status,
  }
}
