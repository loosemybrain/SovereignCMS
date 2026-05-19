# Persistence Adapter Readiness — Phase 65

## Purpose

Phase 65 audits how SovereignCMS couples to persistence providers today and defines boundaries so future deployments can use Supabase/Postgres, plain Postgres, SQLite, Prisma-backed stores, or customer-managed adapters **without** rewriting CMS core logic.

This phase is **audit + boundary preparation only**. No migrations, no adapter implementations, no runtime rewiring.

---

## Current persistence entry points

| Layer | Role | Key artifacts |
|-------|------|----------------|
| **Core** (`packages/core`) | Domain types, validation, editor contracts (`EditorPersistence`), governance types | No DB client, no provider SDK |
| **DB** (`packages/db`) | `DatabaseAdapter` + repository interfaces; `createInMemoryAdapter()` | `contracts.ts`, `in-memory-adapter.ts`, `adapters/types.ts` (draft facades) |
| **Runtime** (`packages/runtime`) | Composes adapters via `createRuntime()`; persistence facades per domain | `adapter-selection.ts`, `*-persistence.ts`, `public-*-resolution.ts` |
| **Tenancy** (`packages/tenancy`) | `TenantResolver` backed by `db.tenants` | `database-tenant-resolver.ts` |
| **Storage** (`packages/storage`) | Blob upload URLs (separate from DB metadata) | `StorageAdapter` |
| **Auth** (`packages/auth`) | Session provider (separate from content DB) | `AuthProvider` |
| **Adapters** (`adapters/*`) | Provider placeholders (Supabase, Postgres, S3, Keycloak, Vercel) | Not wired into `selectDatabaseAdapter` yet |
| **Admin / Web** | Server Components, server actions, loaders | `createRuntime()` / `getAdminRuntime()` |

### Runtime composition flow

```
ENV (DATABASE_ADAPTER, STORAGE_ADAPTER, AUTH_ADAPTER)
  → loadRuntimeConfig()
  → selectDatabaseAdapter() | selectStorageAdapter() | selectAuthProvider()
  → createRuntime({ db, storage, auth, …persistence facades })
  → apps use runtime.* (ideally facades, sometimes runtime.db.*)
```

**Default today:** `DATABASE_ADAPTER=memory` (in-memory demo data). Selecting `supabase` or `postgres` throws `Adapter not implemented yet`.

---

## Provider-specific dependencies (active monorepo)

| Dependency | Where | Severity |
|------------|-------|----------|
| **Supabase SDK** | Not in `apps/*` or `packages/*` (only `legacy/physio-source`) | ✅ Clean in active code |
| **Prisma** | Not present | ✅ N/A |
| **Supabase name in config** | `packages/runtime/src/config.ts` enum values | Low — selection label only |
| **Placeholder adapters** | `adapters/supabase`, `adapters/postgres` implement `DatabaseAdapter` stubs | Low — not imported by runtime |
| **Legacy physio-source** | Heavy Supabase coupling | Out of scope — reference only, not production path |

### Environment variables (persistence-related)

| Variable | Purpose |
|----------|---------|
| `DATABASE_ADAPTER` | `memory` \| `supabase` \| `postgres` |
| `STORAGE_ADAPTER` | `memory` \| `supabase` \| `s3` |
| `AUTH_ADAPTER` | `none` \| `supabase` \| `keycloak` |
| `APP_ENV`, `DEFAULT_LOCALE`, `SUPPORTED_LOCALES` | Runtime, not DB-specific |

No `NEXT_PUBLIC_SUPABASE_*` in active apps.

---

## Where persistence is already clean

1. **No Supabase in `apps/admin` or `apps/web`** — all data access goes through `@sovereign-cms/runtime` (or types from `@sovereign-cms/db`).
2. **Core has no database imports** — contracts are provider-agnostic.
3. **`DatabaseAdapter` is a composed interface** — small repositories (pages, blocks, navigation, media, settings, privacy scans, tenants), not a god-repository.
4. **Runtime facades exist** for editor drafts, page status, page creation, navigation, media, settings, privacy scanner, public page/navigation resolution.
5. **Auth and storage are separate adapter slots** — content persistence is not conflated with blob storage or OIDC.
6. **Adapter selection is centralized** in `packages/runtime/src/adapter-selection.ts`.
7. **Client boundary** — `RuntimeConfig` is not passed to Client Components; only `AdminRuntimeAdapterLabels` (strings) cross the boundary (`admin-runtime-display.ts`).
8. **Contact form** — validation in core; submit action has no DB persistence (mock only).

---

## Coupling risks for database portability

### Medium: apps call `runtime.db` directly

Some server code bypasses runtime facades and uses `DatabaseAdapter` repositories directly:

| Location | Usage |
|----------|--------|
| `apps/admin/src/lib/load-admin-page-detail.ts` | `db.pages.findBySlug`, `db.blocks.listByPage`, `db.navigation.listByTenant` |
| `apps/admin/src/lib/load-admin-pages.ts` | `db.pages.listByTenant` |
| `apps/admin/src/app/(admin)/dashboard/page.tsx` | `db.blocks.listByPage` per page |
| `apps/admin/src/app/(admin)/navigation/page.tsx` | `db.pages.listByTenant` |
| `apps/admin/src/app/(admin)/footer-navigation/page.tsx` | `db.pages.listByTenant` |
| `apps/web/src/lib/load-public-page.ts` | `db.blocks.listByPage` (after `publicPageResolution`) |

**Risk:** When repository shapes change for SQL/Supabase, these call sites must be updated unless refactored to facades first.

**Mitigation (future):** Route reads through `runtime.*Persistence` or dedicated query helpers in runtime; keep `DatabaseAdapter` as the only type apps may reference from `@sovereign-cms/db`.

### Low: type import from `@sovereign-cms/db` in web

`load-public-page.ts` imports `PageRecord` (= `CmsPage`) from `@sovereign-cms/db`. Acceptable type-only coupling; could move to core alias later.

### Low: `TenantRepository` returns `unknown`

`findByDomain` / `findById` use `unknown` rows; `database-tenant-resolver` normalizes to `TenantContext`. Real adapters must map rows consistently — document mapping per provider.

### Medium: public page resolution loads all pages per slug

`public-page-resolution.ts` uses `listByTenant` + in-memory `find` by slug. Works for demo; production adapters should add `findBySlug` at DB level (already on `PageRepository`) and use it in resolution.

### Medium: no durable persistence flag honesty

Runtime facades return `persisted: false` for in-memory mode. Future adapters must set `persisted: true` when writing to real storage without changing action signatures.

### High (future, not today): wiring Supabase incorrectly

If Supabase were wired in apps or core instead of `packages/db` / `adapters/supabase`, portability would fail. Phase 65 locks strategy: **Supabase is one adapter implementation, not platform core.**

### Separate concern: auth

Admin has no real auth guard yet (comments mention future auth). Supabase Auth / Keycloak must remain in `packages/auth` + `adapters/*`, not in content repositories.

### Separate concern: media bytes

`MediaRepository` stores metadata; file bytes belong to `StorageAdapter`. Upload pipeline must not assume Supabase Storage globally.

### Not in `DatabaseAdapter` today (by design or gap)

| Capability | Status |
|------------|--------|
| `deletePage` / `getPageById` | Not on `PageRepository` — add only when product needs |
| Brand-specific settings table | Not modeled — brand lives in composition types only |
| Contact form submissions persistence | Not implemented — action is mock |
| Footer as separate store | Uses `navigation` with `scope: "footer"` |
| SQL strings in apps | None found |

---

## Recommended adapter boundary

```
┌─────────────────────────────────────────────────────────────┐
│ apps/admin, apps/web (Server Components + server actions)   │
│  - createRuntime() / getAdminRuntime()                        │
│  - runtime.editorPersistence, .settingsPersistence, …       │
│  - avoid provider SDKs; avoid RuntimeConfig in clients      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│ packages/runtime                                              │
│  - provider-independent CMS operations                        │
│  - depends on DatabaseAdapter, StorageAdapter, AuthProvider   │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ packages/db   │   │ packages/     │   │ packages/auth │
│ DatabaseAdapter│   │ storage       │   │ AuthProvider  │
│ + in-memory   │   │ StorageAdapter│   │               │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
 adapters/supabase   adapters/s3        adapters/keycloak
 adapters/postgres   adapters/supabase
 (future sqlite/prisma in packages/db or adapters/)
```

**Core:** types and contracts only.

**DB package:** all query/table knowledge; server-side only.

**Runtime:** orchestration; no UI imports.

**Apps:** never import `@supabase/*`; never pass DB clients to Client Components.

---

## Target layer rules (summary)

| Layer | May | Must not |
|-------|-----|----------|
| Core | Types, validation, `EditorPersistence` interface | Provider clients, SQL, Supabase types |
| Runtime | Use `DatabaseAdapter`, map to view models | Provider SDKs, UI |
| DB | Implement repositories, map rows → core types | React, Next.js |
| Admin/Web | Call runtime / server actions | Direct Supabase, raw SQL |

---

## Adapter interface draft

**Live contract:** `packages/db/src/contracts.ts` — `DatabaseAdapter` with repository interfaces.

**Documentation draft (not wired):** `packages/db/src/adapters/types.ts` — facades such as `ContentPersistenceAdapter`, `SettingsPersistenceAdapter`, etc., aligned with runtime method names for future provider packs.

Task-shaped mapping:

| Draft facade | Current repository |
|--------------|-------------------|
| `ContentPersistenceAdapter` | `PageRepository` + `BlockRepository` |
| `SettingsPersistenceAdapter` | `SettingsRepository` |
| `NavigationPersistenceAdapter` | `NavigationRepository` |
| `MediaPersistenceAdapter` | `MediaRepository` |
| `PrivacyScannerPersistenceAdapter` | `PrivacyScanRepository` |
| `TenantPersistenceAdapter` | `TenantRepository` |

Intentionally **not** added: generic CRUD, dynamic schemas, universal repository, Prisma client in core.

---

## Data access classification

| Area | Current access pattern | Coupling | Risk | Future adapter | Priority |
|------|------------------------|----------|------|----------------|----------|
| **Pages** | `runtime.db.pages` + `pageCreationPersistence` / `pageStatusPersistence` / `publicPageResolution` | Low–medium | Slug resolution inefficient; some direct `db` in admin | `PageRepository` / content facade | P0 |
| **Blocks** | `editorPersistence` → `db.blocks.replacePageBlocks`; direct `db.blocks` in loaders | Medium | Direct `db` in admin/web | `BlockRepository` | P0 |
| **Settings** | `settingsPersistence` → `db.settings` | Low | — | `SettingsRepository` | P1 |
| **Tenants** | `tenantResolver` → `db.tenants` | Low | `unknown` row shape | `TenantRepository` | P0 |
| **Brands** | Composition types only; no persistence | None | Brand not persisted yet | Future brand repo or settings extension | P2 |
| **Navigation** | `navigationPersistence` + direct `db.navigation` in page detail | Low–medium | Mixed facade/direct | `NavigationRepository` | P1 |
| **Footer** | `navigation` with `scope: "footer"` + settings mapping in runtime | Low | — | Same as navigation + settings | P1 |
| **Media** | `mediaPersistence` → `db.media`; metadata only | Low | Upload not tied to storage adapter yet | `MediaRepository` + `StorageAdapter` | P1 |
| **Contact forms** | `submitContactFormAction` — validate only, no DB | None | Future persistence is new scope | Future `ContactSubmissionRepository` | P3 |
| **Privacy scanner** | `privacyScannerPersistence` → `db.privacyScans` | Low | — | `PrivacyScanRepository` | P2 |
| **Auth / admin access** | `authAdapter: none`; no guard | Low (config only) | Production needs auth adapter | `AuthProvider` / Keycloak / Supabase Auth | P0 (security) |
| **Governance** | Reads page/block/nav data via admin loaders | Medium | Inherited from loader coupling | Via runtime facades | P2 |
| **Public rendering** | `loadPublicPage` → runtime resolution + `db.blocks` | Low–medium | No provider leak | Runtime only | P1 |
| **Storage / blobs** | `selectStorageAdapter` — memory only | Low | — | `StorageAdapter` implementations | P1 |

---

## Supabase as first adapter strategy

1. **Location:** Implement in `adapters/supabase` (or `packages/db/src/adapters/supabase/`), exporting `createSupabaseDatabaseAdapter(): DatabaseAdapter`.
2. **Wiring:** Register in `selectDatabaseAdapter()` when `DATABASE_ADAPTER=supabase` — single switch point.
3. **Client lifecycle:** Create Supabase client **server-side only** (Server Actions, RSC loaders). Never pass to Client Components.
4. **Types:** Map Supabase/PostgREST rows to `@sovereign-cms/core` types inside the adapter; no `Database` generic in core/runtime.
5. **RLS:** Optional deployment concern for Supabase-hosted tenants. CMS contracts must not assume RLS (e.g. no reliance on `auth.uid()` in core). Document RLS policies alongside adapter, not in core.
6. **Auth:** Supabase Auth is a separate `AUTH_ADAPTER=supabase` path via `AuthProvider`, not mixed into `PageRepository`.
7. **Storage:** Supabase Storage implements `StorageAdapter`, not `MediaRepository` file bytes.
8. **Placeholder today:** `createSupabaseDatabaseAdapterPlaceholder()` exists but is unused by runtime.

---

## Public-sector / enterprise portability requirements

| Requirement | How architecture supports it |
|-------------|-------------------------------|
| Database provider independence | `DatabaseAdapter` + ENV switch; memory default for dev |
| Explicit data ownership | Self-hosted Postgres/SQLite path without Supabase SaaS |
| No forced SaaS lock-in | Core/runtime free of Supabase SDK |
| Self-hosting path | `postgres` adapter kind + Keycloak + S3/MinIO documented in `runtime-composition.md` |
| Auditable persistence layer | All SQL/PostgREST confined to `packages/db` / `adapters/*` |
| No hidden third-party data flows | Contact form does not persist externally today |
| Content vs auth separation | Distinct adapter enums and packages |
| Predictable migration path | Repository interfaces stable; legacy in `legacy/` quarantined |
| Minimal provider-specific runtime behavior | Public resolution uses status + preview only, not RLS |

---

## Recommended future phases (not implemented)

| Phase | Focus |
|-------|--------|
| **66** | Persistence adapter contract implementation — wire `adapters/supabase` or `postgres` into `selectDatabaseAdapter`; tests against contract |
| **67** | Supabase content adapter extraction — map tables to `DatabaseAdapter`; server-only client factory |
| **68** | Runtime uses facades consistently — remove direct `runtime.db` from apps where practical |
| **69** | SQLite / plain Postgres adapter spike — prove non-Supabase path |
| **70** | Auth boundary audit — implement `AuthProvider`, admin guards, keep auth out of content repos |
| **71** | Media persistence + storage foundation — connect `StorageAdapter` to upload flows |

---

## Phase 70 update (tenant-scoped content reads)

| Topic | Change |
|-------|--------|
| `ContentPersistenceAdapter` | All read methods require explicit `tenantId` (documented in `types.ts`) |
| Memory adapter | `requireAdapterTenantId` + repository-level tenant filters |
| Supabase adapter | `.eq("tenant_id", …)` on pages/blocks; post-map tenant mismatch guard |
| Runtime loaders | `assertTenantScope` in public/admin page load paths |
| Default tenant | Only at tenancy boundary (`resolveAdminTenant`, host resolver) — not in adapters |
| Schema gap | Legacy tables without `tenant_id` need migration before Supabase content reads are safe |

See [tenant-enforcement-runtime-phase-70.md](./tenant-enforcement-runtime-phase-70.md).

---

## What Phase 65 did not change

- No database migrations
- No CMS features
- No API routes
- No external dependencies
- No replacement of in-memory adapter as default
- No Prisma introduction
- No Supabase wiring in runtime
- No public rendering, editor, auth guard, or server action behavior changes (documentation-only for coupling notes)

---

## Optional code preparation (Phase 65)

- Added `packages/db/src/adapters/types.ts` — type-only draft facades
- Extended `packages/db/src/index.ts` exports — no runtime behavior change

---

## Phase 75 update — media metadata adapter

- **`MediaPersistenceAdapter`** now returns provider-neutral **`MediaAssetRecord`** (metadata only).
- Methods: `listMedia`, `getMediaById`, `createMediaMetadata`, `updateMediaMetadata`, `archiveMedia` — all require explicit `tenantId`.
- **Storage** remains separate: draft `StorageProviderAdapter` documented in `media-storage-boundary-phase-75.md`; **not implemented**.
- Draft SQL: `docs/db/drafts/media-assets.sql` (not executable).
- Uploads, signed URLs, CDN, and binary handling are **intentionally out of scope**.
