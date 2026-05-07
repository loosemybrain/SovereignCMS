import type { CmsBlock } from "@sovereign-cms/core"
import { FallbackAdminRenderer } from "@/components/block-renderers/fallback-renderer"
import { getAdminBlockDefinition } from "@/block-definitions/registry"

/**
 * Renders a block in the admin UI.
 * Looks up the block definition from the central registry
 * and uses its adminRenderer component.
 */
export function renderAdminBlock(block: CmsBlock) {
  const definition = getAdminBlockDefinition(block.type)

  if (!definition) {
    return <FallbackAdminRenderer block={block} />
  }

  const Renderer = definition.adminRenderer
  return <Renderer block={block} />
}
