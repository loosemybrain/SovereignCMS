/**
 * Editorial hints from preview-isolation contracts (Phase 82).
 * UX guidance only — not security, enforcement, sandboxing, or persistence.
 */

import {
  getBlockPreviewIsolationMode,
  type BlockPreviewIsolationMode,
} from "@sovereign-cms/core"
import type { BlockCapabilityHintKey } from "@/lib/block-capability-hints"
import type { BlockGovernanceHintKey } from "@/lib/block-governance-hints"
import type { BlockEditorSurfaceHintKey } from "@/lib/block-editor-surface-hints"

export type BlockPreviewIsolationHintKey =
  | "externalPlaceholder"
  | "formDisabled"
  | "mediaSafe"
  | "navigationSafe"
  | "contentOnly"

function modeToHintKey(mode: BlockPreviewIsolationMode): BlockPreviewIsolationHintKey | null {
  switch (mode) {
    case "none":
      return null
    case "content-only":
      return "contentOnly"
    case "media-safe":
      return "mediaSafe"
    case "external-placeholder":
      return "externalPlaceholder"
    case "form-disabled":
      return "formDisabled"
    case "navigation-safe":
      return "navigationSafe"
  }
}

export function previewIsolationModeToHintKey(
  mode: BlockPreviewIsolationMode,
): BlockPreviewIsolationHintKey | null {
  return modeToHintKey(mode)
}

/** Overlapping hints already shown via capability / editor / governance layers. */
export function capabilityHintToPreviewIsolationKey(
  key: BlockCapabilityHintKey,
): BlockPreviewIsolationHintKey | null {
  switch (key) {
    case "externalMedia":
      return "externalPlaceholder"
    case "form":
      return "formDisabled"
    case "previewSensitive":
      return null
  }
}

export function editorSurfaceHintToPreviewIsolationKey(
  key: BlockEditorSurfaceHintKey,
): BlockPreviewIsolationHintKey | null {
  switch (key) {
    case "externalMedia":
      return "externalPlaceholder"
    case "form":
      return "formDisabled"
    case "media":
      return "mediaSafe"
    case "preview":
      return null
    default:
      return null
  }
}

export function governanceHintToPreviewIsolationKey(
  key: BlockGovernanceHintKey,
): BlockPreviewIsolationHintKey | null {
  switch (key) {
    case "externalMedia":
      return "externalPlaceholder"
    case "forms":
      return "formDisabled"
    case "previewSafety":
      return null
    case "navigation":
      return "navigationSafe"
    default:
      return null
  }
}

export function buildPreviewIsolationHintExclusions(input: {
  capabilityHintKey?: BlockCapabilityHintKey | null
  editorSurfaceHintKey?: BlockEditorSurfaceHintKey | null
  governanceHintKey?: BlockGovernanceHintKey | null
}): BlockPreviewIsolationHintKey[] {
  const excluded: BlockPreviewIsolationHintKey[] = []

  const candidates = [
    input.capabilityHintKey
      ? capabilityHintToPreviewIsolationKey(input.capabilityHintKey)
      : null,
    input.editorSurfaceHintKey
      ? editorSurfaceHintToPreviewIsolationKey(input.editorSurfaceHintKey)
      : null,
    input.governanceHintKey
      ? governanceHintToPreviewIsolationKey(input.governanceHintKey)
      : null,
  ]

  for (const key of candidates) {
    if (key && !excluded.includes(key)) {
      excluded.push(key)
    }
  }

  return excluded
}

/**
 * One preview-isolation hint from static contracts; skips keys already covered upstream.
 */
export function getBlockPreviewIsolationHintKey(
  blockType: string,
  options?: { excludeKeys?: BlockPreviewIsolationHintKey[] },
): BlockPreviewIsolationHintKey | null {
  const excluded = new Set(options?.excludeKeys ?? [])
  const hintKey = modeToHintKey(getBlockPreviewIsolationMode(blockType))

  if (hintKey == null || excluded.has(hintKey)) {
    return null
  }

  return hintKey
}
