# Phase 74 — Tenant-Aware Operational Read Enforcement

## Scope

**Content reads/writes** were tenant-scoped in Phases 70–72. **Tenant runtime resolution** was centralized in Phase 73.

Phase 74 focuses on **operational / non-content reads**: navigation, footer, settings, brand settings (alias), media metadata, privacy scanner jobs/findings, and public layout shell data.

**Not in scope:** tenant management UI, host/domain routing engines, DB migrations, API routes, auth/MFA changes, generic repositories, request-global mutable tenant context.

---

## Audit — operational read areas

| Area | Read path | `tenantId` explicit? | Adapter filter | Cross-tenant risk (before) | Priority | Status (Phase 74) |
|------|-----------|----------------------|----------------|------------------------------|----------|-------------------|
| Main navigation (public) | `publicNavigationResolution` → `navigation.listNavigationItems` | Yes (`tenantScope`) | Memory: `filterRowsByTenant` | Medium (direct `db.navigation`) | P0 | **Migrated** |
| Footer navigation (public) | Same resolver, `scope: "footer"` | Yes | Same | Medium | P0 | **Migrated** |
| Footer navigation (admin) | `navigationPersistence.listFooterNavigationItems` | Yes (`resolveAdminOperationalReadScope`) | Same | Medium | P0 | **Migrated** |
| Main navigation (admin) | `navigationPersistence.listNavigationItems` | Yes | Same | Medium | P0 | **Migrated** |
| Tenant settings (public/admin) | `settingsPersistence.getTenantSettings` | Yes | `assertTenantOwnedSettings` | Low (single row) | P0 | **Migrated** |
| Brand settings | `getBrandSettings` → same store as tenant | Yes | Same | Low | P1 | **Contract only** (no separate brand table) |
| Media list (admin) | `mediaPersistence.listMediaAssets` | Yes | `filterRowsByTenant` | Medium | P0 | **Migrated** |
| Media by id | `getMediaById` on adapter | Yes | Returns `null` on mismatch | Medium | P1 | **Adapter contract** |
| Privacy scans (admin) | `privacyScannerPersistence.listPrivacyScans` | Yes | `filterRowsByTenant` | Medium | P0 | **Migrated** |
| Privacy findings | `listFindings` on adapter | Yes | Via parent scan tenant | Medium | P1 | **Migrated** |
| Governance nav (editor detail) | `load-admin-page-detail` → `navigationPersistence` | Yes (`tenantScope`) | Same | Medium | P1 | **Migrated** |
| Content pages (admin nav helper) | `runtime.content.listPages` | Yes (Phase 70) | Content adapter | Low | P0 | **Wired** |
| Dashboard block counts | `runtime.content.listBlocks` | Yes | Content adapter | Low | P2 | **Wired** |
| Governance summaries | Editor in-memory only | N/A | N/A | None (no DB) | — | Documented |
| Supabase operational reads | Not implemented | — | — | High when enabled | Future | **Out of scope** |
| Storage bytes (S3/local) | `StorageAdapter` | Path/key based | Not tenant metadata | High | Future | Documented |
| `loadPublicSettings` helper | Passes caller `tenantId` | Caller-dependent | Adapter | Medium if wrong tenant passed | P2 | Unchanged (caller must scope) |

---

## Adapter contracts (`packages/db/src/adapters/types.ts`)

Explicit read methods only — no generic `read(entity)`.

- `SettingsPersistenceAdapter.getTenantSettings({ tenantId })`
- `SettingsPersistenceAdapter.getBrandSettings({ tenantId, brand })` — alias until brand table exists
- `NavigationPersistenceAdapter.listNavigationItems({ tenantId, locale?, scope? })`
- `FooterPersistenceAdapter.listFooterNavigationItems({ tenantId, locale? })`
- `MediaPersistenceAdapter.listMedia({ tenantId })`, `getMediaById({ tenantId, mediaId })`
- `PrivacyScannerPersistenceAdapter.listScans({ tenantId })`, `listFindings({ tenantId, scanId? })`

---

## Read-side invariants (memory adapters)

- `requireAdapterTenantId` on every operational read.
- Post-read `filterRowsByTenant` for list results (navigation, media, privacy scans).
- Settings: `assertTenantOwnedSettings` after load.
- Media `getMediaById`: `null` when id missing or `tenantId` mismatch (no leak).
- Privacy `listFindings`: `findScanForTenant` throws on cross-tenant `scanId`.
- **No silent default tenant** inside adapters.

---

## Runtime read scope

| Helper | Role |
|--------|------|
| `resolveRuntimeReadScope` | Maps `ResolvedTenantContext` → `TenantRuntimeScope` |
| `prepareOperationalRead` | Read permission hook points (`navigation:read`, etc.) — **not enforced** until reliable `AuthorizationSubject` |
| `resolveAdminOperationalReadScope` (admin app) | Central admin operational read scope |

Public shell (`load-public-page.ts`) already uses one `tenantScope` for content, navigation, settings, and footer.

---

## Error / not-found semantics

| Condition | Behavior |
|-----------|----------|
| Missing / empty `tenantId` at adapter | `PersistenceAdapterError` / `requireAdapterTenantId` throw |
| List result contains other tenant rows | `tenant_scope_mismatch` throw |
| Settings row tenant mismatch | `tenant_scope_mismatch` throw |
| Media id wrong tenant | `null` (not found) |
| Privacy scan wrong tenant | `tenant_scope_mismatch` or `scan_not_found` |
| Client tenant ≠ server scope (admin action) | Error in `loadNavigationItemsAction` |

No localization layer; messages are server-side English.

---

## Authorization hook points (documented, not enforced)

| Operation | Permission |
|-----------|------------|
| Navigation reads | `navigation:read` |
| Settings reads | `settings:read` |
| Media reads | `media:read` |
| Privacy reads | `privacy:read` |
| Governance reads | `governance:read` |

Wired via `prepareOperationalRead` in public navigation resolution and `resolveAdminOperationalReadScope` for admin pages.

---

## Remaining unscoped / future work

| Item | Risk | Future path |
|------|------|-------------|
| Supabase operational adapters | Cross-tenant if RLS missing | Phase 75+ with RLS + adapter parity |
| `runtime.db.*` direct reads in apps | Bypass adapter invariants | Migrate to facades per domain |
| Brand-specific settings table | Brand param ignored semantically | Schema + adapter split |
| Media folder hierarchy | No `folderId` in memory schema | Extend contract when schema exists |
| Privacy scanner queue / workers | In-memory per request | Persistent queue + tenant partition |
| Storage object keys | Bytes not tenant-tagged in metadata | **Phase 75** documented key strategy; uploads still future |
| Media metadata ownership | Legacy `MediaAsset` in memory repo | **Phase 75** — `MediaAssetRecord` + `MediaPersistenceAdapter` metadata contract |
| `loadPublicSettings` standalone | Caller must pass correct tenant | Wire through public tenant resolver |
| Host-based tenant DB lookup | Separate from sync resolver (Phase 73) | Custom domain phase |

---

## Related phases

- **70** — Content read tenant scope, `TenantRuntimeScope`
- **71** — Content writes
- **72** — Operational writes
- **73** — Explicit tenant runtime resolution
- **74** — Operational reads (this document)
- **75** — Media ownership types, metadata adapter contract, storage boundary docs
