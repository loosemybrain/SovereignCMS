# Media Runtime Composition — Phase 77

## Purpose

Phase 76 introduced **tenant-safe media reference resolution** (`resolveMediaReference`). Phase 77 centralizes **when and how** composed media is applied in runtime page lifecycles — so public renderers, admin preview, and governance do not each re-implement enrichment.

No uploads, signed URLs, CDN rewriting, or storage SDK coupling in this phase.

---

## Why composition is separate from resolution

| Layer | Responsibility |
|-------|----------------|
| **Resolution** (`media-resolver.ts`) | `MediaReference` → `MediaAssetRecord` (metadata only) |
| **Composition** (`compose-*-block-media.ts`) | Clone blocks, inject safe URLs, attach fallback metadata, count outcomes |
| **Rendering** (apps) | `normalizeMediaReference` + UI presentation |

Composition is **SSR-safe**, **immutable** (clones blocks), and driven by **static block media contracts** (Phase 78) instead of growing `block.type` conditionals.

---

## Types (`media-composition.ts`)

- `MediaCompositionMode`: `"public"` | `"admin-preview"`
- `MediaCompositionResult<T>`: `{ value, unresolvedMediaCount, externalMediaCount, invalidMediaCount }`
- `SOVEREIGN_MEDIA_COMPOSITION_PROP`: runtime-only prop key for fallback descriptors (stripped on save)

---

## Public composition

`composePublicBlockMedia({ tenantId, blocks, mediaAdapter?, mediaResolver? })`

- Resolves `assetId` when URL prop is empty (Phase 76 behavior, centralized).
- Preserves blocks that already have a URL (backward compatible).
- Injects HTTPS and internal paths for public render.
- Unknown block types: unchanged.
- Does not mutate input array.

**Wired:** `apps/web/src/lib/load-public-page.ts` before `PublicPageView`.

---

## Admin preview composition

`composeAdminPreviewBlockMedia({ tenantId, blocks, ... })`

- Same assetId resolution for **internal** URLs.
- **Does not inject external HTTPS URLs** for preview (avoids `<img src="https://…">` loads).
- Attaches `createExternalPreviewPlaceholder()` under `_sovereignMediaComposition` for external cases.
- Client preview renderers still use `normalizeMediaReference` for display copy.

**Wired:** `apps/admin/src/lib/load-admin-page-detail.ts` → editor initial blocks.

**Not wired:** async resolution inside Client Components (by design).

---

## Fallback helpers (`media-fallbacks.ts`)

Plain data only:

- `createUnresolvedMediaFallback()`
- `createInvalidMediaFallback()`
- `createExternalPreviewPlaceholder()`

No fake remote placeholder image URLs.

---

## Future batching / caching

`collectAssetIdsForBatching(blocks)` gathers unique asset IDs before resolution.

Current implementation: in-memory `Map` per compose call, one `getMediaById` per id.

Future (documented only):

```typescript
// MediaPersistenceAdapter.listMediaByIds({ tenantId, mediaIds }) — not added in Phase 77
```

No global cache, no provider-specific memoization.

---

## Governance

`mediaCompositionGovernanceIssues()` in `@sovereign-cms/core` turns composition counters into **non-blocking** page-level info/warnings.

Merged in editor governance panel from server load hints.

---

## Portability

- Composition uses `MediaPersistenceAdapter` / `MediaResolver` only.
- Storage bytes and signed URLs remain on future `StorageProviderAdapter` (Phase 75 docs).
- Switching Supabase/S3/local does not require renderer changes.

---

## Phase 78 update

- Media-capable blocks declare fields in `BLOCK_MEDIA_CONTRACTS` (`packages/core/src/block-media-contracts.ts`).
- `compose-block-media-core.ts` resolves slots from contracts; unknown types stay unchanged.
- Avoid adding new `block.type === "…"` media branches — extend contracts instead.

See [media-capable-block-contracts-phase-78.md](./media-capable-block-contracts-phase-78.md).

## Phase 79 update

- `isMediaCapableBlock()` gates composition before field contracts are read.
- Capabilities describe semantics; **fields are never inferred from capabilities**.

See [block-capability-contracts-phase-79.md](./block-capability-contracts-phase-79.md).

---

## Related

- [media-capable-block-contracts-phase-78.md](./media-capable-block-contracts-phase-78.md)
- [media-reference-resolution-phase-76.md](./media-reference-resolution-phase-76.md)
- [media-storage-boundary-phase-75.md](./media-storage-boundary-phase-75.md)
- [docs/migration/phase-77-result.md](../migration/phase-77-result.md)
