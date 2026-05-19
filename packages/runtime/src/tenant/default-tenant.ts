import { readConfiguredTenantId } from "@sovereign-cms/tenancy"

/**
 * Server-side default tenant for single-tenant deployments (Phase 73).
 * Uses `LOCAL_TENANT_ID` when set, otherwise the project seed tenant id.
 */
export function getDefaultTenantId(env: NodeJS.ProcessEnv = process.env): string {
  return readConfiguredTenantId(env)
}
