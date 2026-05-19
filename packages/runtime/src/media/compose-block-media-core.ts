import type { CmsBlock } from "@sovereign-cms/core"
import {
  assertRuntimeBoundaryValid,
  createRuntimeCompositionMetadata,
  getRuntimeCompositionBoundary,
  getMediaFieldsForBlock,
  type RuntimeCompositionMode,
  hasMediaReferenceInput,
  isMediaCapableBlock,
  isAllowedMediaReferenceUrl,
  isResolvedMediaReferenceRenderable,
  mediaReferenceFromProps,
  resolveBlockMediaFieldKeys,
  toRenderableMediaUrl,
  type BlockMediaFieldContract,
  type MediaAssetRecord,
  type MediaFieldKind,
} from "@sovereign-cms/core"
import type { MediaPersistenceAdapter } from "@sovereign-cms/db"
import {
  createExternalPreviewPlaceholder,
  createInvalidMediaFallback,
  createUnresolvedMediaFallback,
  type MediaCompositionFallback,
} from "./media-fallbacks"
import type { MediaCompositionResult } from "./media-composition"
import { SOVEREIGN_MEDIA_COMPOSITION_PROP } from "./media-composition"
import { createMediaResolver, type MediaResolver } from "./media-resolver"

type MediaFieldKeys = {
  urlKey: string
  altKey: string
  assetIdKey: string
}

type MediaSlot = {
  blockIndex: number
  fields: MediaFieldKeys
  kind: MediaFieldKind
  allowUrlInjection: boolean
  ref: ReturnType<typeof mediaReferenceFromProps>
  existingUrl: string
}

function cloneBlock(block: CmsBlock): CmsBlock {
  return {
    ...block,
    props: { ...block.props },
  }
}

function readUrl(props: Record<string, unknown>, urlKey: string): string {
  return typeof props[urlKey] === "string" ? props[urlKey].trim() : ""
}

function attachCompositionMeta(
  props: Record<string, unknown>,
  fallback: MediaCompositionFallback,
): void {
  props[SOVEREIGN_MEDIA_COMPOSITION_PROP] = fallback
}

function isExternalUrl(url: string): boolean {
  return url.startsWith("https://")
}

function isInternalRenderableUrl(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//")
}

function shouldInjectUrl(
  mode: RuntimeCompositionMode,
  record: MediaAssetRecord,
  renderUrl: string,
): boolean {
  if (mode === "public") {
    return true
  }
  return isInternalRenderableUrl(renderUrl) && record.storageProvider !== "external"
}

function fieldAppliesToCompositionMode(
  field: BlockMediaFieldContract,
  mode: RuntimeCompositionMode,
): boolean {
  if (field.mode === "both") {
    return true
  }
  return field.mode === mode
}

function contractFieldsToKeys(
  blockType: string,
  mode?: RuntimeCompositionMode,
): Array<{ fields: MediaFieldKeys; kind: MediaFieldKind; allowUrlInjection: boolean }> {
  if (!isMediaCapableBlock(blockType)) {
    return []
  }

  return getMediaFieldsForBlock(blockType)
    .filter((field) => mode === undefined || fieldAppliesToCompositionMode(field, mode))
    .map((field) => {
      const keys = resolveBlockMediaFieldKeys(field)
      return {
        fields: {
          urlKey: keys.urlKey,
          altKey: keys.altKey,
          assetIdKey: keys.assetIdKey,
        },
        kind: field.kind,
        allowUrlInjection: field.kind !== "external-media",
      }
    })
}

function resolveMediaAdapter(params: {
  mediaAdapter?: MediaPersistenceAdapter
  mediaResolver?: MediaResolver
}): MediaResolver {
  if (params.mediaResolver) {
    return params.mediaResolver
  }
  if (params.mediaAdapter) {
    return createMediaResolver({ media: params.mediaAdapter })
  }
  throw new Error("composeBlockMedia: mediaAdapter or mediaResolver is required")
}

/**
 * Collect unique assetIds for future batch adapter methods (Phase 77).
 * Current resolution still calls getMediaById per slot.
 */
export function collectAssetIdsForBatching(blocks: CmsBlock[]): string[] {
  const ids = new Set<string>()

  for (const block of blocks) {
    for (const { fields } of contractFieldsToKeys(block.type)) {
      const assetId = mediaReferenceFromProps({
        url: block.props[fields.urlKey],
        alt: fields.altKey ? block.props[fields.altKey] : undefined,
        assetId: fields.assetIdKey ? block.props[fields.assetIdKey] : undefined,
      }).assetId

      if (assetId) {
        ids.add(assetId)
      }
    }
  }

  return [...ids]
}

export async function composeBlockMedia(params: {
  mode: RuntimeCompositionMode
  tenantId: string
  blocks: CmsBlock[]
  mediaAdapter?: MediaPersistenceAdapter
  mediaResolver?: MediaResolver
}): Promise<MediaCompositionResult<CmsBlock[]>> {
  const tenantId = params.tenantId?.trim()
  if (!tenantId) {
    throw new Error("composeBlockMedia: tenantId is required")
  }

  const boundary = getRuntimeCompositionBoundary(params.mode)
  assertRuntimeBoundaryValid(boundary, params.mode)

  const resolver = resolveMediaAdapter(params)
  const output = params.blocks.map(cloneBlock)
  const counters = {
    unresolvedMediaCount: 0,
    externalMediaCount: 0,
    invalidMediaCount: 0,
  }

  const slots: MediaSlot[] = []

  params.blocks.forEach((block, blockIndex) => {
    const fieldSets = contractFieldsToKeys(block.type, params.mode)

    for (const { fields, kind, allowUrlInjection } of fieldSets) {
      const props = block.props ?? {}
      const existingUrl = readUrl(props, fields.urlKey)
      const ref = mediaReferenceFromProps({
        url: props[fields.urlKey],
        alt: fields.altKey ? props[fields.altKey] : undefined,
        assetId: fields.assetIdKey ? props[fields.assetIdKey] : undefined,
      })

      if (!hasMediaReferenceInput(ref)) {
        continue
      }

      slots.push({ blockIndex, fields, kind, allowUrlInjection, ref, existingUrl })
    }
  })

  const assetRecordCache = new Map<string, MediaAssetRecord | undefined>()
  const batchAssetIds = collectAssetIdsForBatching(params.blocks)

  for (const assetId of batchAssetIds) {
    const record = await resolver.resolveMediaReference({ assetId }, tenantId)
    assetRecordCache.set(assetId, record)
  }

  for (const slot of slots) {
    const target = output[slot.blockIndex]
    const props = target.props

    if (slot.existingUrl) {
      if (!isAllowedMediaReferenceUrl(slot.existingUrl)) {
        counters.invalidMediaCount += 1
        attachCompositionMeta(props, createInvalidMediaFallback())
        continue
      }

      if (isExternalUrl(slot.existingUrl)) {
        counters.externalMediaCount += 1
        if (params.mode === "admin-preview") {
          attachCompositionMeta(
            props,
            createExternalPreviewPlaceholder(slot.existingUrl),
          )
        }
      }

      continue
    }

    if (!slot.allowUrlInjection) {
      continue
    }

    let record: MediaAssetRecord | undefined

    if (slot.ref.assetId) {
      record = assetRecordCache.get(slot.ref.assetId)
    } else if (slot.ref.url) {
      record = await resolver.resolveMediaReference(slot.ref, tenantId)
    }

    if (!record || !isResolvedMediaReferenceRenderable(record)) {
      counters.unresolvedMediaCount += 1
      attachCompositionMeta(props, createUnresolvedMediaFallback())
      continue
    }

    const renderUrl = toRenderableMediaUrl(record)
    if (!renderUrl) {
      counters.unresolvedMediaCount += 1
      attachCompositionMeta(props, createUnresolvedMediaFallback())
      continue
    }

    if (isExternalUrl(renderUrl)) {
      counters.externalMediaCount += 1
      if (params.mode === "admin-preview") {
        attachCompositionMeta(props, createExternalPreviewPlaceholder(renderUrl))
        continue
      }
    }

    if (!shouldInjectUrl(params.mode, record, renderUrl)) {
      if (params.mode === "admin-preview" && isExternalUrl(renderUrl)) {
        attachCompositionMeta(props, createExternalPreviewPlaceholder(renderUrl))
      }
      continue
    }

    props[slot.fields.urlKey] = renderUrl
  }

  return {
    value: output,
    ...counters,
    metadata: createRuntimeCompositionMetadata(params.mode),
  }
}

/** Strip runtime-only composition metadata before persisting editor drafts. */
export function stripMediaCompositionMetadata(blocks: CmsBlock[]): CmsBlock[] {
  return blocks.map((block) => {
    if (!(SOVEREIGN_MEDIA_COMPOSITION_PROP in block.props)) {
      return block
    }
    const props = { ...block.props }
    delete props[SOVEREIGN_MEDIA_COMPOSITION_PROP]
    return { ...block, props }
  })
}
