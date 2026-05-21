# Phase 91 — Settings Persistence Runtime Foundation

**Phase label:** `91` / `settings-persistence-runtime-foundation`  
**Date:** 2026-05-19

## Summary

Introduced adapter-driven tenant settings persistence with `TenantSettingsPersistenceResult`, Supabase `tenant_settings` read/upsert, runtime resolution parallel to content, and honest admin feedback for memory / database / unavailable modes.

## Changed / new files

### Core

| File | Change |
|------|--------|
| `packages/core/src/settings.ts` | `SettingsPersistenceMode`, `TenantSettingsPersistenceResult`, extended `UpdateTenantSettingsResult` |
| `packages/core/src/settings-normalize.ts` | Merge, normalize, storage payload helpers |
| `packages/core/src/index.ts` | Exports |

### DB

| File | Change |
|------|--------|
| `packages/db/src/adapters/supabase/settings-client-port.ts` | Provider-neutral port |
| `packages/db/src/adapters/supabase/settings-adapter.ts` | Supabase settings adapter |
| `packages/db/src/in-memory-adapter.ts` | `persistenceMode: "memory"`, shared merge |
| `packages/db/src/contracts.ts`, `adapters/types.ts`, `index.ts` | Contract wiring |

### Runtime / adapter

| File | Change |
|------|--------|
| `packages/runtime/src/settings-adapter-resolution.ts` | memory / supabase / postgres-unavailable |
| `packages/runtime/src/operational-persistence.ts` | Config-aware settings resolve |
| `packages/runtime/src/runtime.ts` | Pass config to settings resolve |
| `packages/runtime/src/settings-persistence.ts` | Forward mode + warning |
| `adapters/supabase/src/settings-client.ts` | SDK implementation |
| `adapters/supabase/src/index.ts` | Export |

### Admin

| File | Change |
|------|--------|
| `apps/admin/src/components/settings-editor.tsx` | Three-way save feedback |
| `apps/admin/src/lib/admin-i18n/*` | `savePersistenceUnavailable` |

### Docs / SQL

| File | Change |
|------|--------|
| `docs/architecture/settings-persistence-runtime-foundation-phase-91.md` | Architecture |
| `docs/migration/sql/phase-91-settings-persistence-runtime-foundation.sql` | Table template |
| `docs/migration/phase-91-result.md` | This file |

## New types / helpers

- `TenantSettingsPersistenceResult`, `SettingsPersistenceMode`
- `mergeTenantSettingsPatch`, `normalizeTenantSettingsFromStorage`, `tenantSettingsToStoragePayload`

## DB migration

Apply `docs/migration/sql/phase-91-settings-persistence-runtime-foundation.sql` before expecting `persistenceMode: "database"` with Supabase.

## Adapter behavior

- **Memory:** in-memory map, `persisted: false`, `memory`
- **Supabase:** read/upsert `tenant_settings`; success → `database` + `persisted: true`; missing table/SDK → read defaults / write `unavailable` + warning
- **Postgres:** stub unavailable adapter (no fake DB)

## Public runtime

`load-public-page.ts` unchanged path; uses `settingsPersistence` resolved per `DATABASE_ADAPTER`. Supabase loads persisted JSON when table exists; otherwise defaults.

## Validation

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass (15/15) |
| `npm run lint` | Pass (0 errors; 3 pre-existing admin warnings) |
| `npm run build` | Pass (admin + web) |

## Open follow-ups

- Wire `updated_by` when admin user id is available server-side
- Locale-scoped `site_settings` if product needs per-locale tenant config
- Postgres adapter implementation (reuse port pattern)
- Replace font data URLs with media asset references
