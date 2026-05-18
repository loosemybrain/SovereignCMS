# Persistence Boundary — Phase 66

## Purpose

Phase 66 operationalizes the persistence adapter boundary introduced in Phase 65 for **content reads** (pages + blocks), without migrating the full platform or adding generic repository layers.

## Composition root (server-side)

`packages/runtime/src/persistence.ts`

- `resolveContentPersistenceAdapter(config, db)` — explicit allowlist: `memory` | `supabase`
- `createRuntime()` exposes `runtime.content: ContentPersistenceAdapter`
- No dynamic plugin discovery, no global registry, no client imports

### Selection behavior

| `DATABASE_ADAPTER` | Content adapter | `DatabaseAdapter` (other domains) |
|--------------------|-----------------|-----------------------------------|
| `memory` (default) | Delegates to in-memory `DatabaseAdapter` repos | In-memory |
| `supabase` | Supabase reads via client port | In-memory (hybrid until Phase 67+) |
| `postgres` | Throws clear `PersistenceAdapterError` | Throws at selection |

Hybrid `supabase` mode is intentional: content can load from Supabase while settings/navigation/media remain on in-memory repos until those adapters are extracted.

## Content adapter implementations

### Memory — `packages/db/src/adapters/memory-content-adapter.ts`

Wraps existing `PageRepository` + `BlockRepository` on `DatabaseAdapter`. Default path; behavior unchanged from pre-Phase-66 direct `db.pages` / `db.blocks` reads.

### Supabase — `packages/db/src/adapters/supabase/content-adapter.ts`

- Maps sovereign-aligned rows → `CmsPage` / `CmsBlock`
- Accepts `SupabaseContentClientPort` (no Supabase SDK in `packages/db`)
- Read-only in Phase 66 (`createPage`, `saveBlocks`, status transitions throw `not_implemented`)
- Errors normalized to `PersistenceAdapterError` (no PostgREST objects in runtime)

Client implementation: `adapters/supabase/src/content-client.ts` (optional `@supabase/supabase-js`).

### Assumed tables (deployment contract, no migration in repo)

**`pages`:** `id`, `tenant_id`, `locale`, `slug`, `title`, `status`, `seo`, `created_at`, `updated_at`

**`blocks`:** `id`, `tenant_id`, `page_id`, `type`, `sort_order`, `props`, `visibility`, `created_at`, `updated_at`

Legacy physio `brand`-scoped tables are not used by this adapter.

### Environment (server-only)

- `SUPABASE_URL` (required for supabase mode)
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY`

## Wired read paths

| Location | Operation | Adapter |
|----------|-----------|---------|
| `public-page-resolution.ts` | `getPageBySlug` | `runtime.content` |
| `apps/web/.../load-public-page.ts` | `listBlocks` | `runtime.content` |
| `apps/admin/.../load-admin-page-detail.ts` | `getPageBySlug`, `listBlocks` | `runtime.content` |

## Remaining direct `runtime.db` usage

| Area | Reason | Future phase |
|------|--------|--------------|
| `load-admin-pages.ts`, dashboard, navigation/footer pages | List pages for admin UI | Phase 68 |
| `editor-persistence` / `save-page-draft` | Block writes via `db.blocks` | Phase 67+ |
| Settings, navigation, media, privacy, tenants | Not in content adapter scope | Phases 67–71 |
| `public-navigation-resolution` | Navigation not migrated | Phase 68 |

No direct Supabase usage exists in `apps/*`; remaining coupling is `runtime.db` repositories.

## Error normalization

`packages/db/src/adapters/errors.ts` — `PersistenceAdapterError`, `normalizeAdapterError()`.

Small, explicit codes (`supabase_query_failed`, `config_missing`, `not_implemented`, …). No user-facing i18n.

## Related docs

- [persistence-adapter-readiness-phase-65.md](./persistence-adapter-readiness-phase-65.md)
- [supabase-content-adapter-phase-66.md](./supabase-content-adapter-phase-66.md)
