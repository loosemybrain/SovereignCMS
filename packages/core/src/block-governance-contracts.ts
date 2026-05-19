/**
 * Static runtime governance contracts (Phase 81).
 * Declares editorial risk areas per block type — not a rule engine or validator.
 *
 * Separate from BLOCK_CAPABILITY_CONTRACTS, BLOCK_MEDIA_CONTRACTS,
 * and BLOCK_EDITOR_CONTRACTS.
 */

export type BlockGovernanceConcern =
  | "accessibility"
  | "external-media"
  | "consent"
  | "forms"
  | "navigation"
  | "links"
  | "preview-safety"
  | "editorial-quality"
  | "media-alt-text"
  | "legal-review"

export type BlockGovernanceSeverity = "info" | "warning" | "critical"

export type BlockGovernanceContract = {
  blockType: string
  concerns: BlockGovernanceConcern[]
  severity: BlockGovernanceSeverity
  description?: string
}

export const BLOCK_GOVERNANCE_CONTRACTS: Record<string, BlockGovernanceContract> = {
  hero: {
    blockType: "hero",
    concerns: [
      "accessibility",
      "media-alt-text",
      "editorial-quality",
      "preview-safety",
    ],
    severity: "warning",
    description: "Hero media and headline governance",
  },
  text: {
    blockType: "text",
    concerns: ["accessibility", "editorial-quality"],
    severity: "info",
    description: "Body copy readability",
  },
  cta: {
    blockType: "cta",
    concerns: ["accessibility", "links", "editorial-quality"],
    severity: "warning",
    description: "CTA links and labels",
  },
  "feature-grid": {
    blockType: "feature-grid",
    concerns: ["accessibility", "editorial-quality"],
    severity: "info",
    description: "Feature grid items",
  },
  "image-text": {
    blockType: "image-text",
    concerns: [
      "accessibility",
      "media-alt-text",
      "links",
      "editorial-quality",
      "preview-safety",
    ],
    severity: "warning",
    description: "Image, alt text, and optional CTA",
  },
  "contact-form": {
    blockType: "contact-form",
    concerns: [
      "accessibility",
      "forms",
      "consent",
      "legal-review",
      "preview-safety",
    ],
    severity: "critical",
    description: "Form, privacy, and consent",
  },
  "external-embed": {
    blockType: "external-embed",
    concerns: [
      "accessibility",
      "external-media",
      "consent",
      "preview-safety",
      "legal-review",
    ],
    severity: "critical",
    description: "Third-party embed and consent",
  },
}

export function getBlockGovernanceContract(
  blockType: string,
): BlockGovernanceContract | undefined {
  return BLOCK_GOVERNANCE_CONTRACTS[blockType]
}

export function getBlockGovernanceConcerns(blockType: string): BlockGovernanceConcern[] {
  return getBlockGovernanceContract(blockType)?.concerns ?? []
}

export function hasBlockGovernanceConcern(
  blockType: string,
  concern: BlockGovernanceConcern,
): boolean {
  return getBlockGovernanceConcerns(blockType).includes(concern)
}

export function isGovernanceCriticalBlock(blockType: string): boolean {
  return getBlockGovernanceContract(blockType)?.severity === "critical"
}

export function isGovernanceRelevantBlock(blockType: string): boolean {
  return getBlockGovernanceConcerns(blockType).length > 0
}
