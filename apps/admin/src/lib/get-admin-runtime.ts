import {
  createRuntime,
  resolveAdminTenantContext,
  type ResolvedTenantContext,
} from "@sovereign-cms/runtime"
import { resolveAdminTenant, type AdminTenantContext } from "@sovereign-cms/tenancy"

export function getAdminRuntime(input?: { host?: string }): {
  runtime: ReturnType<typeof createRuntime>
  tenant: AdminTenantContext
  resolved: ResolvedTenantContext
} {
  const runtime = createRuntime()
  const legacy = resolveAdminTenant({
    host: input?.host,
    env: process.env,
  })

  const resolved = resolveAdminTenantContext({
    explicitTenantId: process.env.LOCAL_TENANT_ID,
    selectedTenantId: legacy.tenantId,
    host: input?.host,
  })

  return { runtime, tenant: legacy, resolved }
}
