/**
 * Static inspector composition contracts (Phase 86).
 * Declares semantic inspector groups per block type — not field schemas or UI generation.
 *
 * Separate from BLOCK_EDITOR_CONTRACTS (editor surfaces), governance, preview isolation,
 * runtime validation, and runtime boundary enforcement.
 */

import type { BlockEditorSurface } from "./block-editor-contracts"

export type BlockInspectorGroup =
  | "content"
  | "design"
  | "media"
  | "actions"
  | "layout"
  | "form"
  | "navigation"
  | "accessibility"
  | "governance"
  | "preview"

export type BlockInspectorCompositionContract = {
  blockType: string
  groups: BlockInspectorGroup[]
  description?: string
}

export const BLOCK_INSPECTOR_COMPOSITION_CONTRACTS: Record<
  string,
  BlockInspectorCompositionContract
> = {
  hero: {
    blockType: "hero",
    groups: ["content", "design", "media", "accessibility", "governance", "preview"],
    description: "Hero content, media, and preview-sensitive inspector grouping",
  },
  text: {
    blockType: "text",
    groups: ["content", "design", "accessibility", "governance"],
    description: "Body copy inspector grouping",
  },
  cta: {
    blockType: "cta",
    groups: ["content", "design", "actions", "navigation", "accessibility", "governance"],
    description: "Call-to-action with links and navigation grouping",
  },
  "feature-grid": {
    blockType: "feature-grid",
    groups: ["content", "design", "layout", "accessibility", "governance"],
    description: "Feature grid layout and content grouping",
  },
  "image-text": {
    blockType: "image-text",
    groups: [
      "content",
      "design",
      "media",
      "actions",
      "layout",
      "accessibility",
      "governance",
      "preview",
    ],
    description: "Image, text, CTA, and preview-sensitive grouping",
  },
  "contact-form": {
    blockType: "contact-form",
    groups: ["content", "form", "actions", "accessibility", "governance", "preview"],
    description: "Form fields, actions, and preview grouping",
  },
  "external-embed": {
    blockType: "external-embed",
    groups: ["content", "media", "accessibility", "governance", "preview"],
    description: "Embed content and external media grouping",
  },
}

export function getBlockInspectorCompositionContract(
  blockType: string,
): BlockInspectorCompositionContract | undefined {
  return BLOCK_INSPECTOR_COMPOSITION_CONTRACTS[blockType]
}

export function getBlockInspectorGroups(blockType: string): BlockInspectorGroup[] {
  return getBlockInspectorCompositionContract(blockType)?.groups ?? []
}

export function hasBlockInspectorGroup(
  blockType: string,
  group: BlockInspectorGroup,
): boolean {
  return getBlockInspectorGroups(blockType).includes(group)
}

export function isInspectorGroupAllowed(
  blockType: string,
  group: BlockInspectorGroup,
): boolean {
  return hasBlockInspectorGroup(blockType, group)
}

const SURFACE_TO_INSPECTOR_GROUP: Partial<Record<BlockEditorSurface, BlockInspectorGroup>> = {
  content: "content",
  design: "design",
  media: "media",
  actions: "actions",
  layout: "layout",
  form: "form",
  navigation: "navigation",
  "external-media": "media",
  accessibility: "accessibility",
  governance: "governance",
  preview: "preview",
}

/**
 * Maps an editor surface to a semantic inspector group when one exists.
 * Does not create groups — returns undefined for unmapped surfaces.
 */
export function mapEditorSurfaceToInspectorGroup(
  surface: BlockEditorSurface,
): BlockInspectorGroup | undefined {
  return SURFACE_TO_INSPECTOR_GROUP[surface]
}
