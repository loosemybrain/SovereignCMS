import type { CmsPage } from "@sovereign-cms/core"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

export async function loadAdminPages(input?: {
  host?: string
  locale?: string
}): Promise<{
  tenant: ReturnType<typeof getAdminRuntime>["tenant"]
  runtimeConfig: RuntimeConfig
  pages: CmsPage[]
  locale: string
  supportedLocales: string[]
  error?: boolean
}> {
  const { runtime, tenant } = getAdminRuntime({ host: input?.host })
  const locale = input?.locale ?? runtime.config.defaultLocale

  try {
    const pages: CmsPage[] = await runtime.db.pages.listByTenant({
      tenantId: tenant.tenantId,
      locale,
    })

    return {
      tenant,
      runtimeConfig: runtime.config,
      pages,
      locale,
      supportedLocales: runtime.config.supportedLocales,
    }
  } catch (error) {
    console.error("[admin] failed to load pages", error)
    return {
      tenant,
      runtimeConfig: runtime.config,
      pages: [],
      locale,
      supportedLocales: runtime.config.supportedLocales,
      error: true,
    }
  }
}
