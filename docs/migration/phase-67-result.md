# Phase 67 — Auth Boundary & Identity Provider Audit: Result

## Summary

Phase 67 audited authentication and identity-provider coupling across SovereignCMS and documented a provider-neutral auth boundary for future public-sector and enterprise deployments.

No auth provider was added or replaced. No MFA, admin guard, login, or session behavior was changed in active apps.

---

## What was audited

- `packages/auth` — `AuthUser`, `AuthProvider`, `RbacPolicy`
- `packages/runtime` — `selectAuthProvider`, `runtime.auth`, `AUTH_ADAPTER`
- `adapters/keycloak`, `adapters/supabase` — auth placeholders
- `apps/admin`, `apps/web` — guards, server actions, client components
- `legacy/physio-source` — Supabase Auth, MFA, RLS, admin guards (reference)
- Env coupling (`AUTH_ADAPTER`, legacy `SUPABASE_*`)

---

## Coupling findings (honest)

### Active SovereignCMS

| Finding | Detail |
|---------|--------|
| No Supabase Auth in apps | Zero `@supabase/*` auth imports in `apps/*` |
| Default auth | `AUTH_ADAPTER=none` — noop `getSession` / `signOut` |
| Admin is open | No layout guard; server actions unchecked |
| `runtime.auth` | Composed but **not used** by apps for enforcement |
| Client boundary | Only `pickAdminRuntimeAdapterLabels()` crosses to UI |
| RLS | Not used in active code; content adapter uses explicit `tenant_id` |

### Legacy (quarantined reference)

| Finding | Detail |
|---------|--------|
| Supabase Auth everywhere | Login, callback, session cookies, browser + server clients |
| MFA | TOTP enroll/verify, AAL2 required for admin |
| Admin guard | `requireAdminGuard(SupabaseClient)` — high coupling |
| RLS | `auth.uid()`, `is_admin` RPC in SQL policies |
| Client MFA | Multiple Client Components call `supabase.auth.mfa.*` |

---

## Deliverables

| Artifact | Description |
|----------|-------------|
| `docs/architecture/auth-boundary-audit-phase-67.md` | Full audit, MFA/RLS analysis, classification table, roadmap |
| `packages/runtime/src/auth/types.ts` | Type-only draft: `AuthenticatedUser`, `AuthSession`, `AuthBoundary` |
| `packages/runtime/src/auth/index.ts` | Re-exports |

---

## MFA portability (summary)

- **Active product:** no MFA.
- **Legacy:** Supabase-specific `auth.mfa.*` and AAL2 gate.
- **Future:** `mfaVerified` / assurance on `AuthSession`; enterprise IdP may own MFA entirely.

---

## RLS / auth (summary)

- RLS is a **Supabase deployment option**, not a universal CMS rule.
- Sovereign content adapter does not rely on `auth.uid()`.
- Legacy migrations remain; not modified.

---

## Optional type files

Added **type-only** drafts under `packages/runtime/src/auth/` — no SDK imports, no behavior, exported from `@sovereign-cms/runtime`.

Existing `packages/auth` `AuthUser` / `AuthProvider` unchanged.

---

## What was not changed

- Auth/login/MFA/guard behavior
- `AUTH_ADAPTER` implementation (still throws for supabase/keycloak)
- External dependencies, API routes, database migrations
- Legacy tree

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
| 1–6 | Audit, entry points, Supabase/MFA/RLS documented | ✅ |
| 7–9 | Boundary, contract draft, public-sector reqs, roadmap | ✅ |
| 10–19 | No behavior/deps/API/migration/core leakage | ✅ |
| 20 | Validation documented | ✅ (after run) |
