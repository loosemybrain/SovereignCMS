"use server"

import { createRuntime } from "@sovereign-cms/runtime"

export async function loadMediaAssetsAction(input: { tenantId: string }) {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid loadMediaAssets input")
  }

  const runtime = createRuntime()

  return runtime.mediaPersistence.listMediaAssets(input)
}
