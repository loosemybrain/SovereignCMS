/**
 * Static block capability contracts (Phase 79).
 * High-level semantics only — not a schema engine or plugin registry.
 *
 * Media field paths remain in `block-media-contracts.ts`.
 * Blocks with BLOCK_MEDIA_CONTRACTS must declare `media` or `external-media` here.
 */

export type BlockCapability =
  | "media"
  | "external-media"
  | "form"
  | "interactive"
  | "navigation"
  | "theme-aware"
  | "accessibility-sensitive"
  | "governance-sensitive"
  | "preview-sensitive"

export type BlockCapabilityContract = {
  blockType: string
  capabilities: BlockCapability[]
  description?: string
}

export const BLOCK_CAPABILITY_CONTRACTS: Record<string, BlockCapabilityContract> = {
  hero: {
    blockType: "hero",
    capabilities: [
      "media",
      "theme-aware",
      "accessibility-sensitive",
      "governance-sensitive",
      "preview-sensitive",
    ],
    description: "Hero section with optional background media",
  },
  text: {
    blockType: "text",
    capabilities: ["accessibility-sensitive", "governance-sensitive", "theme-aware"],
    description: "Body copy block",
  },
  cta: {
    blockType: "cta",
    capabilities: [
      "interactive",
      "accessibility-sensitive",
      "governance-sensitive",
      "theme-aware",
    ],
    description: "Call-to-action with links",
  },
  "feature-grid": {
    blockType: "feature-grid",
    capabilities: ["accessibility-sensitive", "governance-sensitive", "theme-aware"],
    description: "Feature grid with items",
  },
  "image-text": {
    blockType: "image-text",
    capabilities: [
      "media",
      "accessibility-sensitive",
      "governance-sensitive",
      "theme-aware",
      "preview-sensitive",
    ],
    description: "Image and text section",
  },
  "contact-form": {
    blockType: "contact-form",
    capabilities: [
      "form",
      "interactive",
      "accessibility-sensitive",
      "governance-sensitive",
      "preview-sensitive",
    ],
    description: "Contact form block",
  },
  "external-embed": {
    blockType: "external-embed",
    capabilities: [
      "external-media",
      "interactive",
      "accessibility-sensitive",
      "governance-sensitive",
      "preview-sensitive",
    ],
    description: "Third-party embed with consent flow",
  },
}

export function getBlockCapabilityContract(
  blockType: string,
): BlockCapabilityContract | undefined {
  return BLOCK_CAPABILITY_CONTRACTS[blockType]
}

export function getBlockCapabilities(blockType: string): BlockCapability[] {
  return getBlockCapabilityContract(blockType)?.capabilities ?? []
}

export function hasBlockCapability(
  blockType: string,
  capability: BlockCapability,
): boolean {
  return getBlockCapabilities(blockType).includes(capability)
}

export function isMediaCapableBlock(blockType: string): boolean {
  return (
    hasBlockCapability(blockType, "media") ||
    hasBlockCapability(blockType, "external-media")
  )
}

export function isGovernanceSensitiveBlock(blockType: string): boolean {
  return hasBlockCapability(blockType, "governance-sensitive")
}

export function isPreviewSensitiveBlock(blockType: string): boolean {
  return hasBlockCapability(blockType, "preview-sensitive")
}
