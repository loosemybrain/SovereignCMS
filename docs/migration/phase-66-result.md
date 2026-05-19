# Phase 66 — Persistence Boundary Operationalization: Result

## Summary

Phase 66 introduced a server-side content persistence composition root and wired low-risk page/block **read** paths through `ContentPersistenceAdapter`. Memory mode (default) preserves prior behavior; Supabase mode adds a read-only content adapter behind an explicit env switch.

No full persistence migration, no new external dependencies in `packages/db`, no database migrations, and no changes to auth, editor save actions, or public rendering logic beyond the adapter indirection.

---

## What was delivered

### Composition root

- `packages/runtime/src/persistence.ts` — `resolveContentPersistenceAdapter()`
- `createRuntime()` now exposes `runtime.content`

### Adapter implementations

| File | Role |
|------|------|
| `packages/db/src/adapters/memory-content-adapter.ts` | Delegates to `DatabaseAdapter` pages/blocks |
| `packages/db/src/adapters/supabase/content-adapter.ts` | Maps port rows → core types |
| `packages/db/src/adapters/supabase/client-port.ts` | Provider-neutral query port |
| `packages/db/src/adapters/supabase/row-mappers.ts` | Row → `CmsPage` / `CmsBlock` |
| `packages/db/src/adapters/errors.ts` | `PersistenceAdapterError` |
| `adapters/supabase/src/content-client.ts` | Server Supabase client + port impl |

### Wired read paths

- `public-page-resolution` → `content.getPageBySlug`
- `load-public-page` → `content.listBlocks`
- `load-admin-page-detail` → `content.getPageBySlug`, `content.listBlocks`

### Hybrid `DATABASE_ADAPTER=supabase`

- Content reads: Supabase (when env + SDK present)
- Other repos: in-memory via `selectDatabaseAdapter` (documented limitation)

---

## Intentionally not migrated

| Area | Still uses |
|------|------------|
| Editor draft save | `runtime.db.blocks.replacePageBlocks` |
| Admin page lists (dashboard, nav editors) | `runtime.db.pages.listByTenant` |
| Settings, navigation CRUD, media, privacy | `runtime.db.*` repositories |
| Auth / guards | Unchanged |
| Contact form | No persistence |
| Storage uploads | Unchanged |

---

## Direct Supabase in apps

**None.** Supabase SDK is only referenced in `adapters/supabase` (optional dependency).

---

## Portability improvement

- Content reads have a single interface (`ContentPersistenceAdapter`).
- Public/admin read paths no longer call `db.pages` / `db.blocks` directly for the migrated flows.
- Supabase is isolated behind port + mapper; core remains provider-free.

---

## Limitations

- Supabase adapter requires sovereign-aligned `pages` / `blocks` tables (documented, not migrated in repo).
- Supabase mode is hybrid: settings/navigation may disagree with Supabase content until later phases.
- Supabase writes (`saveBlocks`, page create/status) not implemented.
- `postgres` adapter kind still throws at composition.

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run typecheck` | ✅ 15/15 packages, 0 errors |
| `npm run lint` | ✅ 0 errors (3 pre-existing admin warnings) |
| `npm run build` | ✅ web + admin |

---

## Documentation

- [persistence-boundary-phase-66.md](../architecture/persistence-boundary-phase-66.md)
- [supabase-content-adapter-phase-66.md](../architecture/supabase-content-adapter-phase-66.md)

---

## Acceptance criteria — status

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Server-side composition point | ✅ |
| 2 | Supabase content adapter exists | ✅ |
| 3–5 | Provider-neutral data, core free, no Supabase leak to UI | ✅ |
| 6 | Low-risk read path uses adapter | ✅ |
| 7–10 | Public/admin/editor/auth unchanged in behavior (memory default) | ✅ |
| 11–15 | No migrations/APIs/deps/discovery/CRUD engine | ✅ |
| 16 | Remaining usage documented | ✅ |
| 17 | RuntimeConfig not in clients | ✅ |
| 18 | Validation documented | ✅ |
