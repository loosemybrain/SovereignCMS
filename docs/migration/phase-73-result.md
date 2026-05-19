# Phase 73 — Tenant Runtime Resolution & Routing Foundation

## Summary

Centralized, pure tenant resolution helpers for public, admin, and preview flows. Default tenant id is configured via `LOCAL_TENANT_ID` or seed constant — not scattered in apps.

---

## Delivered

### Types & helpers (`packages/runtime/src/tenant/`)

| Item | File |
|------|------|
| `ResolvedTenantContext`, `TenantResolutionSource` | `resolution.ts` |
| `createResolvedTenantContext`, `toTenantRuntimeScope` | `resolution.ts` |
| `getDefaultTenantId` | `default-tenant.ts` |
| `resolvePublicTenantContext` | `public-tenant-resolution.ts` |
| `resolveAdminTenantContext` | `admin-tenant-resolution.ts` |
| `resolvePreviewTenantContext` | `preview-tenant-resolution.ts` |

### Tenancy

- `readConfiguredTenantId`, `SOVEREIGN_DEFAULT_TENANT_ID` in `packages/tenancy/src/default-tenant-id.ts`
- `resolveAdminTenant` uses configured default instead of hardcoded literals

### Wired paths

| Path | Change |
|------|--------|
| `apps/web/src/lib/load-public-page.ts` | Public resolver + DB host merge; `toTenantRuntimeScope` |
| `packages/runtime/src/public-page-resolution.ts` | Uses `toTenantRuntimeScope` |
| `apps/admin/src/lib/get-admin-runtime.ts` | Returns `resolved` context |
| `apps/admin/src/lib/load-admin-page-detail.ts` | Admin vs preview resolver |
| `apps/admin/src/lib/resolve-admin-write-scope.ts` | Uses `resolved` from `getAdminRuntime` |

---

## Not implemented

- Custom domains / DNS
- Tenant selector UI
- Dynamic routing engine
- Middleware
- Host-based resolution in sync public helper (DB path preserved separately)
- New URL route segments for tenant (optional `routeTenant` param only)

---

## Manual verification

1. Public `localhost` — home page loads (demo tenant via DB host map).
2. Admin editor — page load and save unchanged.
3. `LOCAL_TENANT_ID=my-tenant` — admin uses that id (if data existed).
4. Unknown host (no DB row) — still 404 on public site.

---

## Validation results

| Command | Result |
|---------|--------|
| `npm run typecheck` | ✅ 15/15 |
| `npm run lint` | ✅ 0 Fehler (3 bestehende Admin-Warnungen) |
| `npm run build` | ✅ web + admin |

---

## Phase ZIP

```bash
npm run sprint:finish -- --phase 73
```
