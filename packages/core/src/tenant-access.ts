import type { TenantId, SovereignPermission, SovereignRole } from "./authorization"

export type TenantUserStatus = "active" | "invited" | "disabled"

/**
 * Persisted tenant membership for a provider-neutral identity subject (`userId`).
 * Not an auth-provider user object — map from session at the boundary layer.
 */
export type TenantUserMembership = {
  id: string
  tenantId: TenantId
  userId: string
  email?: string
  displayName?: string
  roles: SovereignRole[]
  permissions?: SovereignPermission[]
  status: TenantUserStatus
  createdAt?: string
  updatedAt?: string
}

export type TenantUserMembershipInput = {
  tenantId: TenantId
  userId: string
  email?: string
  displayName?: string
  roles: SovereignRole[]
  permissions?: SovereignPermission[]
  status?: TenantUserStatus
}

/** Active memberships only — for authorization subject building. */
export function isActiveTenantMembership(membership: TenantUserMembership): boolean {
  return membership.status === "active"
}
