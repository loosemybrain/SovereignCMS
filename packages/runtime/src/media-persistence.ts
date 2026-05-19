import type {
  CreateMediaAssetInput,
  CreateMediaAssetResult,
  MediaAsset,
} from "@sovereign-cms/core"
import {
  createMediaAssetInputToMetadataInput,
  mediaAssetRecordToLegacy,
} from "@sovereign-cms/core"
import type { MediaPersistenceAdapter } from "@sovereign-cms/db"

export function createMediaPersistence(input: { media: MediaPersistenceAdapter }) {
  return {
    async listMediaAssets(params: { tenantId: string }): Promise<MediaAsset[]> {
      const records = await input.media.listMedia(params)
      return records.map(mediaAssetRecordToLegacy)
    },

    async createMediaAsset(
      createInput: CreateMediaAssetInput,
    ): Promise<CreateMediaAssetResult> {
      const record = await input.media.createMediaMetadata({
        tenantId: createInput.tenantId,
        input: createMediaAssetInputToMetadataInput(createInput),
      })
      const asset = mediaAssetRecordToLegacy(record)
      return {
        success: true,
        asset,
        createdAt: asset.createdAt,
        persisted: false,
      }
    },
  }
}
