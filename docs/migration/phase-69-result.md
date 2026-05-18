# Phase 69 — Tenant User Mapping Persistence Design: Result

## Summary

Phase 69 defined provider-neutral tenant membership types, a persistence adapter contract, target database model documentation, and draft SQL (docs only). No user/role UI, no API routes, no executable migrations, and no auth guard wiring.

---

## What was added

### Core (`packages/core/src/tenant-access.ts`)

- `TenantUserStatus`, `TenantUserMembership`, `TenantUserMembershipInput`
- `isActiveTenantMembership()` helper
- Exported from `@sovereign-cms/core`

### DB contract (`packages/db/src/adapters/types.ts`)

- `TenantAccessPersistenceAdapter` with five explicit methods
- Added to `SovereignPersistenceAdapters` aggregate (documentation)
- Exported from `@sovereign-cms/db`

### Runtime (pure)

- `packages/runtime/src/auth/membership-subject-builder.ts`
- `buildAuthorizationSubjectFromMemberships(user, memberships, options?)`
- Exported from `@sovereign-cms/runtime`
- **Not wired** to admin guards or session resolution

### Documentation

- `docs/architecture/tenant-user-mapping-phase-69.md`
- `docs/db/drafts/tenant-user-memberships.sql` (DRAFT)

---

## Subject-building strategy (summary)

`AuthenticatedUser` + active `TenantUserMembership[]` → `buildAuthorizationSubjectFromMemberships` → `AuthorizationSubject` → existing `requireTenantPermission` helpers.

Membership persistence is the intended source of tenant roles; auth provider handles identity only.

---

## What was not implemented

| Item | Status |
|------|--------|
| In-memory / Supabase membership adapter | Not started |
| Database migration in app | Not added |
| Admin guard enforcement | Unchanged |
| User/role/invitation UI | Not added |
| API routes | Not added |
| SCIM / claim sync | Not designed in code |

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run typecheck` | ✅ 15/15 packages, 0 errors |
| `npm run lint` | ✅ 0 errors (3 pre-existing admin warnings) |
| `npm run build` | ✅ web + admin |

---

## Acceptance criteria — status

| # | Criterion | Status |
|---|-----------|--------|
| 1–3 | Membership types + status | ✅ |
| 4 | TenantAccessPersistenceAdapter | ✅ |
| 5 | No generic CRUD | ✅ |
| 6–8 | Docs + draft SQL only | ✅ |
| 9–10 | Subject strategy + pure builder | ✅ |
| 11–19 | No UI/API/deps/behavior change | ✅ |
| 20 | Validation documented | ✅ (after run) |
