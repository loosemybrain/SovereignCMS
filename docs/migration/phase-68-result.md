# Phase 68 — Authorization & Tenant Access Foundation: Result

## Summary

Phase 68 added provider-neutral authorization types, pure tenant/permission helpers, and a server-side authorization boundary. No permission UI, no user/role management, no database migrations, and no changes to auth, MFA, admin guards, editor, or public rendering.

---

## What was added

### Core (`packages/core/src/authorization.ts`)

- Types: `SovereignRole`, `SovereignPermission`, `TenantAccess`, `AuthorizationSubject`
- `TenantId` re-exported from `cms` (single source of truth)
- Pure helpers: `hasTenantRole`, `hasTenantPermission`, `canAccessTenant`
- Static role → permission map (`owner`, `admin`, `editor`, `viewer`)
- `AuthorizationError`

Exported from `@sovereign-cms/core`.

### Runtime (`packages/runtime/src/auth`)

- `authorization-boundary.ts` — `requireTenantAccess`, `requireTenantPermission`, `assertTenantPermission`
- `auth-subject-mapper.ts` — `toAuthorizationSubject*`, `createLocalOpenAdminSubject` (documented, not wired)

Exported from `@sovereign-cms/runtime`.

### Documentation

- `docs/architecture/authorization-tenant-access-phase-68.md`
- Admin permission matrix and public-sector requirements

---

## Intentionally not wired

| Location | Reason |
|----------|--------|
| `apps/admin` layout | Open admin today; `requireTenantAccess` would deny anonymous subjects |
| Server actions | No stable authenticated subject yet |
| Public web | No authorization required for public pages |

`createLocalOpenAdminSubject` exists for future local composition only.

---

## Current limitations

- No persistent tenant-user role store
- `AuthUser.roles` strings are not auto-mapped to `SovereignRole`
- `isPlatformAdmin` is opt-in on the subject, not derived from env
- Enforcement matrix documented but not applied

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
| 1–8 | Types + pure helpers | ✅ |
| 9 | Server-side boundary | ✅ |
| 10–11 | Core provider-free | ✅ |
| 12–17 | No UI/migrations/APIs/deps | ✅ |
| 18–21 | Behavior unchanged | ✅ |
| 22–23 | Docs + matrix | ✅ |
| 24 | Validation documented | ✅ (after run) |
