import type { CmsBlock } from "@sovereign-cms/core"
import {
  assertRuntimeBoundaryValid,
  getRuntimeCompositionBoundary,
} from "@sovereign-cms/core"
import type { MediaPersistenceAdapter } from "@sovereign-cms/db"
import { composeBlockMedia } from "./compose-block-media-core"
import type { MediaCompositionResult } from "./media-composition"
import type { MediaResolver } from "./media-resolver"

/**
 * Admin preview media composition (Phase 77).
 * Resolves tenant-owned assetIds; does not enable external image loading in preview.
 */
export async function composeAdminPreviewBlockMedia(params: {
  tenantId: string
  blocks: CmsBlock[]
  mediaAdapter?: MediaPersistenceAdapter
  mediaResolver?: MediaResolver
}): Promise<MediaCompositionResult<CmsBlock[]>> {
  const boundary = getRuntimeCompositionBoundary("admin-preview")
  assertRuntimeBoundaryValid(boundary, "admin-preview")

  return composeBlockMedia({
    mode: "admin-preview",
    tenantId: params.tenantId,
    blocks: params.blocks,
    mediaAdapter: params.mediaAdapter,
    mediaResolver: params.mediaResolver,
  })
}
