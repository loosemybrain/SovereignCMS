/**
 * Editorial hints from governance contracts (Phase 81).
 * UX guidance only — not security, enforcement, publish blocking, or persistence.
 */

import {
  hasBlockGovernanceConcern,
  type BlockGovernanceConcern,
} from "@sovereign-cms/core"
import type { BlockCapabilityHintKey } from "@/lib/block-capability-hints"
import type { BlockEditorSurfaceHintKey } from "@/lib/block-editor-surface-hints"

export type BlockGovernanceHintKey =
  | "externalMedia"
  | "forms"
  | "consent"
  | "legalReview"
  | "mediaAltText"
  | "previewSafety"
  | "accessibility"
  | "links"
  | "editorialQuality"
  | "navigation"

const CONCERN_HINT_PRIORITY = [
  "external-media",
  "forms",
  "consent",
  "legal-review",
  "media-alt-text",
  "preview-safety",
  "accessibility",
  "links",
  "editorial-quality",
  "navigation",
] as const satisfies readonly BlockGovernanceConcern[]

function concernToHintKey(
  concern: (typeof CONCERN_HINT_PRIORITY)[number],
): BlockGovernanceHintKey {
  switch (concern) {
    case "external-media":
      return "externalMedia"
    case "forms":
      return "forms"
    case "consent":
      return "consent"
    case "legal-review":
      return "legalReview"
    case "media-alt-text":
      return "mediaAltText"
    case "preview-safety":
      return "previewSafety"
    case "accessibility":
      return "accessibility"
    case "links":
      return "links"
    case "editorial-quality":
      return "editorialQuality"
    case "navigation":
      return "navigation"
  }
}

export function capabilityHintToGovernanceKey(
  key: BlockCapabilityHintKey,
): BlockGovernanceHintKey | null {
  switch (key) {
    case "externalMedia":
      return "externalMedia"
    case "form":
      return "forms"
    case "previewSensitive":
      return "previewSafety"
  }
}

export function editorSurfaceHintToGovernanceKey(
  key: BlockEditorSurfaceHintKey,
): BlockGovernanceHintKey | null {
  switch (key) {
    case "externalMedia":
      return "externalMedia"
    case "form":
      return "forms"
    case "media":
      return "mediaAltText"
    case "preview":
      return "previewSafety"
    case "accessibility":
      return "accessibility"
    default:
      return null
  }
}

export function buildGovernanceHintExclusions(input: {
  capabilityHintKey?: BlockCapabilityHintKey | null
  editorSurfaceHintKey?: BlockEditorSurfaceHintKey | null
}): BlockGovernanceHintKey[] {
  const excluded: BlockGovernanceHintKey[] = []

  if (input.capabilityHintKey) {
    const mapped = capabilityHintToGovernanceKey(input.capabilityHintKey)
    if (mapped) {
      excluded.push(mapped)
    }
  }

  if (input.editorSurfaceHintKey) {
    const mapped = editorSurfaceHintToGovernanceKey(input.editorSurfaceHintKey)
    if (mapped && !excluded.includes(mapped)) {
      excluded.push(mapped)
    }
  }

  return excluded
}

/**
 * One governance-contract hint; skips concerns already covered by capability/editor hints.
 */
export function getGovernanceContractHintKey(
  blockType: string,
  options?: { excludeKeys?: BlockGovernanceHintKey[] },
): BlockGovernanceHintKey | null {
  const excluded = new Set(options?.excludeKeys ?? [])

  for (const concern of CONCERN_HINT_PRIORITY) {
    const hintKey = concernToHintKey(concern)
    if (excluded.has(hintKey)) {
      continue
    }
    if (hasBlockGovernanceConcern(blockType, concern)) {
      return hintKey
    }
  }

  return null
}
