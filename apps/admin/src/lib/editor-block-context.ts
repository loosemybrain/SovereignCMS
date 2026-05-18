import type { CmsBlock } from "@sovereign-cms/core"
import { getAdminBlockDefinition } from "@/block-definitions/registry"

const EXCERPT_PROP_KEYS = ["headline", "title", "subline", "intro", "body", "eyebrow", "primaryLabel"] as const

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

/** Short editorial label from common block props, or null if none. */
export function getBlockEditorExcerpt(block: CmsBlock, maxLen = 52): string | null {
  const props = asRecord(block.props)
  for (const key of EXCERPT_PROP_KEYS) {
    const raw = props[key]
    if (typeof raw !== "string") continue
    const trimmed = raw.trim()
    if (!trimmed) continue
    if (trimmed.length <= maxLen) return trimmed
    return `${trimmed.slice(0, maxLen - 1)}…`
  }
  return null
}

export type BlockEditorPosition = {
  index: number
  total: number
  /** 1-based position for display */
  displayIndex: number
}

export function getBlockEditorPosition(
  blockId: string,
  orderedBlocks: CmsBlock[],
): BlockEditorPosition | null {
  const index = orderedBlocks.findIndex((b) => b.id === blockId)
  if (index < 0) return null
  return {
    index,
    total: orderedBlocks.length,
    displayIndex: index + 1,
  }
}

export function getBlockTypeLabel(block: CmsBlock): string {
  return getAdminBlockDefinition(block.type)?.label ?? block.type
}
