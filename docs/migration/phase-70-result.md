# Phase 70 — Tenant Enforcement & Scoped Runtime Foundation

## Summary

Phase 70 operationalizes **explicit tenant scope** for content reads and server-side runtime boundaries without RBAC UI, migrations, API routes, or admin guard changes.

---

## Delivered

### Tenant runtime scope

| Item | Location |
|------|----------|
| `TenantRuntimeScope` | `packages/runtime/src/tenant/scope.ts` |
| `assertTenantScope()` | Same — throws `TenantScopeError` if `tenantId` missing |
| `requireTenantRuntimeAccess()` | `packages/runtime/src/tenant/tenant-access-boundary.ts` |

### Adapter contract

- `ContentPersistenceAdapter` reads documented to require explicit `tenantId` (`packages/db/src/adapters/types.ts`)
- `requireAdapterTenantId()` — `packages/db/src/adapters/require-tenant-id.ts`

### Memory content adapter

- All read/write paths normalize `tenantId` via `requireAdapterTenantId`
- Delegates to in-memory repositories that already filter by `tenantId`

### Supabase content adapter

- Client filters `.eq("tenant_id", …)` on `pages` and `blocks` (unchanged from Phase 66, documented)
- Adapter post-map checks `page.tenantId` / `block.tenantId` match requested scope

### Runtime read paths

| Path | Change |
|------|--------|
| `public-page-resolution.ts` | `toPublicPageTenantScope()` + scoped `getPageBySlug` |
| `apps/web/src/lib/load-public-page.ts` | `assertTenantScope` once; all content/nav/settings use `tenantScope.tenantId` |
| `apps/admin/src/lib/load-admin-page-detail.ts` | `assertTenantScope` for content + navigation reads |

### Single-tenant fallback

- Documented in `resolveAdminTenant` (`packages/tenancy/src/admin-tenant-resolver.ts`)
- Public: host → `tenantResolver` (demo tenant on localhost)

### Documentation

- `docs/architecture/tenant-enforcement-runtime-phase-70.md` (new)
- Updates: persistence-65, authorization-68, tenant-user-mapping-69

---

## Intentionally not enforced

| Item | Reason |
|------|--------|
| `requireTenantRuntimeAccess` in admin | Open admin; no reliable session subject yet |
| Admin layout guards | Unchanged per hard rules |
| Auth provider / MFA | Unchanged |
| Membership persistence | Phase 69 contract only |
| Permission / tenant / user UI | Out of scope |
| DB migrations | Out of scope |
| API routes | Out of scope |

---

## Manual verification (no unit test framework in active packages)

1. **assertTenantScope:** In a Node REPL or temporary script, `assertTenantScope({ tenantId: "  demo  " })` → `{ tenantId: "demo" }`; empty `tenantId` throws `TenantScopeError`.
2. **Public web:** `npm run dev` in `apps/web`, open `http://localhost:3000/de` (or default locale path) — home/page still renders for demo tenant.
3. **Admin:** Open page editor for a known slug — page + blocks load as before.
4. **Cross-tenant memory:** With two tenants in store (future fixture), `getPageBySlug({ tenantId: "other", … })` must not return another tenant’s page (in-memory repo already enforces).
5. **Supabase (optional):** With `DATABASE_ADAPTER=supabase` and `tenant_id` columns, verify SQL logs include `tenant_id` filter.

---

## Validation results

| Command | Result |
|---------|--------|
| `npm run typecheck` | ✅ 15/15 packages |
| `npm run lint` | ✅ 0 errors (3 existing admin warnings) |
| `npm run build` | ✅ web + admin |

---

## Phase ZIP

Not run in this session. To produce artifacts:

```bash
npm run sprint:finish -- --phase 70
```
