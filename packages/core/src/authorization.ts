import type { TenantId } from "./cms"

export type { TenantId }

export type SovereignRole = "owner" | "admin" | "editor" | "viewer"

export type SovereignPermission =
  | "tenant:read"
  | "tenant:manage"
  | "page:read"
  | "page:create"
  | "page:update"
  | "page:delete"
  | "page:publish"
  | "media:read"
  | "media:manage"
  | "navigation:read"
  | "navigation:manage"
  | "settings:read"
  | "settings:manage"
  | "privacy:read"
  | "privacy:manage"
  | "governance:read"

export type TenantAccess = {
  tenantId: TenantId
  roles: SovereignRole[]
  permissions?: SovereignPermission[]
}

export type AuthorizationSubject = {
  userId: string
  email?: string
  isPlatformAdmin?: boolean
  tenantAccess: TenantAccess[]
}

export class AuthorizationError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = "AuthorizationError"
    this.code = code
  }
}

const ALL_PERMISSIONS: readonly SovereignPermission[] = [
  "tenant:read",
  "tenant:manage",
  "page:read",
  "page:create",
  "page:update",
  "page:delete",
  "page:publish",
  "media:read",
  "media:manage",
  "navigation:read",
  "navigation:manage",
  "settings:read",
  "settings:manage",
  "privacy:read",
  "privacy:manage",
  "governance:read",
] as const

const ROLE_PERMISSIONS: Record<SovereignRole, readonly SovereignPermission[]> = {
  owner: ALL_PERMISSIONS,
  admin: ALL_PERMISSIONS.filter((p) => p !== "tenant:manage"),
  editor: [
    "page:read",
    "page:create",
    "page:update",
    "page:publish",
    "media:read",
    "media:manage",
    "navigation:read",
    "governance:read",
  ],
  viewer: [
    "tenant:read",
    "page:read",
    "media:read",
    "navigation:read",
    "settings:read",
    "governance:read",
  ],
}

function findTenantAccess(
  subject: AuthorizationSubject,
  tenantId: TenantId,
): TenantAccess | undefined {
  return subject.tenantAccess.find((entry) => entry.tenantId === tenantId)
}

function permissionsForTenant(
  subject: AuthorizationSubject,
  tenantId: TenantId,
): Set<SovereignPermission> {
  const granted = new Set<SovereignPermission>()

  if (subject.isPlatformAdmin) {
    for (const permission of ALL_PERMISSIONS) {
      granted.add(permission)
    }
    return granted
  }

  const access = findTenantAccess(subject, tenantId)
  if (!access) {
    return granted
  }

  if (access.permissions) {
    for (const permission of access.permissions) {
      granted.add(permission)
    }
  }

  for (const role of access.roles) {
    for (const permission of ROLE_PERMISSIONS[role]) {
      granted.add(permission)
    }
  }

  return granted
}

export function hasTenantRole(
  subject: AuthorizationSubject,
  tenantId: TenantId,
  role: SovereignRole,
): boolean {
  if (subject.isPlatformAdmin) {
    return true
  }

  const access = findTenantAccess(subject, tenantId)
  if (!access) {
    return false
  }

  return access.roles.includes(role)
}

export function hasTenantPermission(
  subject: AuthorizationSubject,
  tenantId: TenantId,
  permission: SovereignPermission,
): boolean {
  return permissionsForTenant(subject, tenantId).has(permission)
}

export function canAccessTenant(subject: AuthorizationSubject, tenantId: TenantId): boolean {
  if (subject.isPlatformAdmin) {
    return true
  }

  const access = findTenantAccess(subject, tenantId)
  if (!access) {
    return false
  }

  if (access.roles.length > 0) {
    return true
  }

  if (access.permissions && access.permissions.length > 0) {
    return true
  }

  return false
}
