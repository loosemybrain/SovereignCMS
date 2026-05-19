# Tenant Runtime Resolution & Routing Foundation — Phase 73

## Purpose

Phases 70–72 scoped reads and writes by `tenantId`. Phase 73 defines **how tenant context enters the runtime** in a predictable, auditable, provider-neutral way — without a SaaS routing engine, domain UI, or middleware.

---

## Core types (`packages/runtime/src/tenant/resolution.ts`)

| Type | Role |
|------|------|
| `TenantResolutionSource` | `explicit` \| `host` \| `route` \| `default` \| `admin-selection` \| `preview` |
| `ResolvedTenantContext` | `tenantId`, `source`, optional `host`, `routeTenant`, `locale`, `brand` |
| `createResolvedTenantContext()` | Validates non-empty `tenantId` |
| `toTenantRuntimeScope()` | Maps to `TenantRuntimeScope` via `assertTenantScope` |

Pure helpers — no DB, no network, no request-global state.

---

## Default tenant (`getDefaultTenantId`)

| Layer | Location |
|-------|----------|
| Config read | `packages/tenancy/src/default-tenant-id.ts` — `readConfiguredTenantId`, `SOVEREIGN_DEFAULT_TENANT_ID` |
| Runtime export | `packages/runtime/src/tenant/default-tenant.ts` — `getDefaultTenantId()` |

Order:

1. `LOCAL_TENANT_ID` environment variable (server-side)
2. `SOVEREIGN_DEFAULT_TENANT_ID` (`demo` — aligned with in-memory seed data)

No scattered `"demo"` literals in apps. Legacy `resolveAdminTenant` uses the same configured id.

---

## Resolution strategies

### Public — `resolvePublicTenantContext` (sync)

1. If `routeTenant` → source `route`
2. Else → `getDefaultTenantId()`, source `default`
3. `host` is **recorded** only (future domain mapping)

**Wired in:** `apps/web/src/lib/load-public-page.ts`

- Still calls `tenantResolver.resolveByHost(host)` for `TenantContext` metadata (DB domain table in memory mode)
- Unknown host without `routeTenant` → **404** (unchanged)
- Known host or route tenant → `toTenantRuntimeScope(resolved)` for scoped reads

### Admin — `resolveAdminTenantContext` (sync)

1. `explicitTenantId` (e.g. `LOCAL_TENANT_ID`)
2. `selectedTenantId` (from legacy admin resolver)
3. `getDefaultTenantId()`, source `default`

**Wired in:** `getAdminRuntime`, `load-admin-page-detail`, `resolveAdminWriteScope`

No tenant selector UI. No membership lookup. No authorization here.

### Preview — `resolvePreviewTenantContext` (sync)

1. `tenantId` from editor/page context → source `preview`
2. Else default tenant (temporary fallback for open admin)

**Wired in:** `load-admin-page-detail` when `?preview=1` or `?preview=true`

---

## Resolution order (current)

```
Public request
  → resolvePublicTenantContext (sync baseline)
  → tenantResolver.resolveByHost (async, in-memory domain table)
  → merge → ResolvedTenantContext → TenantRuntimeScope → content/navigation/settings reads

Admin request
  → resolveAdminTenant (legacy env/host)
  → resolveAdminTenantContext
  → TenantRuntimeScope on load/save

Preview request (admin)
  → resolvePreviewTenantContext(tenantId from admin context)
```

---

## Why host is not dynamically resolved yet

| Today | Future |
|-------|--------|
| `host` stored on `ResolvedTenantContext` | `tenants` / `tenant_domains` table |
| In-memory `findByDomain(localhost)` → demo | Custom domain onboarding |
| No wildcard DNS engine | Edge routing + RLS per tenant |
| No middleware tenant injection | Optional header `X-Tenant-Id` for gateways |

---

## Routing matrix

| Scenario | Tenant source | Required data | Current | Future | Risk | Notes |
|----------|---------------|---------------|---------|--------|------|-------|
| Public single-tenant site | `default` + DB host map | `LOCAL_TENANT_ID` optional | ✅ | ✅ | Low | localhost → demo in memory |
| Public multi-tenant route-based | `route` | URL segment / query `tenant` | Partial | ✅ | Medium | `routeTenant` param ready, routes not added |
| Public custom-domain site | `host` (DB) | Domain row | Partial | ✅ | High | DB lookup exists; no DNS product |
| Admin single-tenant | `explicit` / `default` | env + legacy resolver | ✅ | ✅ | Low | Open admin |
| Admin multi-tenant | `admin-selection` | Session memberships | Partial | ✅ | High | No selector UI yet |
| Preview / editor | `preview` | Page `tenantId` | ✅ | ✅ | Low | Query `preview=1` on admin load |

---

## Intentionally not included

- Dynamic tenant routing engine
- Tenant / domain management UI
- DNS automation
- API routes / middleware
- DB migrations
- Auth/MFA changes
- Request-global mutable tenant context

---

## Phase 76 — Media resolution uses tenant scope

Public page load passes **`tenantScope.tenantId`** from Phase 73 resolution into `resolveMediaReference` / `enrichPublicBlocksMedia`. No separate tenant fallback for media.

See [media-reference-resolution-phase-76.md](./media-reference-resolution-phase-76.md).

---

## Related documentation

- [tenant-enforcement-runtime-phase-70.md](./tenant-enforcement-runtime-phase-70.md)
- [scoped-write-enforcement-phase-71.md](./scoped-write-enforcement-phase-71.md)
- [scoped-non-content-writes-phase-72.md](./scoped-non-content-writes-phase-72.md)
- [media-reference-resolution-phase-76.md](./media-reference-resolution-phase-76.md)
