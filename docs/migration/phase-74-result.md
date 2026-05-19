# Phase 74 — Tenant-Aware Operational Read Enforcement

## Summary

Operational (non-content) reads now require explicit `tenantId` at the adapter boundary where migrated. Public layout shell data and page content share the same tenant scope. Admin operational pages use centralized read scope resolution.

**Content reads/writes** were already scoped in Phases 70–72. **No** host/domain routing engine, DB migration, API route, or external dependency was added.

---

## Delivered

### Adapter contracts (`packages/db`)

- `getTenantSettings({ tenantId })`, `getBrandSettings({ tenantId, brand })`
- `listFooterNavigationItems` on navigation memory adapter + `FooterPersistenceAdapter` type
- `getMediaById`, `listFindings` on privacy adapter
- `assert-operational-read-tenant.ts` — `filterRowsByTenant`, `assertTenantOwnedSettings`, `findScanForTenant`

### Memory adapter read invariants

- Navigation, media, privacy: post-filter lists by `tenantId`
- Settings: ownership assert after load
- Media by id: `null` on mismatch

### Runtime

- `resolve-runtime-read-scope.ts`
- `read-authorization-boundary.ts` — `prepareOperationalRead` + permission map
- `public-navigation-resolution.ts` — uses `navigation` + `content` adapters (not raw `db`)
- `settings-persistence.ts` — params object + `getBrandSettings`
- `navigation-persistence.ts` — `listFooterNavigationItems`
- `privacy-scanner-persistence.ts` — `listPrivacyFindings`

### Admin app

- `resolve-admin-operational-read-scope.ts`
- Navigation, footer, settings, media, privacy pages use read scope
- `load-navigation-items` validates client vs server tenant
- `load-admin-page-detail` — navigation via persistence facade
- `load-admin-pages` / dashboard — content adapter for pages/blocks

### Documentation

- `docs/architecture/tenant-operational-read-enforcement-phase-74.md`

---

## Not implemented

- Supabase operational read adapters (memory-only path)
- Enforcement of `navigation:read` etc. against real sessions
- Brand settings separate persistence
- Governance DB persistence
- Automated tests (no test runner in `@sovereign-cms/db`)

---

## Manual verification

1. Single-tenant demo: public page, header nav, footer, settings unchanged visually.
2. Admin: navigation, footer nav, settings, media, privacy lists load for `demo` tenant.
3. `loadNavigationItemsAction` with wrong `tenantId` throws.
4. `npm run typecheck`, `npm run lint`, `npm run build` — see validation section below.

---

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck` | **15/15** packages passed |
| `npm run lint` | **0 errors** (3 pre-existing admin warnings) |
| `npm run build` | **web + admin** succeeded |
