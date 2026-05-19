import {
  prepareOperationalRead,
  resolveRuntimeReadScope,
  toTenantRuntimeScope,
  type OperationalReadOperation,
  type TenantRuntimeScope,
} from "@sovereign-cms/runtime"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

/**
 * Central admin tenant read scope for operational data (Phase 74).
 */
export function resolveAdminOperationalReadScope(input?: {
  host?: string
  locale?: string
  operation?: OperationalReadOperation
}): {
  runtime: ReturnType<typeof getAdminRuntime>["runtime"]
  scope: TenantRuntimeScope
  resolved: ReturnType<typeof getAdminRuntime>["resolved"]
} {
  const { runtime, resolved } = getAdminRuntime({ host: input?.host })

  const baseScope = resolveRuntimeReadScope({
    resolved,
    ...(input?.locale ? { locale: input.locale } : {}),
  })

  const scope = input?.operation
    ? prepareOperationalRead(baseScope, input.operation)
    : baseScope

  return { runtime, scope, resolved }
}

/** @deprecated Prefer resolveAdminOperationalReadScope — kept for gradual migration. */
export function adminReadTenantId(input?: {
  host?: string
  locale?: string
}): { tenantId: string; scope: TenantRuntimeScope } {
  const { resolved } = getAdminRuntime({ host: input?.host })
  const scope = toTenantRuntimeScope({
    ...resolved,
    ...(input?.locale ? { locale: input.locale } : {}),
  })
  return { tenantId: scope.tenantId, scope }
}
