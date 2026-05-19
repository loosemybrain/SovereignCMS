# Auth Boundary & Identity Provider Audit — Phase 67

## Purpose

Phase 67 audits authentication and identity-provider coupling so SovereignCMS can later support public-sector and enterprise identity (Keycloak, Entra ID, OIDC, SAML gateways) **without** being locked into Supabase Auth.

This phase is **audit + boundary design only**. No auth migration, no new providers, no behavior changes.

---

## Executive summary

| Layer | Auth status |
|-------|-------------|
| **SovereignCMS (`apps/admin`, `apps/web`, `packages/*`)** | No real auth enforcement; `AUTH_ADAPTER=none` default; no Supabase Auth in active apps |
| **Legacy (`legacy/physio-source`)** | Heavy Supabase Auth + MFA + RLS + admin guards — reference implementation, not production path |
| **Risk** | Porting legacy auth patterns into Sovereign apps without a boundary would recreate lock-in |

---

## Current auth entry points (active monorepo)

| Entry point | Role |
|-------------|------|
| `packages/auth` | `AuthUser`, `AuthProvider` (`getSession`, `signOut`), `RbacPolicy` |
| `packages/runtime/src/adapter-selection.ts` | `selectAuthProvider()` — `none` \| `supabase` \| `keycloak` |
| `packages/runtime/src/runtime.ts` | `runtime.auth: AuthProvider` (composed, rarely used by apps today) |
| `loadRuntimeConfig()` / `AUTH_ADAPTER` | Env switch; non-`none` throws until implemented |
| `adapters/keycloak` | `createKeycloakAuthProviderPlaceholder()` — noop session |
| `adapters/supabase` | No auth implementation (DB/storage placeholders only) |
| `apps/admin` layout | **No** login gate; displays `authAdapter` label only |
| `apps/admin` server actions | Comments mention future auth; **no** `requireAdmin` calls |
| `apps/web` | Public rendering; no session |

### Environment variables (auth-related)

| Variable | Values | Used by |
|----------|--------|---------|
| `AUTH_ADAPTER` | `none` (default), `supabase`, `keycloak` | `loadRuntimeConfig()` |

No `NEXT_PUBLIC_SUPABASE_*` auth vars in active apps.

---

## Supabase Auth coupling (where it exists)

### Active monorepo: **none**

- No `@supabase/supabase-js` / `@supabase/ssr` imports in `apps/*` or `packages/*` for auth.
- `AUTH_ADAPTER=supabase` throws: `Adapter not implemented yet: supabase auth`.

### Legacy physio-source: **high coupling**

Documented as the primary reference for what **not** to copy verbatim into Sovereign apps.

| Category | Examples |
|----------|----------|
| Server clients | `createSupabaseServerClient`, `getSupabaseAdmin` |
| Browser clients | `createSupabaseBrowserClient`, `getSupabaseBrowserClient` |
| Routes | `/auth/login`, `/auth/callback`, `/auth/logout`, `/auth/reset`, `/auth/forgot`, `/auth/mfa/*` |
| Admin gate | `apps/admin/layout.tsx` — `getUser`, `getAdminMfaState`, AAL2 redirect |
| API guards | `requireAdminGuard(supabase)`, `requireAdminWithServiceRole` |
| MFA APIs | `supabase.auth.mfa.enroll`, `listFactors`, `challengeAndVerify`, `getAuthenticatorAssuranceLevel` |
| Types in app code | `SupabaseClient`, `User` from `@supabase/supabase-js` passed into guards |

Approximate surface (legacy):

- ~20+ files using browser Supabase client
- ~40+ files using server Supabase client / admin role
- Admin layout enforces: authenticated → admin RPC → TOTP enrolled → AAL2

---

## Client-side vs server-side auth usage

### SovereignCMS (active)

| Side | Usage |
|------|--------|
| Client Components | **No** auth provider clients |
| Server | `runtime.auth` exists but apps do not call it for gates |
| Serializable labels | `pickAdminRuntimeAdapterLabels()` — strings only, safe for client |

### Legacy (reference)

| Side | Pattern | Risk |
|------|---------|------|
| Client | MFA enroll/verify, media URLs, footer save, navigation editor, password reset | High — SDK + session in browser |
| Server | Layout guard, API routes, `requireAdminGuard` | Medium — acceptable if behind boundary |
| Anti-pattern noted | Comments in `AdminLayout.tsx` / `AdminTopbar.tsx`: client must **not** call `getSession()` (HttpOnly cookies) | Good lesson for Sovereign |

---

## MFA portability analysis

### Current behavior (legacy only)

| Step | Provider API |
|------|----------------|
| List factors | `auth.mfa.listFactors()` |
| Enroll TOTP | `auth.mfa.enroll({ factorType: 'totp' })` |
| Verify | `auth.mfa.challengeAndVerify` |
| Assurance | `auth.mfa.getAuthenticatorAssuranceLevel()` → `aal1` / `aal2` |
| Admin gate | Requires verified TOTP + `currentAal === 'aal2'` |

QR/secret handling lives in client components (`setup-client.tsx`, `MfaEnrollDialog`, etc.).

### SovereignCMS today

- **No MFA** in active admin/web.
- No TOTP, no AAL assumptions.

### Future strategy (document only)

1. **Supabase MFA** may remain the first implementation behind `AuthBoundary`.
2. **Keycloak / Entra / enterprise IdP** often delegate MFA to the IdP (no `auth.mfa.*` equivalent).
3. CMS should expose **`mfaVerified` / assurance-level** semantics on `AuthSession`, not Supabase AAL types in core.
4. Admin guard should eventually call `authBoundary.requireAdmin()` which maps provider-specific rules internally.
5. Do not assume all providers support enrollment inside the CMS UI.

---

## RLS / auth coupling

### Active monorepo

- **No RLS** in Sovereign packages or apps.
- Content Supabase adapter (Phase 66) filters by `tenant_id` in queries explicitly; does not use `auth.uid()`.
- RLS is **not** part of universal platform architecture.

### Legacy

- Extensive `ENABLE ROW LEVEL SECURITY` migrations.
- Policies reference `auth.uid()`, `is_admin` RPC, service-role bypass patterns.
- Cookie-scan worker uses service role + RPC designed for single-job claim.

### Principles

| Topic | Stance |
|-------|--------|
| RLS | Optional **deployment strategy** for Supabase-hosted tenants |
| `auth.uid()` | Must not appear in `packages/core` or app business logic |
| Service role | Server-only, documented per deployment; not a CMS core assumption |
| Sovereign adapters | Use explicit tenant filters; authorization remains app/auth layer |

Do not weaken or remove legacy RLS in this phase (no migration changes).

---

## Target auth boundaries

```
┌─────────────────────────────────────────────────────────────┐
│ apps/admin, apps/web                                         │
│  - server loaders/actions call AuthBoundary helpers only     │
│  - clients get AuthenticatedUser / labels (serializable)     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│ packages/runtime (future)                                    │
│  - compose AuthBoundary from AUTH_ADAPTER                    │
│  - no SDK types in exports used by UI                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────────┐                 ┌───────────────────┐
│ packages/auth     │                 │ adapters/*        │
│ neutral types     │                 │ supabase auth     │
│ AuthUser (today)  │                 │ keycloak OIDC     │
└───────────────────┘                 └───────────────────┘

packages/core: domain types only; no Supabase User, no OIDC claims
packages/db: persistence only; not an auth dumping ground
```

### Layer rules

| Layer | May | Must not |
|-------|-----|----------|
| **Core** | Generic permission/role ids if needed | Provider SDKs, Supabase `User`, OIDC claim structs |
| **packages/auth** | `AuthUser`, `AuthProvider`, RBAC hooks | MFA enroll UI, cookie handling |
| **Runtime** | Compose boundary; map sessions | Expose `SupabaseClient` to apps |
| **Adapters** | Provider login/session/MFA | Leak into core |
| **Apps** | Call server boundary | Import `@supabase/*` for auth |

---

## Provider-neutral contract draft

Documented types (not wired): `packages/runtime/src/auth/types.ts`

| Type | Purpose |
|------|---------|
| `AuthenticatedUser` | Serializable identity |
| `AuthSession` | Session + `mfaVerified` + provider label |
| `MfaStatus` / `MfaChallenge` | Step-up abstraction |
| `AuthBoundary` | `getCurrentSession`, `requireAdmin`, `signOut`, MFA helpers |

Existing minimal contract: `packages/auth` — `AuthProvider` with `getSession` / `signOut`.

Future work merges these without modeling every Supabase/OIDC feature.

---

## Auth access classification

| Area | Current pattern (active) | Coupling | Security | Portability risk | Future boundary | Priority |
|------|--------------------------|----------|----------|------------------|-----------------|----------|
| Login page | Not present | None | — | Low | `AuthBoundary` + adapter | P1 |
| Logout | Not present | None | — | Low | `signOut()` | P1 |
| Auth callback | Not present (legacy has `/auth/callback`) | None / legacy high | High | Medium | Adapter route handler | P1 |
| Password reset | Not present | None | Medium | Low | Adapter | P2 |
| MFA setup | Not present (legacy client SDK) | None / legacy high | High | High | `getMfaStatus` / enroll via boundary | P1 |
| MFA verify | Not present | None / legacy high | High | High | `verifyMfaChallenge` | P1 |
| Admin layout guard | **Open** — no redirect | None | **High** (open admin) | Medium until prod | `requireAdmin()` in layout | P0 |
| Admin server actions | No auth check | None | High | Medium | `requireAuthenticatedUser` | P0 |
| Content + RLS | Explicit tenant filter (Supabase content adapter) | Low | Medium | Low | Keep out of RLS assumptions | P1 |
| Public rendering | No auth | None | Low | Low | Optional public session later | P3 |
| Media/storage | No auth gate | None | Medium | Medium | Boundary + storage policy | P2 |
| Privacy scanner admin | No auth | None | Medium | Medium | `requireAdmin` | P2 |
| User display UI | Tenant/runtime labels only | None | Low | Low | `AuthenticatedUser` DTO | P2 |
| `runtime.auth` | Composed, unused | Low | — | Low | Replace with `AuthBoundary` | P1 |

---

## Public-sector / enterprise identity requirements

| Requirement | Architectural response |
|-------------|------------------------|
| Self-hosted IdP | `AUTH_ADAPTER=keycloak` (future) + adapter package |
| Keycloak / OIDC | `adapters/keycloak`; no OIDC libs in core |
| Microsoft Entra ID | OIDC/SAML via gateway or Keycloak broker — adapter layer |
| No SaaS identity lock-in | Apps never import Supabase Auth directly |
| Separate content vs identity | Phase 65–66 content adapter independent of `AUTH_ADAPTER` |
| Auditable server boundary | All session resolution server-side, logged at boundary |
| No provider clients in client bundles | Unless deliberate (e.g. PKCE browser flow) — document exception |
| MFA / assurance abstraction | `mfaVerified` on `AuthSession`, not AAL in core |
| Role / admin mapping | DB RPC or IdP roles → `AuthenticatedUser.roles` / `isAdmin` |
| Tenant-aware access | Map IdP claims / DB membership → `tenantIds` |

---

## Recommended future phases (not implemented)

| Phase | Focus |
|-------|--------|
| **68** | Auth boundary type introduction — wire `AuthBoundary` interface to runtime composition |
| **69** | Supabase Auth boundary extraction — port legacy patterns into `adapters/supabase` only |
| **70** | Admin guard uses auth boundary — layout + critical server actions |
| **71** | Auth role / tenant mapping foundation |
| **72** | Keycloak / OIDC feasibility spike |
| **73** | RLS strategy documentation per provider deployment |

---

## Relationship to persistence (Phases 65–66)

- Content persistence (`runtime.content`) is already isolated from auth.
- Supabase **database** reads must not assume Supabase **Auth** session for tenant resolution in core logic.
- Full production Supabase deployments may combine RLS + Auth in the **adapter/deployment** docs, not in CMS core.

---

## What Phase 67 did not change

- No auth provider implementation
- No login/MFA/guard behavior in active apps
- No new dependencies, API routes, or migrations
- Legacy code untouched
