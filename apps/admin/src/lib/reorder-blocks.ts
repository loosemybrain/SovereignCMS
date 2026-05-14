/**
 * Utilities for reordering blocks locally.
 * Provides move up/down operations and sortOrder normalization.
 */

import type { CmsBlock } from "@sovereign-cms/core"

/**
 * Normalize sort order after reordering.
 * Updates sortOrder sequentially and timestamps.
 */
export function normalizeBlockOrder(blocks: CmsBlock[]): CmsBlock[] {
  return blocks.map((block, index) => ({
    ...block,
    sortOrder: index + 1,
    updatedAt: new Date().toISOString(),
  }))
}

/**
 * Move a block up one position.
 * Returns original array if block is first or not found.
 */
export function moveBlockUp(blocks: CmsBlock[], blockId: string): CmsBlock[] {
  const index = blocks.findIndex((block) => block.id === blockId)

  // Can't move up if first or not found
  if (index <= 0) {
    return blocks
  }

  // Swap with previous
  const next = [...blocks]
  const temp = next[index - 1]
  next[index - 1] = next[index]
  next[index] = temp

  // Normalize sortOrder
  return normalizeBlockOrder(next)
}

/**
 * Move a block down one position.
 * Returns original array if block is last or not found.
 */
export function moveBlockDown(blocks: CmsBlock[], blockId: string): CmsBlock[] {
  const index = blocks.findIndex((block) => block.id === blockId)

  // Can't move down if last or not found
  if (index === -1 || index >= blocks.length - 1) {
    return blocks
  }

  // Swap with next
  const next = [...blocks]
  const temp = next[index + 1]
  next[index + 1] = next[index]
  next[index] = temp

  // Normalize sortOrder
  return normalizeBlockOrder(next)
}

/**
 * Delete a block and normalize remaining blocks' sortOrder.
 * Returns array with block removed and sortOrder recalculated.
 */
export function deleteBlock(blocks: CmsBlock[], blockId: string): CmsBlock[] {
  const next = blocks.filter((block) => block.id !== blockId)
  return normalizeBlockOrder(next)
}

