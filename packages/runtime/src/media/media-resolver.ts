import type { MediaReference } from "@sovereign-cms/core"
import {
  isAllowedMediaReferenceUrl,
  isMediaAssetOwnedByTenant,
  type MediaAssetRecord,
  type MediaStorageProvider,
} from "@sovereign-cms/core"
import type { MediaPersistenceAdapter } from "@sovereign-cms/db"

function requireScopedTenantId(tenantId: string, operation: string): string {
  const scoped = tenantId?.trim()
  if (!scoped) {
    throw new Error(`${operation}: tenantId is required`)
  }
  return scoped
}

function inferStorageProviderFromUrl(url: string): MediaStorageProvider {
  if (url.startsWith("https://")) {
    return "external"
  }
  if (url.startsWith("/")) {
    return "local"
  }
  return "unknown"
}

function syntheticRecordFromUrl(
  tenantId: string,
  url: string,
  alt?: string,
): MediaAssetRecord | undefined {
  if (!isAllowedMediaReferenceUrl(url)) {
    return undefined
  }

  const storageProvider = inferStorageProviderFromUrl(url)
  const isExternal = storageProvider === "external"

  return {
    id: `synthetic:url:${tenantId}:${url}`,
    tenantId,
    storageProvider,
    storageKey: isExternal ? undefined : url,
    publicUrl: isExternal ? undefined : url,
    externalUrl: isExternal ? url : undefined,
    alt,
    visibility: "public",
    status: "active",
  }
}

export type MediaResolver = {
  resolveMediaReference(
    ref: MediaReference,
    tenantId: string,
  ): Promise<MediaAssetRecord | undefined>
}

export function createMediaResolver(input: {
  media: MediaPersistenceAdapter
}): MediaResolver {
  return {
    async resolveMediaReference(ref, tenantId) {
      const scopedTenantId = requireScopedTenantId(tenantId, "resolveMediaReference")
      const assetId = ref.assetId?.trim()
      const url = ref.url?.trim()

      if (assetId) {
        const record = await input.media.getMediaById({
          tenantId: scopedTenantId,
          mediaId: assetId,
        })

        if (!record) {
          return undefined
        }

        if (!isMediaAssetOwnedByTenant(record, scopedTenantId)) {
          return undefined
        }

        return record
      }

      if (url) {
        return syntheticRecordFromUrl(scopedTenantId, url, ref.alt?.trim())
      }

      return undefined
    },
  }
}
