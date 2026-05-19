/**
 * Editorial capability hints for admin UI (Phase 79). Non-authoritative — guidance only.
 */

import { hasBlockCapability } from "@sovereign-cms/core"

export type BlockCapabilityHintKey = "externalMedia" | "form" | "previewSensitive"

/** One quiet hint per block; highest-priority semantics first. */
export function getBlockCapabilityHintKey(blockType: string): BlockCapabilityHintKey | null {
  if (hasBlockCapability(blockType, "external-media")) {
    return "externalMedia"
  }
  if (hasBlockCapability(blockType, "form")) {
    return "form"
  }
  if (hasBlockCapability(blockType, "preview-sensitive")) {
    return "previewSensitive"
  }
  return null
}
