# Authorization & Tenant Access Foundation — Phase 68

## Purpose

Phase 68 introduces a **small, provider-neutral authorization foundation** for SovereignCMS: tenant-scoped roles, explicit permissions, pure evaluation helpers, and a server-side boundary — without a generic RBAC engine, ABAC DSL, or permission UI.

Authentication (who you are) remains separate from authorization (what you may do), per Phase 67.

---

## Current authorization reality (before broad enforcement)

| Topic | Status |
|-------|--------|
| Admin login / MFA | Not enforced in active `apps/admin` (`AUTH_ADAPTER=none`) |
| Admin layout guard | Open — no redirect |
| Server actions | No permission checks |
| Tenant resolution | `resolveAdminTenant` / host-based demo tenant |
| Legacy physio | DB RPC `is_admin` + Supabase MFA — reference only |

**Implication:** Phase 68 adds **contracts and helpers**; enforcement in apps is a later phase (70+).

---

## Model overview

```
Authentication (Phase 67)     Authorization (Phase 68)
─────────────────────────     ─────────────────────────
AuthUser / AuthSession   →    AuthorizationSubject
(provider adapters)           (tenantAccess + roles)
                              ↓
                         hasTenantPermission (pure)
                              ↓
                         requireTenantPermission (server)
```

This is **not** a full RBAC product:

- No dynamic rules or policy UI
- No user/role management screens
- No permission inheritance engine beyond a static role → permission map
- No provider claim parsing in core

---

## Types (`packages/core/src/authorization.ts`)

| Type | Role |
|------|------|
| `TenantId` | Re-exported alias of `cms.TenantId` |
| `SovereignRole` | `owner` \| `admin` \| `editor` \| `viewer` |
| `SovereignPermission` | Small fixed vocabulary (tenant, page, media, navigation, settings, privacy, governance) |
| `TenantAccess` | Roles (+ optional explicit permissions) for one tenant |
| `AuthorizationSubject` | `userId`, optional `email`, `isPlatformAdmin`, `tenantAccess[]` |

`isPlatformAdmin` grants all permissions on all tenants (platform operator semantics).

Explicit `permissions[]` on `TenantAccess` override/extend role grants when present.

---

## Role → permission map (static, explicit)

| Role | Permissions |
|------|-------------|
| **owner** | All `SovereignPermission` values |
| **admin** | All except `tenant:manage` (ownership reserved for owner) |
| **editor** | `page:*` (read/create/update/publish), `media:read`, `media:manage`, `navigation:read`, `governance:read` |
| **viewer** | `tenant:read`, `page:read`, `media:read`, `navigation:read`, `settings:read`, `governance:read` |

### Pure helpers

- `hasTenantRole(subject, tenantId, role)`
- `hasTenantPermission(subject, tenantId, permission)`
- `canAccessTenant(subject, tenantId)`
- `AuthorizationError` — thrown by server boundary helpers

All helpers are **synchronous**, no I/O.

---

## Server-side boundary (`packages/runtime/src/auth`)

| Module | Responsibility |
|--------|----------------|
| `authorization-boundary.ts` | `requireTenantAccess`, `requireTenantPermission`, `assertTenantPermission` |
| `auth-subject-mapper.ts` | Map `AuthUser` / `AuthenticatedUser` → `AuthorizationSubject` |

### Mapper limitations (honest)

- Does **not** map arbitrary OIDC/SAML/Supabase claim keys to `SovereignRole`.
- `AuthUser.roles` (`RoleId` strings) are **not** auto-converted — callers must pass explicit `tenantRoles` when known.
- `createLocalOpenAdminSubject(tenantId)` documents open local admin (`isPlatformAdmin: true`) — **not wired** in apps by default.

---

## Admin area permission matrix

| Area | Suggested permission(s) | Current enforcement | Future enforcement | Risk |
|------|-------------------------|---------------------|--------------------|------|
| Dashboard | `tenant:read` | None (open) | `requireTenantPermission` | Medium |
| Pages list / editor | `page:read`, `page:update`, `page:publish` | None | Per action | High |
| Media | `media:read`, `media:manage` | None | Per action | Medium |
| Navigation | `navigation:manage` | None | Per action | Medium |
| Footer navigation | `navigation:manage` | None | Per action | Low |
| Settings | `settings:manage` | None | Per action | High |
| Privacy scanner | `privacy:manage` | None | Per action | High |
| Governance panels | `governance:read` | None | Read-only check | Low |
| User management (future) | `tenant:manage` | N/A | Owner/admin | High |
| Tenant management (future) | `tenant:manage` | N/A | Platform admin | High |

---

## Public-sector / enterprise requirements

| Requirement | How Phase 68 supports it |
|-------------|---------------------------|
| Provider-neutral roles | `SovereignRole` / `SovereignPermission` in core — no Supabase/Entra types |
| Tenant isolation | All checks are `(subject, tenantId, …)` |
| Auditable decisions | Pure functions + explicit static map (testable) |
| Agency/customer mapping | Future: map IdP groups → `TenantAccess` in adapter layer, not core |
| Separation auth vs authz | Phase 67 auth boundary + Phase 68 authorization boundary |
| No permission UI yet | Intentionally deferred |
| Least privilege | `viewer` / `editor` roles with minimal grants |

### Provider claim mapping strategy (future)

1. Identity adapter resolves session → `AuthorizationSubject`.
2. Mapping table per deployment (e.g. `entra_group_xyz` → `{ tenantId, roles: ['editor'] }`).
3. Core helpers unchanged.

---

## Why this is not a full RBAC engine

- Fixed permission enum — new capabilities require code changes (intentional).
- Static role map — no runtime rule editor.
- No resource-instance ACLs (e.g. per-page) in this phase.
- No delegation, approval workflows, or attribute-based conditions.

Sufficient for **foundation** and **gradual enforcement**; enterprise ABAC belongs in a separate product decision.

---

## Future tenant-user mapping needs

Persistent store (future phase) likely needs:

- `(user_id, tenant_id, role)` rows or IdP group bindings
- Optional direct `permissions[]` overrides
- Platform admin flag separate from tenant owner

Not implemented in Phase 68 (no migrations).

---

## Recommended future phases

| Phase | Focus |
|-------|--------|
| **69** | Tenant user mapping persistence design |
| **70** | Admin guard uses authorization boundary |
| **71** | Role/permission UI readiness |
| **72** | Provider claim mapping strategy |
| **73** | Public-sector identity integration spike |

---

## Wiring status (Phase 68)

| Item | Wired? |
|------|--------|
| Core types + helpers | Yes |
| Runtime boundary + mapper | Yes (library only) |
| Admin layout / server actions | **No** — would lock open admin if misapplied |
| Public web | No |

---

## Phase 70 update (tenant runtime scope)

| Topic | Status |
|-------|--------|
| `TenantRuntimeScope` + `assertTenantScope` | Added in `packages/runtime/src/tenant/scope.ts` |
| `requireTenantRuntimeAccess(subject, scope)` | Added — combines scope validation + `canAccessTenant` |
| Content reads | Require explicit `tenantId` at adapter boundary |
| Admin guards | **Unchanged** — membership-backed enforcement deferred |
| Membership → subject | Phase 69 contract; will supply admin tenant access when wired |

See [tenant-enforcement-runtime-phase-70.md](./tenant-enforcement-runtime-phase-70.md).

---

## Related documentation

- [auth-boundary-audit-phase-67.md](./auth-boundary-audit-phase-67.md)
- [persistence-boundary-phase-66.md](./persistence-boundary-phase-66.md)
- [tenant-enforcement-runtime-phase-70.md](./tenant-enforcement-runtime-phase-70.md)
