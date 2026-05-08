import type {
  CreateMediaAssetInput,
  CreateMediaAssetResult,
  MediaAsset,
} from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export function createMediaPersistence(input: { db: DatabaseAdapter }) {
  return {
    async listMediaAssets(params: { tenantId: string }): Promise<MediaAsset[]> {
      return input.db.media.listByTenant(params)
    },

    async createMediaAsset(
      createInput: CreateMediaAssetInput,
    ): Promise<CreateMediaAssetResult> {
      const asset = await input.db.media.create(createInput)

      return {
        success: true,
        asset,
        createdAt: new Date().toISOString(),
        persisted: false,
      }
    },
  }
}
