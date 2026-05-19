/**
 * Static editor-runtime alignment contracts (Phase 80).
 * Declares which editor surfaces a block type may meaningfully use — not field schemas.
 *
 * Separate from BLOCK_CAPABILITY_CONTRACTS (runtime semantics) and
 * BLOCK_MEDIA_CONTRACTS (media prop paths).
 */

export type BlockEditorSurface =
  | "content"
  | "design"
  | "media"
  | "actions"
  | "layout"
  | "form"
  | "navigation"
  | "external-media"
  | "accessibility"
  | "governance"
  | "preview"

export type BlockEditorContract = {
  blockType: string
  surfaces: BlockEditorSurface[]
  description?: string
}

export const BLOCK_EDITOR_CONTRACTS: Record<string, BlockEditorContract> = {
  hero: {
    blockType: "hero",
    surfaces: ["content", "design", "media", "accessibility", "governance", "preview"],
    description: "Hero headline, media, and preview-sensitive layout",
  },
  text: {
    blockType: "text",
    surfaces: ["content", "design", "accessibility", "governance"],
    description: "Body copy block",
  },
  cta: {
    blockType: "cta",
    surfaces: ["content", "design", "actions", "accessibility", "governance"],
    description: "Call-to-action with links",
  },
  "feature-grid": {
    blockType: "feature-grid",
    surfaces: ["content", "design", "layout", "accessibility", "governance"],
    description: "Feature grid with items",
  },
  "image-text": {
    blockType: "image-text",
    surfaces: [
      "content",
      "design",
      "media",
      "actions",
      "layout",
      "accessibility",
      "governance",
      "preview",
    ],
    description: "Image, text, optional CTA",
  },
  "contact-form": {
    blockType: "contact-form",
    surfaces: ["content", "form", "actions", "accessibility", "governance", "preview"],
    description: "Contact form fields and consent",
  },
  "external-embed": {
    blockType: "external-embed",
    surfaces: ["content", "external-media", "accessibility", "governance", "preview"],
    description: "Third-party embed and consent copy",
  },
}

export function getBlockEditorContract(blockType: string): BlockEditorContract | undefined {
  return BLOCK_EDITOR_CONTRACTS[blockType]
}

export function getBlockEditorSurfaces(blockType: string): BlockEditorSurface[] {
  return getBlockEditorContract(blockType)?.surfaces ?? []
}

export function hasBlockEditorSurface(
  blockType: string,
  surface: BlockEditorSurface,
): boolean {
  return getBlockEditorSurfaces(blockType).includes(surface)
}

export function isEditorSurfaceAllowed(
  blockType: string,
  surface: BlockEditorSurface,
): boolean {
  return hasBlockEditorSurface(blockType, surface)
}
