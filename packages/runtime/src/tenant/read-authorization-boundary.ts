import type { AuthorizationSubject, SovereignPermission } from "@sovereign-cms/core"
import { assertTenantScope, type TenantRuntimeScope } from "./scope"

export type OperationalReadOperation =
  | "navigation:read"
  | "settings:read"
  | "media:read"
  | "privacy:read"
  | "governance:read"

const OPERATIONAL_READ_PERMISSION_BY_OPERATION: Record<
  OperationalReadOperation,
  SovereignPermission
> = {
  "navigation:read": "navigation:read",
  "settings:read": "settings:read",
  "media:read": "media:read",
  "privacy:read": "privacy:read",
  "governance:read": "governance:read",
}

/**
 * Server-side operational read boundary preparation (Phase 74).
 * Validates tenant scope and documents permission hooks for future enforcement.
 *
 * TODO: When admin sessions expose a reliable AuthorizationSubject,
 * call requireTenantPermission(subject, scope.tenantId, permission) here.
 * Do not enforce until membership-backed subjects are wired.
 */
export function prepareOperationalRead(
  scope: TenantRuntimeScope,
  operation: OperationalReadOperation,
  _subject?: AuthorizationSubject | null,
): TenantRuntimeScope {
  const validated = assertTenantScope(scope)
  const _permission = OPERATIONAL_READ_PERMISSION_BY_OPERATION[operation]
  void _permission
  void _subject
  return validated
}
