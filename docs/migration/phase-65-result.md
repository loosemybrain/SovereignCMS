# Phase 65 — Persistence Adapter Readiness Audit: Result

## Summary

Phase 65 audited persistence coupling across the SovereignCMS monorepo and documented adapter boundaries for multi-provider production deployments (public-sector / enterprise portability). No persistence migration, no new CMS features, and no provider implementations were added.

---

## What was audited

- `packages/db` — `DatabaseAdapter`, repositories, in-memory implementation
- `packages/runtime` — `createRuntime`, adapter selection, domain persistence facades
- `packages/core`, `packages/tenancy`, `packages/storage`, `packages/auth`
- `adapters/*` — Supabase, Postgres, S3, Keycloak placeholders
- `apps/admin`, `apps/web` — loaders, server actions, env coupling
- `legacy/physio-source` — noted as historical Supabase-heavy reference (out of active path)

---

## Coupling findings (honest)

### Clean (active monorepo)

- No `@supabase/*` imports in `apps/*` or `packages/*`
- No Prisma
- No SQL strings in apps
- Core is provider-free
- Centralized `DATABASE_ADAPTER` / `STORAGE_ADAPTER` / `AUTH_ADAPTER` selection
- Default remains in-memory; Supabase/Postgres throw until implemented
- `RuntimeConfig` not passed to Client Components

### Medium-risk (documented, not fixed)

- **Direct `runtime.db.*` in admin loaders and pages** — bypasses some runtime facades (`load-admin-page-detail`, `load-admin-pages`, dashboard, navigation, footer-navigation)
- **`load-public-page.ts`** calls `runtime.db.blocks.listByPage` directly after public page resolution
- **`public-page-resolution`** lists all tenant pages to find by slug (should use `findBySlug` when scaling)
- **Supabase/Postgres/Keycloak names in config enums** — intentional adapter labels, not runtime lock-in

### Legacy (quarantined)

- `legacy/physio-source` contains extensive Supabase client usage in admin, API routes, and public popups — not part of SovereignCMS runtime architecture

---

## Deliverables

| Artifact | Description |
|----------|-------------|
| `docs/architecture/persistence-adapter-readiness-phase-65.md` | Full audit, boundaries, Supabase strategy, classification table, roadmap |
| `packages/db/src/adapters/types.ts` | Type-only draft adapter facades (not wired) |
| `packages/db/src/index.ts` | Exports draft types + `PrivacyScanRepository` |

---

## Adapter boundaries proposed

- **Core:** contracts/types only
- **Runtime:** provider-independent operations via `DatabaseAdapter` + facades
- **DB / adapters:** provider implementations, server-side clients
- **Apps:** runtime/server actions only; no provider SDKs

Supabase documented as **one adapter implementation**, separate from auth and storage concerns.

---

## Public-sector portability risks (summary)

| Risk | Mitigation path |
|------|-----------------|
| Accidental Supabase-in-apps pattern from legacy | Keep active apps on runtime; do not port physio patterns |
| Direct `db` access proliferating | Phase 68 — consolidate behind runtime facades |
| RLS assumed in business logic | Keep authorization in app/auth layer; RLS optional per deployment |
| Contact/form data flows | Currently mock; define explicit adapter before production persistence |

---

## What was not changed

- Database migrations
- CMS features, API routes, external dependencies
- In-memory default behavior
- Public rendering, editor workflows, auth guards, server action logic
- `adapter-selection.ts` implementation (still throws for non-memory adapters)

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run typecheck` | ✅ 15/15 packages passed, 0 errors |
| `npm run lint` | ✅ 0 errors (3 pre-existing admin warnings) |
| `npm run build` | ✅ `apps/web` and `apps/admin` built successfully |

Pre-existing lint warnings (not introduced in Phase 65):

- `apps/admin/src/components/admin-ui/admin-avatar.tsx` — `<img>` element warning
- `apps/admin/src/components/create-media-asset-form.tsx` — unused variable warning
- `apps/admin/src/lib/admin-i18n/index.ts` — unused import warning

---

## Acceptance criteria — status

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Persistence coupling audit exists | ✅ |
| 2 | Provider coupling areas documented | ✅ |
| 3 | Target persistence boundaries documented | ✅ |
| 4 | Supabase documented as adapter, not core | ✅ |
| 5 | Public-sector portability requirements documented | ✅ |
| 6 | Future adapter roadmap exists | ✅ |
| 7–15 | No core leakage, migrations, APIs, deps, behavior changes | ✅ |
| 16 | typecheck/lint/build documented honestly | ✅ (filled after run) |
