# Media Tenant Safety — Phase 75

## Principles

1. **Every metadata read/write carries an explicit `tenantId`** (Phases 74–75).
2. **Storage keys and public URLs must not become a side channel** for cross-tenant access.
3. **`MediaReference` in content blocks stays backward-compatible**; `assetId` alone is not renderable until resolution exists.
4. **External URLs are governance-sensitive** — public renderers use `normalizeMediaReference`; admin preview must not fetch arbitrary third-party URLs blindly.

---

## Tenant-owned metadata

`MediaAssetRecord` is the provider-neutral shape:

- `tenantId` — required on all adapter methods
- `storageProvider` — where bytes live (or `external` / `unknown`)
- `visibility` — `public` | `private` (render gate, not ACL engine yet)
- `status` — `active` | `draft` | `archived` | `orphaned`

Helpers (pure, `@sovereign-cms/core`):

- `isMediaAssetOwnedByTenant(asset, tenantId)`
- `isRenderableMediaAsset(asset)` — no network, no signing
- `getMediaAssetDisplayLabel(asset)`

Memory adapter enforces list/get tenant filters (Phase 74) and maps legacy `MediaAsset` rows via `legacyMediaAssetToRecord`.

---

## `storageKey` prefix strategy (future uploads)

Planned object key pattern:

```
{tenantId}/media/{assetId}/...
```

Benefits:

- Object store IAM/policies can scope by prefix
- Accidental key reuse across tenants is harder
- Orphan sweeps can list by tenant prefix

Until uploads exist, in-memory demos may use internal paths (`/placeholder.svg`) with `storageProvider: "local"`.

---

## External URL risk

| Risk | Mitigation today | Future |
|------|------------------|--------|
| `javascript:` / `data:` URLs | `normalizeMediaReference` blocks render | Same |
| HTTP (non-TLS) images | Marked invalid | Same |
| HTTPS third-party tracking | Renderable with `requiresAlt`; governance warns | Allowlist / privacy scanner |
| Hotlinked assets off-site | `storageProvider: "external"` | Tenant policy |

Admin **must not** load external media in server preview as if trusted (existing Image+Text admin behavior: HTTPS external shown as placeholder).

---

## Cross-tenant leak vectors

| Vector | Status Phase 75 |
|--------|-----------------|
| `listMedia` without `tenantId` | Blocked at adapter (`requireAdapterTenantId`) |
| `getMediaById` wrong tenant | Returns `null` |
| List rows with mixed tenants | `filterRowsByTenant` throws |
| Direct `runtime.db.media` in apps | Avoid — use `mediaPersistence` facade |
| Storage bucket without prefix | **Open** until `StorageProviderAdapter` |
| Signed URL for other tenant's key | **Not implemented** (no signing) |

---

## Orphans and archive

| Status | Meaning |
|--------|---------|
| `archived` | Soft-delete metadata; hide from default lists later |
| `orphaned` | Metadata exists; bytes missing or unlinked (future job) |

`archiveMedia({ tenantId, mediaId })` sets legacy content status `archived` in memory mode. Byte deletion is **not** performed in Phase 75.

---

## Public vs admin rendering

| Surface | Rule |
|---------|------|
| Public blocks | `normalizeMediaReference` + `isRenderable` / `safeUrl` only |
| `assetId` without URL | Public: resolved server-side when metadata is public-safe (Phase 76); otherwise placeholder |
| Admin media table | Legacy `MediaAsset` via facade mapping |
| Admin picker | Tenant id from server scope; no storage client in client |

---

## Related

- Phase 59 — `MediaReference` / governance
- Phase 74 — operational read tenant scope
- Phase 75 — `media-ownership.ts`, `MediaPersistenceAdapter`, storage boundary doc
- Phase 76 — `resolveMediaReference`, assetId tenant enforcement
- Phase 77 — `composePublicBlockMedia`, `composeAdminPreviewBlockMedia`, composition counters
