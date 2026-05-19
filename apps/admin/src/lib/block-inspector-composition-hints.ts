/**
 * Editorial hints from inspector composition contracts (Phase 86).
 * UX guidance only — not security, enforcement, persistence, or automatic inspector UI.
 */

import {
  getBlockInspectorGroups,
  hasBlockInspectorGroup,
  type BlockInspectorGroup,
} from "@sovereign-cms/core"
import type { BlockCapabilityHintKey } from "@/lib/block-capability-hints"
import type { BlockEditorSurfaceHintKey } from "@/lib/block-editor-surface-hints"
import type { BlockGovernanceHintKey } from "@/lib/block-governance-hints"
import type { BlockPreviewIsolationHintKey } from "@/lib/block-preview-isolation-hints"
import type { BlockRuntimeValidationHintKey } from "@/lib/block-runtime-validation-hints"

export type BlockInspectorCompositionHintKey = BlockInspectorGroup

const INSPECTOR_GROUP_HINT_PRIORITY: BlockInspectorGroup[] = [
  "governance",
  "preview",
  "media",
  "form",
  "navigation",
  "accessibility",
  "actions",
  "layout",
  "design",
  "content",
]

export function capabilityHintToInspectorCompositionKey(
  key: BlockCapabilityHintKey,
): BlockInspectorCompositionHintKey | null {
  switch (key) {
    case "externalMedia":
      return "media"
    case "form":
      return "form"
    case "previewSensitive":
      return "preview"
  }
}

export function editorSurfaceHintToInspectorCompositionKey(
  key: BlockEditorSurfaceHintKey,
): BlockInspectorCompositionHintKey | null {
  switch (key) {
    case "externalMedia":
    case "media":
      return "media"
    case "form":
      return "form"
    case "accessibility":
      return "accessibility"
    case "governance":
      return "governance"
    case "preview":
      return "preview"
  }
}

export function governanceHintToInspectorCompositionKey(
  key: BlockGovernanceHintKey,
): BlockInspectorCompositionHintKey | null {
  switch (key) {
    case "externalMedia":
    case "mediaAltText":
      return "media"
    case "forms":
    case "consent":
      return "form"
    case "navigation":
    case "links":
      return "navigation"
    case "accessibility":
      return "accessibility"
    case "previewSafety":
      return "preview"
    case "legalReview":
    case "editorialQuality":
      return "governance"
    default:
      return null
  }
}

export function previewIsolationHintToInspectorCompositionKey(
  key: BlockPreviewIsolationHintKey,
): BlockInspectorCompositionHintKey | null {
  switch (key) {
    case "externalPlaceholder":
    case "mediaSafe":
      return "media"
    case "formDisabled":
      return "form"
    case "navigationSafe":
      return "navigation"
    case "contentOnly":
      return "preview"
  }
}

export function runtimeValidationHintToInspectorCompositionKey(
  key: BlockRuntimeValidationHintKey,
): BlockInspectorCompositionHintKey | null {
  switch (key) {
    case "missingMediaAltText":
    case "externalMediaRequiresConsent":
      return "media"
    case "formRequiresPrivacyReview":
      return "form"
    case "navigationTargetReview":
      return "navigation"
    case "previewIsolationRequired":
      return "preview"
    case "governanceReviewRequired":
      return "governance"
    case "unknownBlockType":
      return null
  }
}

export function buildInspectorCompositionHintExclusions(input: {
  capabilityHintKey?: BlockCapabilityHintKey | null
  editorSurfaceHintKey?: BlockEditorSurfaceHintKey | null
  governanceHintKey?: BlockGovernanceHintKey | null
  previewIsolationHintKey?: BlockPreviewIsolationHintKey | null
  runtimeValidationHintKey?: BlockRuntimeValidationHintKey | null
}): BlockInspectorCompositionHintKey[] {
  const excluded: BlockInspectorCompositionHintKey[] = []

  const candidates = [
    input.capabilityHintKey
      ? capabilityHintToInspectorCompositionKey(input.capabilityHintKey)
      : null,
    input.editorSurfaceHintKey
      ? editorSurfaceHintToInspectorCompositionKey(input.editorSurfaceHintKey)
      : null,
    input.governanceHintKey
      ? governanceHintToInspectorCompositionKey(input.governanceHintKey)
      : null,
    input.previewIsolationHintKey
      ? previewIsolationHintToInspectorCompositionKey(input.previewIsolationHintKey)
      : null,
    input.runtimeValidationHintKey
      ? runtimeValidationHintToInspectorCompositionKey(input.runtimeValidationHintKey)
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
 * One inspector-composition hint from static group contracts; skips keys already covered upstream.
 */
export function getBlockInspectorCompositionHintKey(
  blockType: string,
  options?: { excludeKeys?: BlockInspectorCompositionHintKey[] },
): BlockInspectorCompositionHintKey | null {
  const excluded = new Set(options?.excludeKeys ?? [])
  const groups = new Set(getBlockInspectorGroups(blockType))

  if (groups.size === 0) {
    return null
  }

  for (const group of INSPECTOR_GROUP_HINT_PRIORITY) {
    if (excluded.has(group)) {
      continue
    }
    if (hasBlockInspectorGroup(blockType, group)) {
      return group
    }
  }

  return null
}
