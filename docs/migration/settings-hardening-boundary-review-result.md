# Settings Hardening — Migration Result

**Phase label:** `settings-hardening-boundary-review`  
**Date:** 2026-05-19

## Summary

Hardened tenant settings (appearance, fonts, spinner) before further runtime/governance work: server-authoritative reads, CSS sanitization, honest persistence feedback, editor decomposition, central spinner contract, public CSS injection.

## Changed / added files

### Core

- `packages/core/src/settings-css-sanitizers.ts` — defensive CSS/font helpers
- `packages/core/src/settings-appearance.ts` — appearance model + `sanitizeTenantAppearanceSettings`
- `packages/core/src/settings-theme-css.ts` — `buildPublicAppearanceCss`, `buildAdminPreviewAppearanceCss`, font-face/spinner CSS
- `packages/core/src/spinner-contract.ts` — preset/speed keys and normalizers
- `packages/core/src/settings.ts` — `appearance` on `TenantSettings`
- `packages/core/src/index.ts` — exports

### DB / runtime

- `packages/db/src/in-memory-adapter.ts` — appearance merge/seed
- `packages/runtime/src/settings-persistence.ts` — `persisted` from `databaseAdapter !== "memory"`

### Admin

- `apps/admin/src/actions/load-tenant-settings.ts` — operational read scope
- `apps/admin/src/lib/settings/css-sanitizers.ts` — re-export
- `apps/admin/src/components/settings-editor.tsx` — tabs + sanitize on save
- `apps/admin/src/components/settings/*` — tab components, save bar, spinner preview
- `apps/admin/src/lib/admin-i18n/types.ts`, `catalog-en.ts`, `catalog-de.ts` — new strings

### Web

- `apps/web/src/lib/load-public-page.ts` — `appearanceCss` via `buildPublicAppearanceCss`
- `apps/web/src/components/public-tenant-appearance-styles.tsx`
- `apps/web/src/components/public/PublicPageView.tsx` — inject sanitized CSS

### Docs

- `docs/architecture/settings-hardening-boundary-review.md`
- `docs/migration/settings-hardening-boundary-review-result.md` (this file)

## Scope fix

- `loadTenantSettingsAction` uses `resolveAdminOperationalReadScope`; loads with `scope.tenantId`.
- Settings page RSC already uses the same read scope.
- `updateTenantSettingsAction` unchanged: write-scoped via `resolveAdminWriteScope`.

## Sanitizers

Implemented in core (no full CSS parser): color, length, font family/weight/style, safe WOFF2 data URL with max length.

## Font hardening

- Client: 512 KB file cap, `data:font/woff2;base64,` prefix check before state update.
- Server: `sanitizeTenantAppearanceSettings` + `isSafeWoff2DataUrl` in `buildFontFaceCss`.
- UI prototype hint (DE/EN) in font tab.

## Persistence behavior

- Memory adapter → `persisted: false`, UI message `saveSuccessInMemory`.
- Non-memory adapter → `persisted: true`, UI message `saveSuccessPersisted`.

## Validation

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass (15/15 packages) |
| `npm run lint` | Pass (0 errors; 3 pre-existing admin warnings unrelated to settings) |
| `npm run build` | Pass (admin + web Next.js production build) |
| `npm run sprint:finish -- --phase settings-hardening-boundary-review` | Pass — ZIPs under `artifacts/phase-zips/` |

## Open follow-ups

- Wire spinner **visual** presets on public loader to `--sovereign-spinner-preset` (CSS classes/animations) if not already styled in public CSS.
- Replace WOFF2 data URLs with media/storage asset references (no upload engine in this phase).
- Supabase/postgres settings adapters: ensure `appearance` column/JSON path when those adapters leave stub state.
- Optional: `ThemePresetPreview` component if preset thumbnails are needed later.
