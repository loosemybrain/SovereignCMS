/**
 * Static block-type runtime validation (Phase 83).
 * Evaluates existing governance, preview-isolation, and capability contracts only.
 *
 * Not a schema engine, props validator, rule engine, or publish gate.
 */

import { getBlockCapabilityContract } from "./block-capabilities"
import {
  hasBlockGovernanceConcern,
  isGovernanceCriticalBlock,
} from "./block-governance-contracts"
import {
  getBlockPreviewIsolationMode,
  isPreviewIsolatedBlock,
} from "./block-preview-isolation-contracts"

export type BlockRuntimeValidationSeverity = "info" | "warning" | "error"

export type BlockRuntimeValidationCode =
  | "missing-media-alt-text"
  | "external-media-requires-consent"
  | "form-requires-privacy-review"
  | "navigation-target-review"
  | "preview-isolation-required"
  | "governance-review-required"
  | "unknown-block-type"

export type BlockRuntimeValidationIssue = {
  blockType: string
  code: BlockRuntimeValidationCode
  severity: BlockRuntimeValidationSeverity
  message: string
}

export type BlockRuntimeValidationResult = {
  blockType: string
  issues: BlockRuntimeValidationIssue[]
}

const UNKNOWN_BLOCK_MESSAGE =
  "Für diesen Blocktyp existieren keine bekannten Runtime-Verträge."

export function createBlockRuntimeValidationIssue(input: {
  blockType: string
  code: BlockRuntimeValidationCode
  severity: BlockRuntimeValidationSeverity
  message: string
}): BlockRuntimeValidationIssue {
  return {
    blockType: input.blockType,
    code: input.code,
    severity: input.severity,
    message: input.message,
  }
}

function isKnownBlockType(blockType: string): boolean {
  return getBlockCapabilityContract(blockType) != null
}

/**
 * Block-type-only semantic hints from static contracts. No props, schemas, or reflection.
 */
export function validateBlockRuntimeSemantics(blockType: string): BlockRuntimeValidationResult {
  if (!isKnownBlockType(blockType)) {
    return {
      blockType,
      issues: [
        createBlockRuntimeValidationIssue({
          blockType,
          code: "unknown-block-type",
          severity: "warning",
          message: UNKNOWN_BLOCK_MESSAGE,
        }),
      ],
    }
  }

  const issues: BlockRuntimeValidationIssue[] = []
  const isolationMode = getBlockPreviewIsolationMode(blockType)

  if (hasBlockGovernanceConcern(blockType, "media-alt-text")) {
    issues.push(
      createBlockRuntimeValidationIssue({
        blockType,
        code: "missing-media-alt-text",
        severity: "warning",
        message:
          "This block type is governed for media alt text — verify alt copy before publish.",
      }),
    )
  }

  if (hasBlockGovernanceConcern(blockType, "external-media")) {
    issues.push(
      createBlockRuntimeValidationIssue({
        blockType,
        code: "external-media-requires-consent",
        severity: isGovernanceCriticalBlock(blockType) ? "error" : "warning",
        message:
          "External media requires consent review; do not load unchecked before user consent.",
      }),
    )
  }

  if (hasBlockGovernanceConcern(blockType, "forms")) {
    issues.push(
      createBlockRuntimeValidationIssue({
        blockType,
        code: "form-requires-privacy-review",
        severity: isGovernanceCriticalBlock(blockType) ? "error" : "warning",
        message:
          "Forms require privacy, recipient, and purpose review per governance contracts.",
      }),
    )
  }

  if (
    hasBlockGovernanceConcern(blockType, "navigation") ||
    isolationMode === "navigation-safe"
  ) {
    issues.push(
      createBlockRuntimeValidationIssue({
        blockType,
        code: "navigation-target-review",
        severity: "warning",
        message: "Navigation targets and link labels should be reviewed for this block type.",
      }),
    )
  }

  if (isPreviewIsolatedBlock(blockType)) {
    const isolationSeverity: BlockRuntimeValidationSeverity =
      isolationMode === "form-disabled" || isolationMode === "external-placeholder"
        ? "warning"
        : "info"
    issues.push(
      createBlockRuntimeValidationIssue({
        blockType,
        code: "preview-isolation-required",
        severity: isolationSeverity,
        message:
          "Preview isolation applies to this block type — preview behavior differs from public runtime.",
      }),
    )
  }

  if (isGovernanceCriticalBlock(blockType)) {
    issues.push(
      createBlockRuntimeValidationIssue({
        blockType,
        code: "governance-review-required",
        severity: "warning",
        message:
          "Governance contracts mark this block type as critical — complete editorial review before publish.",
      }),
    )
  }

  return { blockType, issues }
}

export function hasRuntimeValidationErrors(result: BlockRuntimeValidationResult): boolean {
  return result.issues.some((issue) => issue.severity === "error")
}

export function hasRuntimeValidationWarnings(result: BlockRuntimeValidationResult): boolean {
  return result.issues.some((issue) => issue.severity === "warning")
}
