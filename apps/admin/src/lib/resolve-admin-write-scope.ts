import {
  assertClientTenantMatchesScope,
  prepareContentWrite,
  prepareOperationalWrite,
  toTenantRuntimeScope,
  type AdminWriteOperation,
  type ContentWriteOperation,
  type OperationalWriteOperation,
  type TenantRuntimeScope,
} from "@sovereign-cms/runtime"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

const CONTENT_OPERATIONS = new Set<ContentWriteOperation>([
  "page:create",
  "page:update",
  "page:delete",
  "page:publish",
])

function isContentWriteOperation(
  operation: AdminWriteOperation,
): operation is ContentWriteOperation {
  return CONTENT_OPERATIONS.has(operation as ContentWriteOperation)
}

/**
 * Central admin tenant write scope for content and operational writes (Phase 72).
 */
export function resolveAdminWriteScope(input: {
  clientTenantId: string
  locale?: string
  operation: AdminWriteOperation
}): { runtime: ReturnType<typeof getAdminRuntime>["runtime"]; scope: TenantRuntimeScope } {
  const { runtime, resolved } = getAdminRuntime()

  const baseScope: TenantRuntimeScope = {
    ...toTenantRuntimeScope({
      ...resolved,
      ...(input.locale ? { locale: input.locale } : {}),
    }),
  }

  const scope = isContentWriteOperation(input.operation)
    ? prepareContentWrite(baseScope, input.operation)
    : prepareOperationalWrite(baseScope, input.operation as OperationalWriteOperation)

  assertClientTenantMatchesScope(input.clientTenantId, scope)
  return { runtime, scope }
}
