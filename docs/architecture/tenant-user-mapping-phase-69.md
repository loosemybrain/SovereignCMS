# Tenant User Mapping — Phase 69

## Purpose

Phase 69 designs how **authenticated users** are mapped to **tenants**, **roles**, and optional **permissions** in persistent storage — without user-management UI, invitation flows, or a generic RBAC engine.

Authentication (Phase 67) answers who the user is. Authorization helpers (Phase 68) answer what they may do. This phase answers **where membership is stored** and how it feeds `AuthorizationSubject`.

---

## Core types (`packages/core/src/tenant-access.ts`)

| Type | Role |
|------|------|
| `TenantUserStatus` | `active` \| `invited` \| `disabled` |
| `TenantUserMembership` | Persisted row shape (provider-neutral) |
| `TenantUserMembershipInput` | Upsert input (no `id` required) |

Reuses `TenantId`, `SovereignRole`, `SovereignPermission` from `authorization.ts`.

### Field semantics

| Field | Notes |
|-------|--------|
| `userId` | Stable identity subject id from auth provider (UUID/sub). Not an email. |
| `email` / `displayName` | Denormalized convenience for admin lists; not authoritative for auth |
| `roles` | Controlled enum values only — stored as list in DB |
| `permissions` | Optional explicit overrides; empty = role map only |
| `status` | `invited` = record exists, no access; `disabled` = revoked; `active` = participates in authz |

---

## Persistence adapter contract

`TenantAccessPersistenceAdapter` in `packages/db/src/adapters/types.ts`:

| Method | Purpose |
|--------|---------|
| `listMembershipsForTenant` | Admin tenant user list (future) |
| `listMembershipsForUser` | Build subject for session user |
| `getMembership` | Single membership lookup |
| `upsertMembership` | Create or update roles/permissions/metadata |
| `disableMembership` | Soft revoke (`status = disabled`) |

**Not implemented** in Phase 69 — contract only. No in-memory adapter yet.

---

## Target database model

### Table: `tenant_user_memberships`

| Column | Type (Postgres draft) | Notes |
|--------|----------------------|--------|
| `id` | `uuid` PK | Surrogate key |
| `tenant_id` | `text` NOT NULL | FK to tenant registry (future) |
| `user_id` | `text` NOT NULL | Auth provider subject |
| `email` | `text` | Denormalized |
| `display_name` | `text` | Denormalized |
| `roles` | `text[]` NOT NULL | Sovereign role strings |
| `permissions` | `text[]` | Optional overrides |
| `status` | `text` NOT NULL | Check constraint on enum values |
| `created_at` | `timestamptz` | Audit |
| `updated_at` | `timestamptz` | Audit |

**Unique:** `(tenant_id, user_id)`

### Optional future table: `provider_identity_links`

For multi-provider or subject migration:

| Column | Purpose |
|--------|---------|
| `user_id` | Canonical Sovereign subject id |
| `provider` | e.g. `supabase`, `keycloak`, `entra` |
| `provider_subject` | External subject id |
| `created_at` | Audit |

Not required for initial Supabase-only deployments where `user_id` = `auth.users.id`.

---

## Roles and permissions in storage

- **Roles:** Stored as text array of known `SovereignRole` values. Adapter validates on write (future).
- **Permissions:** Optional sparse override list. Most users rely on role → permission map in core.
- **No provider claims** stored in membership row by default (avoids lock-in and stale JWT data).

---

## Subject-building strategy

```
┌─────────────────┐     ┌──────────────────────────┐
│ Auth provider   │     │ tenant_user_memberships   │
│ (session/user)  │     │ (TenantAccessPersistence) │
└────────┬────────┘     └────────────┬─────────────┘
         │                           │
         ▼                           ▼
   AuthenticatedUser          TenantUserMembership[]
         │                           │
         └───────────┬───────────────┘
                     ▼
      buildAuthorizationSubjectFromMemberships()
                     ▼
           AuthorizationSubject
                     ▼
      requireTenantPermission() (server)
```

Rules:

1. **Auth provider** authenticates identity only.
2. **Membership persistence** is the source of tenant roles (not JWT custom claims alone).
3. **`isPlatformAdmin`** is a separate flag (env/DB/platform table) — narrow use, not every admin user.
4. **Invited/disabled** memberships are excluded from `tenantAccess` when building subjects.
5. Provider claim mapping may **seed** memberships in a future sync job — not the only source of truth.

Pure builder: `packages/runtime/src/auth/membership-subject-builder.ts` — not wired to guards in Phase 69.

---

## Public-sector implications

| Requirement | Design response |
|-------------|-----------------|
| Auditable membership | `created_at` / `updated_at`; future audit log table |
| Explicit roles | Enum in DB + core validation |
| No provider lock-in | `user_id` as opaque string; links table optional |
| Stable subject ids | Document IdP subject stability requirements |
| Transparent mapping | Membership rows inspectable in DB/admin (future UI) |
| Server enforcement | Subject built server-side; UI hides actions only as UX |
| Separation of duties | `owner` vs `admin` vs `editor` vs `viewer` |

---

## Intentionally not included (Phase 69)

- Invitation workflow
- Email verification / sending
- User management UI
- Role management UI
- SCIM / Entra group sync
- Automated claim → role sync
- Approval / delegated admin workflows
- Audit log implementation
- Executable migrations in repo
- API routes for membership CRUD

---

## Portability notes

| Store | Notes |
|-------|--------|
| Postgres / Supabase | Draft SQL uses `text[]`, `timestamptz`, `uuid` |
| SQLite | Would use JSON text column for roles/permissions |
| Prisma | Schema mirrors same logical model; adapter implements contract |

Draft SQL: [docs/db/drafts/tenant-user-memberships.sql](../db/drafts/tenant-user-memberships.sql) — **DRAFT ONLY**.

---

## Phase 70 update (runtime tenant scope)

| Topic | Status |
|-------|--------|
| Content adapter reads | Explicit `tenantId` required — no silent adapter default |
| `requireTenantRuntimeAccess` | Ready for membership-backed subjects; **not wired** to open admin |
| Membership adapter | Still contract-only; will populate `AuthorizationSubject.tenantAccess` |
| DB migration | `tenant_user_memberships` draft unchanged; `tenant_id` on content tables still required for Supabase isolation |

When membership persistence is implemented, admin flows should:

1. Load `TenantUserMembership[]` for session user
2. `buildAuthorizationSubjectFromMemberships()`
3. `requireTenantRuntimeAccess(subject, scope)` before tenant-scoped mutations

---

## Related phases

| Phase | Topic |
|-------|--------|
| 68 | Authorization types + pure helpers |
| 67 | Auth boundary audit |
| 70 | Tenant runtime scope + adapter enforcement ([doc](./tenant-enforcement-runtime-phase-70.md)) |
| 71+ | Membership adapter + admin guard wiring (planned) |

---

## Future roadmap

- **70:** Wire `listMembershipsForUser` in auth boundary resolution
- **71:** In-memory / Supabase adapter implementation
- **72:** Admin membership read API (server actions only, if needed)
- **73:** Provider claim mapping sync (optional)
