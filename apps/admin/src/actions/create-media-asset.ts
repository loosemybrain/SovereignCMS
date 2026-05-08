"use server"

import { createRuntime } from "@sovereign-cms/runtime"
import type { CreateMediaAssetInput, CreateMediaAssetResult } from "@sovereign-cms/core"
import { isMediaAssetType } from "@sovereign-cms/core"

export async function createMediaAssetAction(
  input: CreateMediaAssetInput,
): Promise<CreateMediaAssetResult> {
  if (
    typeof input.tenantId !== "string" ||
    input.tenantId.length === 0 ||
    typeof input.title !== "string" ||
    input.title.length === 0 ||
    typeof input.url !== "string" ||
    input.url.length === 0
  ) {
    throw new Error("Invalid createMediaAsset input")
  }

  if (!isMediaAssetType(input.type)) {
    throw new Error("Invalid media asset type")
  }

  const runtime = createRuntime()

  return runtime.mediaPersistence.createMediaAsset(input)
}
