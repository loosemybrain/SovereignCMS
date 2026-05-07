import type { CmsBlock } from "@sovereign-cms/core"
import { renderAdminBlock } from "@/components/admin-block-renderer-registry"

export { HeroAdminRenderer } from "@/components/block-renderers/hero-renderer"
export { TextAdminRenderer } from "@/components/block-renderers/text-renderer"
export { FallbackAdminRenderer } from "@/components/block-renderers/fallback-renderer"
export { FallbackAdminRenderer as UnknownAdminRenderer } from "@/components/block-renderers/fallback-renderer"

export function AdminBlockRenderer({ block }: { block: CmsBlock }) {
  return renderAdminBlock(block)
}
