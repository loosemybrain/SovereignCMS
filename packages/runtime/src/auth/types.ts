/**
 * Phase 67 — provider-neutral auth contract drafts (types only).
 *
 * Not wired at runtime. Live minimal contract today: `AuthProvider` + `AuthUser`
 * in `@sovereign-cms/auth`.
 *
 * Future `AuthBoundary` implementations belong in `adapters/*` or a dedicated
 * auth adapter package — not in apps or core.
 */

/** Serializable user identity for server → client boundaries. */
export type AuthenticatedUser = {
  id: string
  email?: string
  displayName?: string
  roles?: readonly string[]
  tenantIds?: readonly string[]
  isAdmin?: boolean
}

/** Provider-neutral session snapshot (no SDK objects). */
export type AuthSession = {
  user: AuthenticatedUser | null
  expiresAt?: string
  /** Label only, e.g. "supabase" | "keycloak" — not a dynamic plugin id */
  authProvider?: string
  /** Assurance / step-up; meaning is provider-mapped */
  mfaVerified?: boolean
}

export type MfaStatus = {
  enrolled: boolean
  verified: boolean
  /** Provider-mapped assurance level, e.g. aal1/aal2 for Supabase */
  assuranceLevel?: string | null
}

export type MfaChallenge = {
  challengeId: string
  factorId?: string
}

/**
 * Server-side auth boundary (draft). Methods are async; implementations stay server-only.
 */
export interface AuthBoundary {
  getCurrentSession(): Promise<AuthSession>
  requireAuthenticatedUser(): Promise<AuthenticatedUser>
  requireAdmin(): Promise<AuthenticatedUser>
  signOut(): Promise<void>
  getMfaStatus(): Promise<MfaStatus>
  createMfaChallenge(): Promise<MfaChallenge>
  verifyMfaChallenge(input: { challengeId: string; code: string }): Promise<AuthSession>
}
