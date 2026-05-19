# Tenant Enforcement & Scoped Runtime Foundation — Phase 70

## Purpose

Phase 70 makes **tenant boundaries operational** in runtime and content persistence reads without building a full RBAC/ABAC engine, permission UI, or membership enforcement in the open admin app.

Goals:

- Explicit `TenantRuntimeScope` on server-side reads
- Adapter contracts that require `tenantId` (no silent default tenant inside adapters)
- Supabase/memory adapters filter or validate by tenant
- Hook point for future admin authorization (`requireTenantRuntimeAccess`)
- Public vs admin separation preserved

---

## Tenant runtime scope

**Type:** `packages/runtime/src/tenant/scope.ts`

```ts
export type TenantRuntimeScope = {
  tenantId: string
  locale?: string
  brand?: string
}
```

**Helper:** `assertTenantScope(scope)` — trims `tenantId`, throws `TenantScopeError` if missing. No DB, no provider logic.

Scope is built **once per request** at composition boundaries (loaders), then passed into content/navigation/settings calls.

---

## Where tenant scope enters runtime

| Surface | Resolution | Scope construction |
|---------|------------|-------------------|
| **Public web** | `resolvePublicTenantContext` + `tenantResolver.resolveByHost` (Phase 73) | `toTenantRuntimeScope(resolved)` in `load-public-page.ts` |
| **Admin** | `resolveAdminTenantContext` (Phase 73) | `toTenantRuntimeScope` in loaders / write scope |
| **Public page resolution** | Caller supplies `tenantId` + `locale` | `toPublicPageTenantScope()` → `toTenantRuntimeScope` |

### Single-tenant fallback (centralized)

| App | Mechanism |
|-----|-----------|
| Public | `getDefaultTenantId()` / DB host map on `localhost` |
| Admin | `LOCAL_TENANT_ID` → `getDefaultTenantId()` via `resolveAdminTenantContext` |

See [tenant-runtime-resolution-phase-73.md](./tenant-runtime-resolution-phase-73.md). Default id constant: `SOVEREIGN_DEFAULT_TENANT_ID` in `@sovereign-cms/tenancy` (aligned with in-memory seed).

---

## Content adapter contract (Phase 70)

`ContentPersistenceAdapter` read methods require explicit `tenantId`:

- `listPages({ tenantId, locale? })`
- `getPageById({ tenantId, pageId })`
- `getPageBySlug({ tenantId, locale, slug })`
- `listBlocks({ tenantId, pageId })`

Adapters use `requireAdapterTenantId()` (`packages/db/src/adapters/require-tenant-id.ts`) — throws `PersistenceAdapterError` if empty.

**Rule:** Default/fallback tenant resolution happens only in **tenancy loaders**, not inside adapter methods.

---

## Adapter enforcement

### Memory (`createContentAdapterFromDatabase`)

Delegates to `DatabaseAdapter` repositories that already filter by `tenantId` on pages/blocks. Adapter layer normalizes and rejects empty `tenantId`.

### Supabase (`createSupabaseContentAdapter` + `content-client.ts`)

- SQL filters: `.eq("tenant_id", input.tenantId)` on `pages` and `blocks`
- Post-map validation: row `tenant_id` must match requested scope (defense in depth)

**Schema assumption:** sovereign-aligned tables include `tenant_id` on `pages` and `blocks`. Legacy physio tables without `tenant_id` are **not** supported by this port — deployments must migrate before enabling `DATABASE_ADAPTER=supabase`.

**RLS:** This phase does not change RLS policies or introduce service-role bypass beyond existing Phase 66 client factory behavior.

---

## Server-side tenant access hook

`requireTenantRuntimeAccess(subject, scope)` in `packages/runtime/src/tenant/tenant-access-boundary.ts`:

1. `assertTenantScope(scope)`
2. `canAccessTenant(subject, scope.tenantId)` — Phase 68 pure helper
3. Throws `AuthorizationError` if denied

**Not wired** into admin loaders or guards in Phase 70 — open admin would break. Intended for future phases when `AuthorizationSubject` is built from `TenantAccessPersistenceAdapter` + session.

Related (Phase 68): `requireTenantAccess(subject, tenantId)` — same check without scope object.

---

## Public vs admin enforcement strategy

| Concern | Public | Admin |
|---------|--------|-------|
| Tenant resolution | Host → tenant record | Host/env → `resolveAdminTenant` |
| Content reads | Scoped `tenantId` + visibility (`isPubliclyVisible`) | Scoped `tenantId`; no status filter on editor load |
| Authorization | None (public content only) | **Not enforced** yet (open admin) |
| Client Components | No `RuntimeConfig`, no auth/DB clients | Unchanged |

Public rendering behavior is **compatible**: same tenant resolution and visibility rules; only explicit scope validation was added on the server path.

---

## Future multi-tenant routing

1. Expand `db.tenants` / DNS mapping for production hosts
2. Admin: session user → `listMembershipsForUser` → `buildAuthorizationSubjectFromMemberships`
3. Call `requireTenantRuntimeAccess` in server loaders/actions before content writes
4. Optional subdomain or path prefix for tenant selection in admin

No dynamic policy engine — static permissions + explicit tenant scope only.

---

## Limitations (honest)

| Limitation | Notes |
|------------|--------|
| Admin not authorized | `requireTenantRuntimeAccess` exists but is not called in apps |
| Navigation/settings | Still use `runtime.db.*` in some paths; tenant id passed explicitly where updated |
| Legacy Supabase schema | Without `tenant_id`, content adapter cannot isolate tenants |
| No migrations in Phase 70 | Draft SQL for memberships unchanged |
| Membership adapter | Not wired at runtime |

---

## Why no dynamic policy engine

Enterprise ABAC/RBAC products need rule stores, UI, and audit pipelines. SovereignCMS defers that in favor of:

- Explicit tenant id on every content read
- Static role → permission map (Phase 68)
- Membership rows as future source of admin tenant access (Phase 69)

---

## Phase 73 update (tenant resolution)

Tenant resolution is centralized in `packages/runtime/src/tenant/*-tenant-resolution.ts`. Host/custom-domain routing remains a future phase — no dynamic routing engine.

---

## Phase 71 follow-up (scoped writes)

Content **writes** (create page, status transition, block save) are tenant-scoped in Phase 71. See [scoped-write-enforcement-phase-71.md](./scoped-write-enforcement-phase-71.md).

---

## Related documentation

- [scoped-write-enforcement-phase-71.md](./scoped-write-enforcement-phase-71.md)
- [persistence-boundary-phase-66.md](./persistence-boundary-phase-66.md)
- [authorization-tenant-access-phase-68.md](./authorization-tenant-access-phase-68.md)
- [tenant-user-mapping-phase-69.md](./tenant-user-mapping-phase-69.md)
- [persistence-adapter-readiness-phase-65.md](./persistence-adapter-readiness-phase-65.md)
