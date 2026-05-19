/**
 * Static media field contracts for media-capable blocks (Phase 78).
 * Type-only metadata + explicit field names — not a schema engine.
 *
 * High-level semantics (`media` / `external-media`) live in `block-capabilities.ts` (Phase 79).
 * Every block listed here must declare the matching capability; capabilities must not infer fields.
 */

export type MediaFieldKind =
  | "image"
  | "background-image"
  | "icon"
  | "video"
  | "external-media"

export type MediaFieldMode = "public" | "admin-preview" | "both"

export type BlockMediaFieldContract = {
  /** Stable contract id (not necessarily a block prop key). */
  field: string
  kind: MediaFieldKind
  mode: MediaFieldMode
  altField?: string
  assetIdField?: string
  urlField?: string
  required?: boolean
  description?: string
}

export type BlockMediaContract = {
  blockType: string
  fields: BlockMediaFieldContract[]
}

export const BLOCK_MEDIA_CONTRACTS: Record<string, BlockMediaContract> = {
  hero: {
    blockType: "hero",
    fields: [
      {
        field: "hero-media",
        kind: "background-image",
        mode: "both",
        urlField: "mediaUrl",
        altField: "mediaAlt",
        assetIdField: "mediaAssetId",
        description: "Hero featured or background media",
      },
    ],
  },
  "image-text": {
    blockType: "image-text",
    fields: [
      {
        field: "image",
        kind: "image",
        mode: "both",
        urlField: "imageUrl",
        altField: "imageAlt",
        assetIdField: "mediaAssetId",
        description: "Image + text section image (assetId supported defensively)",
      },
    ],
  },
  "external-embed": {
    blockType: "external-embed",
    fields: [
      {
        field: "embed",
        kind: "external-media",
        mode: "both",
        urlField: "embedUrl",
        description: "Third-party embed source URL",
      },
    ],
  },
}

export function getBlockMediaContract(blockType: string): BlockMediaContract | undefined {
  return BLOCK_MEDIA_CONTRACTS[blockType]
}

export function getMediaFieldsForBlock(blockType: string): BlockMediaFieldContract[] {
  return getBlockMediaContract(blockType)?.fields ?? []
}

export function hasMediaFields(blockType: string): boolean {
  return getMediaFieldsForBlock(blockType).length > 0
}

/** Top-level prop keys referenced by a field contract. */
export function resolveBlockMediaFieldKeys(field: BlockMediaFieldContract): {
  urlKey: string
  altKey: string
  assetIdKey: string
} {
  return {
    urlKey: field.urlField ?? field.field,
    altKey: field.altField ?? "",
    assetIdKey: field.assetIdField ?? "",
  }
}
