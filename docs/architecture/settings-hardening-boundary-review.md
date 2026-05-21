# Settings Hardening — Boundary Review

Phase: settings hardening (pre–runtime/governance follow-up). **No** new settings engine, theme DSL, dynamic token runtime, or plugin registry.

## Tenant read / write boundary

| Surface | Authority | Mechanism |
|--------|-----------|-----------|
| Settings page (RSC) | Server | `resolveAdminOperationalReadScope({ operation: "settings:read" })` → `scope.tenantId` |
| `loadTenantSettingsAction` | Server | Same read scope; client `tenantId` only for mismatch detection |
| `updateTenantSettingsAction` | Server | `resolveAdminWriteScope({ operation: "settings:manage" })` |
| Settings editor client | Display | Receives `tenantId` from server page props; passes it to actions for correlation only |

**Anti-pattern:** Treating client-supplied `tenantId` as the source of truth for reads or writes.

## CSS sanitizing strategy (tightened)

Sanitizers live in `packages/core/src/settings-css-sanitizers.ts` (re-exported from admin `src/lib/settings/css-sanitizers.ts` for convenience).

- **Colors:** hex; `rgb`/`rgba`/`hsl`/`hsla` with channel range checks; conservative `oklch(...)`. No `calc()`, `var()`, `url()`, nested functions, or comments.
- **Lengths:** `0` or signed number + `px` | `rem` | `em` | `%` only. No `calc()`, `vh`/`vw`, or functions.
- **Validation helpers:** `isValidCssColorToken`, `isValidCssLengthToken`, `getInvalidThemeTokenFields` (admin inline hints).
- **Fonts:** family name, weight (100–900, normal, bold), style (normal, italic, oblique).
- **WOFF2 data URLs:** `isSafeWoff2DataUrl` — MIME prefix, base64 charset, max length.

CSS builders in `packages/core/src/settings-theme-css.ts` call `sanitizeTenantAppearanceSettings` before emitting strings. Admin preview and public injection both use these builders — **never** concatenate raw settings into CSS.

**Anti-pattern:** Admin settings values interpolated directly into `dangerouslySetInnerHTML` or style attributes without sanitization.

## Custom font data URL (temporary)

- Admin may attach `.woff2` as `data:font/woff2;base64,...` (client file size cap 512 KB).
- Persisted only after server-side `isSafeWoff2DataUrl` on save/sanitize.
- UI documents prototype status; production target is **media/storage asset reference**, not Base64 in tenant settings.

**Anti-pattern:** Long-term storage of Base64 fonts in tenant settings; treating data URLs as production storage.

## Visible admin validation

- **Theme tab:** invalid non-empty tokens show inline error (`themeTokenInvalid`); save does not block globally.
- **On save:** if invalid tokens were present, warning `themeTokensSanitizedOnSave` — unsafe values are stripped by `sanitizeTenantAppearanceSettings`.
- **Font upload:** wrong type, size > 512 KB, or read failure show per-font inline errors; prototype hint remains visible.

## Persistence semantics

`TenantSettingsSaveResult` from `SettingsRepository.update` / `SettingsPersistenceAdapter.updateTenantSettings`:

- **Memory adapter:** `{ settings, persisted: false }` after in-memory merge.
- **Supabase/Postgres placeholders:** still throw / not implemented → no fake `persisted: true` until a real write succeeds.

Runtime `createSettingsPersistence` forwards `saveResult.persisted` into `UpdateTenantSettingsResult` — **not** inferred from `DATABASE_ADAPTER` env alone.

Admin UI: `saveSuccessPersisted` vs `saveSuccessInMemory` from the concrete save outcome.

## Supabase/Postgres persistence foundation

- Canonical target table: `site_settings` (`tenant_id`, `locale`, `settings` JSONB) — see `docs/architecture/tenant-data-model.md`.
- SQL template: `docs/migration/sql/phase-settings-persistence-foundation.sql`.
- `TenantSettings.appearance` is stored inside `settings` JSON (no parallel theme engine table required for this phase).
- Reads/writes must use server-resolved `tenantId` (operational read / write scopes); RLS/auth not defined in this phase.

## Spinner contract

Central types in `packages/core/src/spinner-contract.ts`:

- `SPINNER_PRESET_KEYS`, `SPINNER_SPEED_KEYS`
- `normalizeSpinnerPreset` / `normalizeSpinnerSpeed`

Admin spinner tab and public CSS (`--sovereign-spinner-*`) share this contract.

## Settings editor structure

`settings-editor.tsx` orchestrates tab components:

- `GeneralSettingsTab`, `ThemeSettingsTab`, `FontSettingsTab`, `SpinnerSettingsTab`, `LegalSettingsTab`, `SocialSettingsTab`
- `SettingsSaveBar`, `SpinnerPreview`

Save path runs `sanitizeTenantAppearanceSettings` before persistence.

## Anti-patterns (do not introduce)

- Admin settings directly into CSS without sanitizers
- Base64 fonts as permanent tenant settings storage
- Client `tenantId` as authority
- Theme token DSL or dynamic theme runtime engine
- Settings plugin registry
- Full CSS parser / arbitrary CSS values in admin fields

## Target architecture (fonts, later)

Replace `woff2DataUrl` on `TenantCustomFont` with a governed media/storage asset reference resolved at runtime composition time (aligned with media phases 75–77).
