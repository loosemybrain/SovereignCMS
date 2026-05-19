import type { AuthorizationSubject, SovereignPermission } from "@sovereign-cms/core"
import { assertTenantScope, TenantScopeError, type TenantRuntimeScope } from "./scope"

export type ContentWriteOperation = "page:create" | "page:update" | "page:delete" | "page:publish"

export type OperationalWriteOperation =
  | "navigation:manage"
  | "settings:manage"
  | "media:manage"
  | "privacy:manage"

export type AdminWriteOperation = ContentWriteOperation | OperationalWriteOperation

const CONTENT_PERMISSION_BY_OPERATION: Record<ContentWriteOperation, SovereignPermission> = {
  "page:create": "page:create",
  "page:update": "page:update",
  "page:delete": "page:delete",
  "page:publish": "page:publish",
}

const OPERATIONAL_PERMISSION_BY_OPERATION: Record<
  OperationalWriteOperation,
  SovereignPermission
> = {
  "navigation:manage": "navigation:manage",
  "settings:manage": "settings:manage",
  "media:manage": "media:manage",
  "privacy:manage": "privacy:manage",
}

/**
 * Server-side write boundary preparation (Phase 71).
 * Validates tenant scope and documents the permission hook for future enforcement.
 *
 * TODO(Phase 72+): When admin sessions expose a reliable AuthorizationSubject,
 * call requireTenantPermission(subject, scope.tenantId, permission) here.
 * Do not enforce until membership-backed subjects are wired — open admin must keep working.
 */
export function prepareContentWrite(
  scope: TenantRuntimeScope,
  operation: ContentWriteOperation,
  _subject?: AuthorizationSubject | null,
): TenantRuntimeScope {
  const validated = assertTenantScope(scope)
  const _permission = CONTENT_PERMISSION_BY_OPERATION[operation]
  void _permission
  void _subject
  return validated
}

/**
 * Server-side non-content write boundary preparation (Phase 72).
 * TODO(Phase 73+): enforce requireTenantPermission when AuthorizationSubject is reliable.
 */
export function prepareOperationalWrite(
  scope: TenantRuntimeScope,
  operation: OperationalWriteOperation,
  _subject?: AuthorizationSubject | null,
): TenantRuntimeScope {
  const validated = assertTenantScope(scope)
  const _permission = OPERATIONAL_PERMISSION_BY_OPERATION[operation]
  void _permission
  void _subject
  return validated
}

/** Ensures client-supplied tenantId matches server-resolved scope (admin actions). */
export function assertClientTenantMatchesScope(
  clientTenantId: string,
  scope: TenantRuntimeScope,
): TenantRuntimeScope {
  const validated = assertTenantScope(scope)
  const clientTrimmed = clientTenantId?.trim()

  if (!clientTrimmed) {
    throw new TenantScopeError("client tenantId is required for tenant-scoped writes")
  }

  if (clientTrimmed !== validated.tenantId) {
    throw new TenantScopeError(
      "client tenantId does not match server-resolved tenant scope",
    )
  }

  return validated
}
