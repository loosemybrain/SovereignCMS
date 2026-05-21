# Settings Persistence Runtime Foundation (Phase 91)

## Persistence goal

Tenant settings (`TenantSettings`) must load and save through explicit runtime adapters with honest outcomes — not inferred from env vars alone.

## Modes

| Mode | `persisted` | `persistenceMode` | When |
|------|-------------|-------------------|------|
| Memory | `false` | `memory` | `DATABASE_ADAPTER=memory` (in-memory map) |
| Database | `true` | `database` | Supabase upsert to `tenant_settings` succeeded |
| Unavailable | `false` | `unavailable` | Table missing, SDK/config missing, postgres stub |

Optional `warning` on save when unavailable (technical message; no fake success).

## Contract

`TenantSettingsPersistenceResult` in `packages/core/src/settings.ts`:

```ts
{
  settings: TenantSettings
  persisted: boolean
  persistenceMode: "memory" | "database" | "unavailable"
  warning?: string
}
```

Runtime `updateTenantSettings` forwards this into `UpdateTenantSettingsResult`.

## Tenant read / write boundary

- Admin/public reads: server-resolved `tenantId` via operational read scope / public tenant resolution.
- Writes: `resolveAdminWriteScope` → adapter `requireScopedContentTenantId`.
- Client `tenantId` is correlation only, not authority.

## DB target model

Table: `public.tenant_settings` (one row per tenant).

- `tenant_id` (PK)
- `settings_json` (JSONB — `TenantSettings` without `tenantId`)
- `updated_at`
- `updated_by` (optional, reserved)

SQL: `docs/migration/sql/phase-91-settings-persistence-runtime-foundation.sql`

`site_settings` (locale-scoped) remains documented for future locale-specific site config; Phase 91 uses tenant-wide settings aligned with current `TenantSettings`.

## Adapter behavior

| Layer | Role |
|-------|------|
| `packages/core/settings-normalize.ts` | Merge patch, normalize JSON, storage payload |
| `packages/db/adapters/supabase/settings-adapter.ts` | Provider-neutral Supabase settings adapter |
| `adapters/supabase/settings-client.ts` | Supabase SDK (server-only) |
| `packages/runtime/settings-adapter-resolution.ts` | `memory` / `supabase` / `postgres-unavailable` |

Supabase reads: row → `normalizeTenantSettingsFromStorage`; missing row → defaults.

Supabase reads when table/SDK unavailable: **defaults** (public-safe, no throw).

Supabase writes when unavailable: merge in-process + `persistenceMode: unavailable` + `warning` (no fake DB success).

## Public runtime loading

`apps/web/src/lib/load-public-page.ts` → `runtime.settingsPersistence.getTenantSettings({ tenantId })` with server-resolved tenant scope.

Uses the same adapter resolution as admin — not admin-only memory state.

When DB unavailable: defaults only; no user-facing error on public pages.

## Admin feedback

- `database` + `persisted`: durable save message
- `memory`: temporary memory message
- `unavailable`: warning alert + technical `warning` text

## Custom font prototype boundary

`appearance.customFonts[].woff2DataUrl` may appear in `settings_json` temporarily.

- Sanitized on read/write via `sanitizeTenantAppearanceSettings`
- **Not** the long-term storage strategy
- Target: media/storage asset reference (no upload engine in Phase 91)

## Anti-patterns

- Fake persistence success (`persisted: true` without DB write)
- Client `tenantId` as authority
- Settings registry / theme DSL / dynamic token runtime
- Supabase SDK in `packages/core` or public renderers
- Base64 fonts as final architecture
- Global settings React context API
