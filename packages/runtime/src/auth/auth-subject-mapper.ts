import type { AuthUser } from "@sovereign-cms/auth"
import type { AuthorizationSubject, SovereignRole, TenantAccess, TenantId } from "@sovereign-cms/core"
import type { AuthenticatedUser } from "./types"

export type AuthorizationSubjectMapperInput = {
  userId?: string | null
  email?: string
  isPlatformAdmin?: boolean
  tenantAccess?: TenantAccess[]
}

/**
 * Maps a minimal auth user shape to {@link AuthorizationSubject}.
 * Does not infer roles from provider claim namespaces (OIDC/SAML/Supabase metadata).
 */
export function toAuthorizationSubject(
  input: AuthorizationSubjectMapperInput,
): AuthorizationSubject {
  const userId = typeof input.userId === "string" && input.userId.length > 0 ? input.userId : "anonymous"

  return {
    userId,
    email: input.email,
    isPlatformAdmin: input.isPlatformAdmin === true,
    tenantAccess: input.tenantAccess ? [...input.tenantAccess] : [],
  }
}

export function toAuthorizationSubjectFromAuthUser(
  user: AuthUser | null | undefined,
  options?: {
    tenantId?: TenantId
    /** Explicit tenant roles only — never inferred from opaque provider role strings */
    tenantRoles?: SovereignRole[]
    isPlatformAdmin?: boolean
  },
): AuthorizationSubject {
  if (!user) {
    return toAuthorizationSubject({ userId: "anonymous", tenantAccess: [] })
  }

  const tenantAccess: TenantAccess[] = []
  if (options?.tenantId && options.tenantRoles && options.tenantRoles.length > 0) {
    tenantAccess.push({
      tenantId: options.tenantId,
      roles: [...options.tenantRoles],
    })
  }

  return toAuthorizationSubject({
    userId: user.id,
    email: user.email,
    isPlatformAdmin: options?.isPlatformAdmin,
    tenantAccess,
  })
}

export function toAuthorizationSubjectFromAuthenticatedUser(
  user: AuthenticatedUser | null | undefined,
  options?: {
    tenantId?: TenantId
    tenantRoles?: SovereignRole[]
    isPlatformAdmin?: boolean
  },
): AuthorizationSubject {
  if (!user) {
    return toAuthorizationSubject({ userId: "anonymous", tenantAccess: [] })
  }

  return toAuthorizationSubjectFromAuthUser(
    {
      id: user.id,
      email: user.email,
      roles: user.roles ?? [],
      permissions: undefined,
    },
    options,
  )
}

/**
 * Documents current local-dev reality: admin has no auth gate and operates on a resolved tenant.
 * NOT wired in apps by default — use only when explicitly composing server context for open admin.
 */
export function createLocalOpenAdminSubject(tenantId: TenantId): AuthorizationSubject {
  return toAuthorizationSubject({
    userId: "local-open-admin",
    isPlatformAdmin: true,
    tenantAccess: [
      {
        tenantId,
        roles: ["admin"],
      },
    ],
  })
}
