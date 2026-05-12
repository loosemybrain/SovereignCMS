# Phase 43 Result — Settings Foundation

## New files

- `packages/core/src/settings.ts`
- `packages/runtime/src/settings-persistence.ts`
- `apps/admin/src/actions/load-tenant-settings.ts`
- `apps/admin/src/actions/update-tenant-settings.ts`
- `apps/admin/src/lib/client-settings-persistence.ts`
- `apps/admin/src/app/(admin)/settings/page.tsx`
- `apps/admin/src/components/settings-editor.tsx`
- `apps/web/src/lib/load-public-settings.ts`
- `docs/architecture/settings-foundation.md`

## Changed files

- `packages/core/src/index.ts` — settings exports
- `packages/db/src/contracts.ts`, `packages/db/src/index.ts` — `SettingsRepository`, adapter shape
- `packages/db/src/in-memory-adapter.ts` — settings store + demo seed + merge
- `packages/runtime/src/runtime.ts`, `packages/runtime/src/index.ts` — `settingsPersistence`
- `adapters/supabase/src/index.ts`, `adapters/postgres/src/index.ts` — placeholder `settings`

## Contracts

- `DatabaseAdapter.settings` implements load/update with tenant isolation by `tenantId`.

## Runtime

- `SovereignRuntime.settingsPersistence` wraps DB settings with `persisted: false` on updates.

## Admin

- `/settings` server page loads settings via runtime on the server only.
- `SettingsEditor` persists through server actions; no runtime objects on the client.

## Public app

- `loadPublicSettings` helper added for future use; no layout/footer migration.

## Limits

- No Supabase/Postgres implementation beyond placeholders.
- No API routes, no `fetch`, no `localStorage`.

## Suggestion for Phase 44

- Optional social link editor and validation; optional wiring of `loadPublicSettings` into a minimal footer/header preview on `apps/web`.
