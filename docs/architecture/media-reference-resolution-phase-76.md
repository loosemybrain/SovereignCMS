# Media Reference Resolution — Phase 76

## Purpose

Resolve **block-level media pointers** (`MediaReference`) into tenant-owned **`MediaAssetRecord`** metadata for safe public rendering — without uploads, signed URLs, CDN, or storage SDK coupling.

Builds on Phase 59 (`normalizeMediaReference`) and Phase 75 (`MediaAssetRecord`, storage boundary).

---

## Task 1 — Audit (current state before / after Phase 76)

### Types and normalization

| Artifact | Location | Role |
|----------|----------|------|
| `MediaReference` | `packages/core/src/media-reference.ts` | Block pointer: `assetId`, `url`, `alt` |
| `NormalizedMediaReference` | `packages/core/src/media.ts` | Pure render/governance view |
| `normalizeMediaReference` | `packages/core/src/media.ts` | URL safety, no DB |
| `MediaAssetRecord` | `packages/core/src/media-ownership.ts` | Persisted / synthetic metadata |

### Where blocks reference media

| Block | Props | Public | Admin preview |
|-------|-------|--------|---------------|
| `hero` | `mediaUrl`, `mediaAlt`, `mediaAssetId` | `PublicBlockRenderer` | Hero inspector / governance |
| `image-text` | `imageUrl`, `imageAlt`, `mediaAssetId` | `PublicBlockRenderer` | `ImageTextAdminRenderer` (client) |
| `external-embed` | `embedUrl` | iframe / consent UI | embed inspector |

Phase 78 adds static contracts for these fields — see [media-capable-block-contracts-phase-78.md](./media-capable-block-contracts-phase-78.md). Runtime composition reads contracts instead of hard-coded block types.

### Gaps addressed in Phase 76

| Gap | Before | After |
|-----|--------|-------|
| `assetId` without URL | `placeholder`, not renderable | Server resolves via `getMediaById` + injects URL when public-safe |
| Cross-tenant `assetId` | Adapter returned `null` | Resolver returns `undefined`; no fallback tenant |
| URL-only external | `normalizeMediaReference` only | Resolver can build synthetic `MediaAssetRecord` |
| Metadata vs render | Split | `resolveMediaReference` → `toRenderableMediaUrl` → existing normalizer |

### Remaining assumptions

- Blocks with **both** URL and `assetId`: existing URL wins (no override) — backward compatible.
- **Private** or **archived** metadata: not injected; public stays non-renderable.
- Admin preview remains client-side + `normalizeMediaReference` (no resolver in browser).
- Hero blocks outside public page loader are unchanged.

---

## Resolution flow

```
Block props (assetId?, url?, alt?)
        │
        ▼
mediaReferenceFromProps()
        │
        ▼
resolveMediaReference(ref, tenantId)     [server, runtime/media-resolver.ts]
        │
        ├─ assetId? ──► MediaPersistenceAdapter.getMediaById({ tenantId, mediaId })
        │                 └─ isMediaAssetOwnedByTenant → record | undefined
        │
        └─ url? ──► isAllowedMediaReferenceUrl → synthetic MediaAssetRecord
                    (storageProvider external | local, visibility public)
        │
        ▼
toRenderableMediaUrl(record)             [pure]
        │
        ▼
normalizeMediaReference({ imageUrl, … })   [existing public renderer]
```

---

## Public vs admin semantics

| Surface | Resolution | Unresolved `assetId` | Unsafe URL |
|---------|------------|----------------------|------------|
| **Public** | `load-public-page` → `enrichPublicBlocksMedia` → resolver | No URL injected; prior placeholder/fallback UI | Rejected; no render |
| **Admin preview** | `normalizeMediaReference` only (client) | Placeholder copy | Invalid / external placeholder |

### Future signed URLs

Hook point: after `MediaAssetRecord` resolution, before `toRenderableMediaUrl`:

- `storageProvider` + `storageKey` → future `StorageProviderAdapter.createSignedReadUrl` (not implemented).
- Public renderer should keep consuming **string URLs** only, never storage clients.

---

## Tenant enforcement

- `tenantId` required; empty → resolver throws on internal `requireScopedTenantId`.
- `getMediaById` scoped at adapter (Phase 74–75).
- Cross-tenant row → `undefined` (not found), no leak.
- No demo/default tenant fallback in resolver.
- Synthetic URL records always carry caller `tenantId`.

---

## Error / fallback semantics

| Condition | Result |
|-----------|--------|
| Missing `tenantId` | Throw (server helper) |
| Unknown `assetId` | `undefined` |
| Wrong-tenant asset | `undefined` |
| Private / archived asset | `undefined` (not renderable) |
| Invalid URL scheme | `undefined` |
| Public render | Existing `normalizeMediaReference` + fallbacks |

No localization; no provider error strings exposed.

---

## Pure helpers (`media-reference.ts`)

- `isResolvedMediaReferenceRenderable(record)`
- `toRenderableMediaUrl(record)`
- `isAllowedMediaReferenceUrl(url)`

---

## Runtime integration

| Path | Phase |
|------|-------|
| `createMediaResolver` on `SovereignRuntime` | 76 |
| `composePublicBlockMedia` in `load-public-page.ts` | **77** (replaces direct enrich helper) |
| `composeAdminPreviewBlockMedia` in `load-admin-page-detail.ts` | **77** |
| Admin client preview renderers | Still `normalizeMediaReference` (no async resolver) |

See [media-runtime-composition-phase-77.md](./media-runtime-composition-phase-77.md).

---

## Related

- `docs/architecture/media-storage-boundary-phase-75.md`
- `docs/architecture/media-tenant-safety-phase-75.md`
- `docs/architecture/media-governance-foundation-phase-59.md`
- `docs/migration/phase-76-result.md`
