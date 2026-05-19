import {
  AuthorizationError,
  canAccessTenant,
  type AuthorizationSubject,
} from "@sovereign-cms/core"
import { assertTenantScope, type TenantRuntimeScope } from "./scope"

/**
 * Server-side tenant access check against an authorization subject (Phase 70).
 * Pure — no provider or DB access. Not wired into open admin paths yet.
 */
export function requireTenantRuntimeAccess(
  subject: AuthorizationSubject,
  scope: TenantRuntimeScope,
): TenantRuntimeScope {
  const validated = assertTenantScope(scope)

  if (!canAccessTenant(subject, validated.tenantId)) {
    throw new AuthorizationError(
      "tenant_access_denied",
      `Access denied for tenant: ${validated.tenantId}`,
    )
  }

  return validated
}
