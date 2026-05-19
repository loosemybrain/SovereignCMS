import {
  legacyMediaAssetToRecord,
  mediaAssetRecordToLegacy,
  mergeMediaAssetInput,
  mediaAssetInputToCreateInput,
} from "@sovereign-cms/core"
import type { DatabaseAdapter } from "../contracts"
import type { MediaPersistenceAdapter } from "./types"
import { filterRowsByTenant } from "./assert-operational-read-tenant"
import { requireScopedContentTenantId } from "./assert-content-write-tenant"
import { normalizeAdapterError, PersistenceAdapterError } from "./errors"
import { requireAdapterTenantId } from "./require-tenant-id"

function toRecordFromLegacyList(
  assets: Awaited<ReturnType<DatabaseAdapter["media"]["listByTenant"]>>,
  tenantId: string,
  operation: string,
) {
  const scoped = filterRowsByTenant(assets, tenantId, operation)
  return scoped.map(legacyMediaAssetToRecord)
}

export function createMediaAdapterFromDatabase(db: DatabaseAdapter): MediaPersistenceAdapter {
  return {
    async listMedia(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listMedia")
      try {
        const assets = await db.media.listByTenant({ tenantId })
        const records = toRecordFromLegacyList(assets, tenantId, "listMedia")
        if (params.folderId) {
          return records.filter((record) => record.storageKey?.includes(params.folderId ?? ""))
        }
        return records
      } catch (error) {
        throw normalizeAdapterError("listMedia", error)
      }
    },

    async getMediaById(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getMediaById")
      try {
        const assets = await db.media.listByTenant({ tenantId })
        const asset = assets.find((candidate) => candidate.id === params.mediaId) ?? null
        if (!asset || asset.tenantId !== tenantId) {
          return null
        }
        return legacyMediaAssetToRecord(asset)
      } catch (error) {
        throw normalizeAdapterError("getMediaById", error)
      }
    },

    async createMediaMetadata(params) {
      const tenantId = requireScopedContentTenantId(
        params.tenantId,
        params.input.tenantId,
        "createMediaMetadata",
      )
      try {
        const created = await db.media.create(mediaAssetInputToCreateInput({ ...params.input, tenantId }))
        return legacyMediaAssetToRecord(created)
      } catch (error) {
        throw normalizeAdapterError("createMediaMetadata", error)
      }
    },

    async updateMediaMetadata(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "updateMediaMetadata")
      if (params.input.tenantId && params.input.tenantId !== tenantId) {
        throw new PersistenceAdapterError(
          "tenant_scope_mismatch",
          "updateMediaMetadata: input tenantId does not match scoped tenant",
        )
      }

      try {
        const existing = await this.getMediaById({
          tenantId,
          mediaId: params.mediaId,
        })
        if (!existing) {
          throw new PersistenceAdapterError(
            "media_not_found",
            `updateMediaMetadata: media ${params.mediaId} not found for tenant ${tenantId}`,
          )
        }

        const merged = mergeMediaAssetInput(existing, params.input)
        const legacy = mediaAssetRecordToLegacy({
          ...existing,
          ...merged,
          id: existing.id,
          tenantId,
        })

        const updated = await db.media.updateMetadata({
          tenantId,
          mediaId: params.mediaId,
          patch: {
            tenantId,
            type: legacy.type,
            title: legacy.title,
            url: legacy.url,
            alt: legacy.alt,
            mimeType: legacy.mimeType,
            status: legacy.status,
          },
        })

        if (!updated) {
          throw new PersistenceAdapterError(
            "media_not_found",
            `updateMediaMetadata: media ${params.mediaId} not found for tenant ${tenantId}`,
          )
        }

        return legacyMediaAssetToRecord(updated)
      } catch (error) {
        throw normalizeAdapterError("updateMediaMetadata", error)
      }
    },

    async archiveMedia(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "archiveMedia")
      try {
        const archived = await db.media.archive({ tenantId, mediaId: params.mediaId })
        if (!archived) {
          throw new PersistenceAdapterError(
            "media_not_found",
            `archiveMedia: media ${params.mediaId} not found for tenant ${tenantId}`,
          )
        }
        return legacyMediaAssetToRecord(archived)
      } catch (error) {
        throw normalizeAdapterError("archiveMedia", error)
      }
    },
  }
}
