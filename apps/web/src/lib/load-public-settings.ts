import { createRuntime } from "@sovereign-cms/runtime"

/**
 * Server-only helper to load tenant settings for public rendering.
 * Not wired into layout yet — foundation for header/footer/contact blocks.
 */
export async function loadPublicSettings(input: { tenantId: string }) {
  const runtime = createRuntime()
  return runtime.settingsPersistence.getTenantSettings({
    tenantId: input.tenantId,
  })
}
