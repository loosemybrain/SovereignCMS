/**
 * @deprecated Use composePublicBlockMedia from @sovereign-cms/runtime (Phase 77).
 */
import type { CmsBlock } from "@sovereign-cms/core"
import { composePublicBlockMedia, createRuntime } from "@sovereign-cms/runtime"

const runtime = createRuntime()

export async function enrichPublicBlocksMedia(
  blocks: CmsBlock[],
  tenantId: string,
): Promise<CmsBlock[]> {
  const { value } = await composePublicBlockMedia({
    tenantId,
    blocks,
    mediaResolver: runtime.mediaResolver,
  })
  return value
}
