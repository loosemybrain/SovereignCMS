# Media Storage Boundary — Phase 75 (design only)

## Purpose

Separate **media metadata** (tenant-owned records in the CMS database) from **binary object storage** (bytes in Supabase Storage, S3, local disk, or external URLs).

Phase 75 defines contracts and documentation only. **No** `StorageProviderAdapter` implementation, **no** uploads, **no** signed URLs, **no** CDN.

---

## Why metadata and storage are separate

| Concern | Layer | Phase 75 |
|---------|--------|----------|
| Who owns the asset? | `MediaAssetRecord.tenantId` | Defined |
| Where is the file? | `storageProvider` + `storageKey` / URLs | Documented |
| Can public site render it? | `visibility` + `isRenderableMediaAsset` | Helpers only |
| Upload bytes | Future `StorageProviderAdapter` | **Not implemented** |
| Delete orphaned bytes | Future storage + metadata job | **Not implemented** |

Metadata adapters (`MediaPersistenceAdapter`) must never read or write binary blobs. That prevents provider SDK types from leaking into `@sovereign-cms/core` and keeps public-sector deployments free to swap storage backends.

---

## Draft `StorageProviderAdapter` (not implemented)

Future interface sketch — **do not import in runtime yet**:

```typescript
interface StorageProviderAdapter {
  putObject(input: { tenantId: string; storageKey: string; body: Uint8Array; mimeType?: string }): Promise<void>
  getObjectMetadata(input: { tenantId: string; storageKey: string }): Promise<{ size?: number; mimeType?: string }>
  deleteObject(input: { tenantId: string; storageKey: string }): Promise<void>
  getPublicUrl(input: { tenantId: string; storageKey: string }): Promise<string | null>
  /** Future only — not in Phase 75 */
  createSignedReadUrl?(input: { tenantId: string; storageKey: string; expiresInSeconds: number }): Promise<string>
}
```

### Intentionally out of scope (Phase 75)

- Upload UI and drag/drop
- File processing, image transforms, CDN routing
- Signed URL generation and enforcement
- Generic storage plugin registry

---

## Provider fit (later)

| Provider | Typical `storageProvider` | Notes |
|----------|---------------------------|--------|
| Supabase Storage | `supabase` | Bucket + object path in `storageKey` |
| S3 / MinIO / compatible | `s3` | `tenantId/...` key prefix for isolation |
| Self-hosted disk | `local` | Path under tenant-scoped root |
| Hotlink / CDN URL only | `external` | `externalUrl` only; governance risk |
| Unknown legacy row | `unknown` | Migration placeholder |

Public-sector deployments often require **self-hosted** or **S3-compatible** storage on sovereign infrastructure. Keeping metadata in Postgres/SQLite while bytes live in customer-controlled buckets supports portability without rewriting the editor.

---

## `storageKey` strategy (future)

When uploads exist, keys should be deterministic and tenant-scoped, for example:

```
{tenantId}/media/{assetId}/{fileName}
```

Rules (planned):

- Never encode tenant id only in a folder name without DB metadata checks.
- Cross-tenant access attempts must fail at metadata layer first (`getMediaById` with `tenantId`).
- Deleting metadata should mark `orphaned` before async byte cleanup.

---

## Phase 77 — Runtime composition (addendum)

- Page loads call `composePublicBlockMedia` / `composeAdminPreviewBlockMedia` before render.
- Resolution remains metadata-only; composition clones blocks and applies URLs/fallback metadata.

See `docs/architecture/media-runtime-composition-phase-77.md`.

---

## Phase 76 — Resolution layer (addendum)

- Block pointers (`MediaReference`) resolve to `MediaAssetRecord` via `resolveMediaReference` (metadata adapter only).
- Signed URLs would sit **after** metadata resolution and **before** public URL strings — still not implemented.
- Uploads still write bytes through a future `StorageProviderAdapter`, then persist metadata.

See `docs/architecture/media-reference-resolution-phase-76.md`.

---

## Phase 78 note

Block-level pointers are declared in static **media-capable block contracts** (`BLOCK_MEDIA_CONTRACTS`). Composition and governance read those contracts; ownership rules from Phase 75 are unchanged.

See `docs/architecture/media-capable-block-contracts-phase-78.md`.

---

## Related

- `docs/architecture/media-tenant-safety-phase-75.md`
- `docs/architecture/media-reference-resolution-phase-76.md`
- `docs/architecture/media-capable-block-contracts-phase-78.md`
- `docs/db/drafts/media-assets.sql`
- `packages/db/src/adapters/types.ts` — `MediaPersistenceAdapter`
