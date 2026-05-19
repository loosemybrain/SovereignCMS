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
 * Public page media composition (Phase 77).
 * Resolves hero/image-text media server-side before public rendering.
 */
export async function composePublicBlockMedia(params: {
  tenantId: string
  blocks: CmsBlock[]
  mediaAdapter?: MediaPersistenceAdapter
  mediaResolver?: MediaResolver
}): Promise<MediaCompositionResult<CmsBlock[]>> {
  const boundary = getRuntimeCompositionBoundary("public")
  assertRuntimeBoundaryValid(boundary, "public")

  return composeBlockMedia({
    mode: "public",
    tenantId: params.tenantId,
    blocks: params.blocks,
    mediaAdapter: params.mediaAdapter,
    mediaResolver: params.mediaResolver,
  })
}
