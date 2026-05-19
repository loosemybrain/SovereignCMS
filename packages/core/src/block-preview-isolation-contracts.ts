/**
 * Static preview-isolation contracts (Phase 82).
 * Declares how block types should be treated in admin / editor preview — not a sandbox or preview engine.
 *
 * Separate from BLOCK_CAPABILITY_CONTRACTS, BLOCK_MEDIA_CONTRACTS,
 * BLOCK_EDITOR_CONTRACTS, and BLOCK_GOVERNANCE_CONTRACTS.
 */

export type BlockPreviewIsolationMode =
  | "none"
  | "content-only"
  | "media-safe"
  | "external-placeholder"
  | "form-disabled"
  | "navigation-safe"

export type BlockPreviewIsolationReason =
  | "external-media"
  | "consent-required"
  | "form-submission"
  | "tenant-boundary"
  | "media-resolution"
  | "navigation-targets"
  | "governance-review"

export type BlockPreviewIsolationContract = {
  blockType: string
  mode: BlockPreviewIsolationMode
  reasons: BlockPreviewIsolationReason[]
  description?: string
}

export const BLOCK_PREVIEW_ISOLATION_CONTRACTS: Record<string, BlockPreviewIsolationContract> = {
  hero: {
    blockType: "hero",
    mode: "media-safe",
    reasons: ["media-resolution", "governance-review"],
    description: "Hero media resolved via runtime composition in preview",
  },
  text: {
    blockType: "text",
    mode: "none",
    reasons: [],
    description: "Plain text — no preview isolation",
  },
  cta: {
    blockType: "cta",
    mode: "navigation-safe",
    reasons: ["navigation-targets", "governance-review"],
    description: "CTA links should be reviewed in preview",
  },
  "feature-grid": {
    blockType: "feature-grid",
    mode: "none",
    reasons: [],
    description: "Feature grid — no preview isolation",
  },
  "image-text": {
    blockType: "image-text",
    mode: "media-safe",
    reasons: ["media-resolution", "navigation-targets", "governance-review"],
    description: "Image media and optional CTA in preview",
  },
  "contact-form": {
    blockType: "contact-form",
    mode: "form-disabled",
    reasons: [
      "form-submission",
      "consent-required",
      "tenant-boundary",
      "governance-review",
    ],
    description: "Forms disabled in preview — no real submissions",
  },
  "external-embed": {
    blockType: "external-embed",
    mode: "external-placeholder",
    reasons: [
      "external-media",
      "consent-required",
      "tenant-boundary",
      "governance-review",
    ],
    description: "External embeds as placeholders in preview",
  },
}

export function getBlockPreviewIsolationContract(
  blockType: string,
): BlockPreviewIsolationContract | undefined {
  return BLOCK_PREVIEW_ISOLATION_CONTRACTS[blockType]
}

export function getBlockPreviewIsolationMode(blockType: string): BlockPreviewIsolationMode {
  return getBlockPreviewIsolationContract(blockType)?.mode ?? "none"
}

export function getBlockPreviewIsolationReasons(
  blockType: string,
): BlockPreviewIsolationReason[] {
  return getBlockPreviewIsolationContract(blockType)?.reasons ?? []
}

export function hasBlockPreviewIsolationReason(
  blockType: string,
  reason: BlockPreviewIsolationReason,
): boolean {
  return getBlockPreviewIsolationReasons(blockType).includes(reason)
}

export function isPreviewIsolatedBlock(blockType: string): boolean {
  return getBlockPreviewIsolationMode(blockType) !== "none"
}

export function requiresExternalPreviewPlaceholder(blockType: string): boolean {
  return getBlockPreviewIsolationMode(blockType) === "external-placeholder"
}

export function requiresFormPreviewDisabled(blockType: string): boolean {
  return getBlockPreviewIsolationMode(blockType) === "form-disabled"
}
