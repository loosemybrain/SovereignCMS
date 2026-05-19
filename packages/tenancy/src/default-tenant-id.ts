/**
 * Configured default tenant id for single-tenant / local deployments.
 * In-memory seed data uses this id — keep aligned with `packages/db` demo fixtures.
 */
export const SOVEREIGN_DEFAULT_TENANT_ID = "demo"

/** Reads `LOCAL_TENANT_ID` or falls back to {@link SOVEREIGN_DEFAULT_TENANT_ID}. */
export function readConfiguredTenantId(env: NodeJS.ProcessEnv = process.env): string {
  const fromEnv = env.LOCAL_TENANT_ID?.trim()
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv
  }
  return SOVEREIGN_DEFAULT_TENANT_ID
}
