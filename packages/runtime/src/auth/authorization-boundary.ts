import {
  AuthorizationError,
  canAccessTenant,
  hasTenantPermission,
  type AuthorizationSubject,
  type SovereignPermission,
  type TenantId,
} from "@sovereign-cms/core"

/**
 * Server-side authorization boundary (Phase 68).
 * Pure checks against {@link AuthorizationSubject} — no provider or DB access.
 */

export function requireTenantAccess(
  subject: AuthorizationSubject,
  tenantId: TenantId,
): void {
  if (!canAccessTenant(subject, tenantId)) {
    throw new AuthorizationError(
      "tenant_access_denied",
      `Access denied for tenant: ${tenantId}`,
    )
  }
}

export function requireTenantPermission(
  subject: AuthorizationSubject,
  tenantId: TenantId,
  permission: SovereignPermission,
): void {
  if (!hasTenantPermission(subject, tenantId, permission)) {
    throw new AuthorizationError(
      "permission_denied",
      `Permission denied: ${permission} on tenant ${tenantId}`,
    )
  }
}

export function assertTenantPermission(
  subject: AuthorizationSubject,
  tenantId: TenantId,
  permission: SovereignPermission,
): boolean {
  return hasTenantPermission(subject, tenantId, permission)
}
