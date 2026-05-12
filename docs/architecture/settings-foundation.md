# Settings Foundation (Phase 43)

## Overview

`TenantSettings` bundles tenant-scoped site metadata for identity, contact, business notes, legal references, and social links. It prepares shared configuration for future header, footer, contact, and legal surfaces without migrating those layouts in this phase.

## Core types

Defined in `packages/core/src/settings.ts`:

- `SiteIdentitySettings` — site name, tagline, optional logo URL
- `ContactSettings` — email, phone, structured address fields
- `BusinessSettings` — optional visitor-facing notes (e.g. opening hours)
- `SocialLink` — id, label, href
- `LegalSettings` — responsible party and slug references (imprint, privacy, cookies)
- `TenantSettings` — full bundle per tenant with `updatedAt`
- `createDefaultTenantSettings(tenantId)` — baseline empty-ish defaults

Updates use `UpdateTenantSettingsInput` with a partial settings payload.

## Persistence contract

`packages/db/src/contracts.ts` defines `SettingsRepository`:

- `getByTenant({ tenantId })` — returns stored settings or creates defaults in-memory
- `update(input)` — shallow merge for nested objects; `socialLinks` replaced when provided

`DatabaseAdapter` includes `settings`.

## Runtime

`createSettingsPersistence({ db })` in `packages/runtime/src/settings-persistence.ts` exposes:

- `getTenantSettings`
- `updateTenantSettings` — returns `persisted: false` for InMemory

## Admin boundary

- Server actions: `load-tenant-settings.ts`, `update-tenant-settings.ts`
- Client adapter: `client-settings-persistence.ts` (delegates to actions only)
- Route: `/settings` with `SettingsEditor` client form

## InMemory behaviour

Demo tenant `demo` ships seeded settings (site identity, contact, legal slugs). All storage remains non-durable (`persisted=false`).

## Not in this phase

- Database-backed settings
- Footer/header/contact/legal page migration
- Upload/logo picker, RBAC, consent
