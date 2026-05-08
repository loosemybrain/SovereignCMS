import type { CreateMediaAssetInput } from "@sovereign-cms/core"
import { createMediaAssetAction } from "@/actions/create-media-asset"
import { loadMediaAssetsAction } from "@/actions/load-media-assets"

/** This client adapter delegates to server-side media boundaries. */
export const clientMediaPersistence = {
  async listMediaAssets(input: { tenantId: string }) {
    return loadMediaAssetsAction(input)
  },

  async createMediaAsset(input: CreateMediaAssetInput) {
    return createMediaAssetAction(input)
  },
}
