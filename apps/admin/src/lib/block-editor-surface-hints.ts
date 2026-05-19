/**
 * Editorial hints derived from block editor surface contracts (Phase 80).
 * UX guidance only — not security, enforcement, or persistence.
 */

import { hasBlockEditorSurface, type BlockEditorSurface } from "@sovereign-cms/core"
import type { BlockCapabilityHintKey } from "@/lib/block-capability-hints"

export type BlockEditorSurfaceHintKey =
  | "externalMedia"
  | "form"
  | "media"
  | "accessibility"
  | "governance"
  | "preview"

const SURFACE_HINT_PRIORITY = [
  "external-media",
  "form",
  "media",
  "accessibility",
  "governance",
  "preview",
] as const satisfies readonly BlockEditorSurface[]

function surfaceToHintKey(
  surface: (typeof SURFACE_HINT_PRIORITY)[number],
): BlockEditorSurfaceHintKey {
  switch (surface) {
    case "external-media":
      return "externalMedia"
    case "form":
      return "form"
    case "media":
      return "media"
    case "accessibility":
      return "accessibility"
    case "governance":
      return "governance"
    case "preview":
      return "preview"
  }
}

/** Maps capability hint keys to overlapping editor surface hint keys. */
export function capabilityHintToEditorSurfaceKey(
  key: BlockCapabilityHintKey,
): BlockEditorSurfaceHintKey {
  switch (key) {
    case "externalMedia":
      return "externalMedia"
    case "form":
      return "form"
    case "previewSensitive":
      return "preview"
  }
}

/**
 * One editorial hint from editor surfaces; skips keys already covered by a capability hint.
 */
export function getEditorSurfaceHintKey(
  blockType: string,
  options?: { excludeKeys?: BlockEditorSurfaceHintKey[] },
): BlockEditorSurfaceHintKey | null {
  const excluded = new Set(options?.excludeKeys ?? [])

  for (const surface of SURFACE_HINT_PRIORITY) {
    const hintKey = surfaceToHintKey(surface)
    if (excluded.has(hintKey)) {
      continue
    }
    if (hasBlockEditorSurface(blockType, surface)) {
      return hintKey
    }
  }

  return null
}
