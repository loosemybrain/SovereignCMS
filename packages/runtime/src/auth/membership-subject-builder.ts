import {
  isActiveTenantMembership,
  type AuthorizationSubject,
  type TenantAccess,
  type TenantUserMembership,
} from "@sovereign-cms/core"
import type { AuthenticatedUser } from "./types"

export type BuildAuthorizationSubjectFromMembershipsOptions = {
  isPlatformAdmin?: boolean
}

function membershipToTenantAccess(membership: TenantUserMembership): TenantAccess {
  return {
    tenantId: membership.tenantId,
    roles: [...membership.roles],
    permissions: membership.permissions ? [...membership.permissions] : undefined,
  }
}

/**
 * Builds {@link AuthorizationSubject} from authenticated identity + persisted memberships.
 * Pure — no DB or provider SDK access.
 */
export function buildAuthorizationSubjectFromMemberships(
  user: AuthenticatedUser,
  memberships: TenantUserMembership[],
  options?: BuildAuthorizationSubjectFromMembershipsOptions,
): AuthorizationSubject {
  const tenantAccess = memberships
    .filter(isActiveTenantMembership)
    .map(membershipToTenantAccess)

  return {
    userId: user.id,
    email: user.email,
    isPlatformAdmin: options?.isPlatformAdmin === true,
    tenantAccess,
  }
}
