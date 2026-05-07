import { createRuntime } from "@sovereign-cms/runtime"
import { resolveAdminTenant } from "@sovereign-cms/tenancy"

export function getAdminRuntime(input?: { host?: string }) {
  const runtime = createRuntime()

  const tenant = resolveAdminTenant({
    host: input?.host,
    env: process.env,
  })

  return { runtime, tenant }
}
