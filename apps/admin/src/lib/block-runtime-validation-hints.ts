/**
 * Editorial hints from block runtime validation (Phase 83).
 * UX guidance only — not security, enforcement, persistence, or publish blocking.
 */

import {
  validateBlockRuntimeSemantics,
  type BlockRuntimeValidationCode,
  type BlockRuntimeValidationIssue,
  type BlockRuntimeValidationResult,
  type BlockRuntimeValidationSeverity,
} from "@sovereign-cms/core"
import type { BlockCapabilityHintKey } from "@/lib/block-capability-hints"
import type { BlockGovernanceHintKey } from "@/lib/block-governance-hints"
import type { BlockPreviewIsolationHintKey } from "@/lib/block-preview-isolation-hints"
import type { BlockEditorSurfaceHintKey } from "@/lib/block-editor-surface-hints"

export type BlockRuntimeValidationHintKey =
  | "missingMediaAltText"
  | "externalMediaRequiresConsent"
  | "formRequiresPrivacyReview"
  | "navigationTargetReview"
  | "previewIsolationRequired"
  | "governanceReviewRequired"
  | "unknownBlockType"

const CODE_HINT_PRIORITY: BlockRuntimeValidationCode[] = [
  "unknown-block-type",
  "governance-review-required",
  "external-media-requires-consent",
  "form-requires-privacy-review",
  "missing-media-alt-text",
  "preview-isolation-required",
  "navigation-target-review",
]

const SEVERITY_RANK: Record<BlockRuntimeValidationSeverity, number> = {
  error: 3,
  warning: 2,
  info: 1,
}

function codeToHintKey(code: BlockRuntimeValidationCode): BlockRuntimeValidationHintKey {
  switch (code) {
    case "missing-media-alt-text":
      return "missingMediaAltText"
    case "external-media-requires-consent":
      return "externalMediaRequiresConsent"
    case "form-requires-privacy-review":
      return "formRequiresPrivacyReview"
    case "navigation-target-review":
      return "navigationTargetReview"
    case "preview-isolation-required":
      return "previewIsolationRequired"
    case "governance-review-required":
      return "governanceReviewRequired"
    case "unknown-block-type":
      return "unknownBlockType"
  }
}

function pickPrimaryIssue(
  issues: BlockRuntimeValidationIssue[],
): BlockRuntimeValidationIssue | null {
  if (issues.length === 0) {
    return null
  }

  const byCode = new Map(issues.map((issue) => [issue.code, issue]))

  for (const code of CODE_HINT_PRIORITY) {
    const issue = byCode.get(code)
    if (issue) {
      return issue
    }
  }

  return [...issues].sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity])[0] ?? null
}

export function validationCodeToHintKey(
  code: BlockRuntimeValidationCode,
): BlockRuntimeValidationHintKey {
  return codeToHintKey(code)
}

export function capabilityHintToRuntimeValidationKey(
  key: BlockCapabilityHintKey,
): BlockRuntimeValidationHintKey | null {
  switch (key) {
    case "externalMedia":
      return "externalMediaRequiresConsent"
    case "form":
      return "formRequiresPrivacyReview"
    case "previewSensitive":
      return "previewIsolationRequired"
  }
}

export function governanceHintToRuntimeValidationKey(
  key: BlockGovernanceHintKey,
): BlockRuntimeValidationHintKey | null {
  switch (key) {
    case "externalMedia":
      return "externalMediaRequiresConsent"
    case "forms":
      return "formRequiresPrivacyReview"
    case "mediaAltText":
      return "missingMediaAltText"
    case "navigation":
      return "navigationTargetReview"
    case "previewSafety":
      return "previewIsolationRequired"
    case "legalReview":
      return "governanceReviewRequired"
    default:
      return null
  }
}

export function previewIsolationHintToRuntimeValidationKey(
  key: BlockPreviewIsolationHintKey,
): BlockRuntimeValidationHintKey | null {
  switch (key) {
    case "externalPlaceholder":
      return "externalMediaRequiresConsent"
    case "formDisabled":
      return "formRequiresPrivacyReview"
    case "mediaSafe":
    case "navigationSafe":
    case "contentOnly":
      return "previewIsolationRequired"
  }
}

export function editorSurfaceHintToRuntimeValidationKey(
  key: BlockEditorSurfaceHintKey,
): BlockRuntimeValidationHintKey | null {
  switch (key) {
    case "externalMedia":
      return "externalMediaRequiresConsent"
    case "form":
      return "formRequiresPrivacyReview"
    case "media":
      return "missingMediaAltText"
    case "preview":
      return "previewIsolationRequired"
    case "governance":
      return "governanceReviewRequired"
    default:
      return null
  }
}

export function buildRuntimeValidationHintExclusions(input: {
  capabilityHintKey?: BlockCapabilityHintKey | null
  editorSurfaceHintKey?: BlockEditorSurfaceHintKey | null
  governanceHintKey?: BlockGovernanceHintKey | null
  previewIsolationHintKey?: BlockPreviewIsolationHintKey | null
}): BlockRuntimeValidationHintKey[] {
  const excluded: BlockRuntimeValidationHintKey[] = []

  const candidates = [
    input.capabilityHintKey
      ? capabilityHintToRuntimeValidationKey(input.capabilityHintKey)
      : null,
    input.editorSurfaceHintKey
      ? editorSurfaceHintToRuntimeValidationKey(input.editorSurfaceHintKey)
      : null,
    input.governanceHintKey
      ? governanceHintToRuntimeValidationKey(input.governanceHintKey)
      : null,
    input.previewIsolationHintKey
      ? previewIsolationHintToRuntimeValidationKey(input.previewIsolationHintKey)
      : null,
  ]

  for (const key of candidates) {
    if (key && !excluded.includes(key)) {
      excluded.push(key)
    }
  }

  return excluded
}

export function getBlockRuntimeValidationResult(blockType: string): BlockRuntimeValidationResult {
  return validateBlockRuntimeSemantics(blockType)
}

/**
 * One runtime-validation hint for admin UI; skips keys already covered by other hint layers.
 */
export function getBlockRuntimeValidationHintKey(
  blockType: string,
  options?: { excludeKeys?: BlockRuntimeValidationHintKey[] },
): BlockRuntimeValidationHintKey | null {
  const excluded = new Set(options?.excludeKeys ?? [])
  const primary = pickPrimaryIssue(validateBlockRuntimeSemantics(blockType).issues)

  if (primary == null) {
    return null
  }

  const hintKey = codeToHintKey(primary.code)
  if (excluded.has(hintKey)) {
    return null
  }

  return hintKey
}
