# Settings Mini-Fix + Persistence Foundation — Result

**Phase label:** `settings-mini-fix-persistence-foundation`  
**Date:** 2026-05-19

## Summary

Tightened CSS sanitizers, added visible admin validation for theme tokens and font uploads, made `persisted` adapter-driven via `TenantSettingsSaveResult`, and documented Supabase/Postgres settings storage on `site_settings`.

## Changed files

### Core

| File | Change |
|------|--------|
| `packages/core/src/settings-css-sanitizers.ts` | Stricter colors/lengths; no `calc`; `MAX_WOFF2_FILE_BYTES`; validation helpers |
| `packages/core/src/settings-appearance.ts` | `getInvalidThemeTokenFields`; radius length-only sanitize |
| `packages/core/src/settings-theme-css.ts` | Radius length-only in CSS build |
| `packages/core/src/settings.ts` | `TenantSettingsSaveResult` type |
| `packages/core/src/index.ts` | New exports |

### DB / runtime

| File | Change |
|------|--------|
| `packages/db/src/contracts.ts` | `SettingsRepository.update` → `TenantSettingsSaveResult` |
| `packages/db/src/in-memory-adapter.ts` | `update` returns `{ settings, persisted: false }` |
| `packages/db/src/adapters/types.ts` | Adapter contract uses save result |
| `packages/runtime/src/settings-persistence.ts` | `persisted` from adapter, not config guess |

### Admin

| File | Change |
|------|--------|
| `apps/admin/src/components/settings/theme-settings-tab.tsx` | Inline invalid token hints |
| `apps/admin/src/components/settings/font-settings-tab.tsx` | Visible upload errors + success hint |
| `apps/admin/src/components/settings-editor.tsx` | Post-save sanitized theme warning |
| `apps/admin/src/lib/settings/theme-token-validation.ts` | Re-export helper |
| `apps/admin/src/lib/admin-i18n/*` | New validation strings (DE/EN) |

### Docs

| File | Change |
|------|--------|
| `docs/architecture/settings-hardening-boundary-review.md` | Updated boundaries |
| `docs/migration/sql/phase-settings-persistence-foundation.sql` | SQL template |
| `docs/migration/settings-mini-fix-persistence-foundation-result.md` | This file |

## Sanitizer hardening

- Removed `calc(...)` and `vh`/`vw`/`ch`/`ex` from length tokens.
- RGB/HSL channel range validation; conservative OKLCH regex.
- Rejects `calc`, `var`, `url`, `expression`, block comments in values.

## UI validation

- Theme: live invalid markers + save warning when sanitized values dropped.
- Fonts: type/size/read errors shown inline; prototype hint unchanged.

## Persistence result

- `TenantSettingsSaveResult { settings, persisted }` at repository/adapter layer.
- Memory: always `persisted: false`.
- Supabase/Postgres stubs: still unimplemented (no false positive).

## Supabase/Postgres foundation

- Documented `site_settings` JSONB row per tenant+locale.
- No live adapter write in this phase.

## Validation

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass (15/15) |
| `npm run lint` | Pass (0 errors; 3 pre-existing admin warnings) |
| `npm run build` | Pass (admin + web) |
| `npm run sprint:finish -- --phase settings-mini-fix-persistence-foundation` | Pass — ZIPs in `artifacts/phase-zips/` |

## Open follow-ups

- Implement `site_settings` read/write in Supabase/Postgres adapters; return `persisted: true` only after DB commit.
- Replace font `woff2DataUrl` with media asset references.
- Optional: block save on invalid theme tokens (currently warn-only).
