import type { ContentWriteOperation, TenantRuntimeScope } from "@sovereign-cms/runtime"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { resolveAdminWriteScope } from "@/lib/resolve-admin-write-scope"

/**
 * @deprecated Prefer {@link resolveAdminWriteScope} for all admin writes.
 */
export function resolveAdminContentWriteScope(input: {
  clientTenantId: string
  locale?: string
  operation: ContentWriteOperation
}): { runtime: ReturnType<typeof getAdminRuntime>["runtime"]; scope: TenantRuntimeScope } {
  return resolveAdminWriteScope(input)
}
