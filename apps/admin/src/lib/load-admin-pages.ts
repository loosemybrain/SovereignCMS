import type { CmsPage, LocaleContext } from "@sovereign-cms/core"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import { createLocaleContext } from "@sovereign-cms/runtime"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { resolveAdminLocale } from "@/lib/resolve-admin-locale"

export async function loadAdminPages(input?: {
  host?: string
  searchParams?: {
    locale?: string
  }
}): Promise<{
  tenant: ReturnType<typeof getAdminRuntime>["tenant"]
  runtimeConfig: RuntimeConfig
  pages: CmsPage[]
  localeContext: LocaleContext
  activeLocale: string
  error?: boolean
}> {
  const { runtime, tenant } = getAdminRuntime({ host: input?.host })

  const localeContext = createLocaleContext({
    locale: runtime.config.defaultLocale,
    supportedLocales: runtime.config.supportedLocales,
    defaultLocale: runtime.config.defaultLocale,
  })

  const activeLocale = resolveAdminLocale({
    locale: input?.searchParams?.locale,
    localeContext,
  })

  try {
    const pages: CmsPage[] = await runtime.db.pages.listByTenant({
      tenantId: tenant.tenantId,
      locale: activeLocale,
    })

    return {
      tenant,
      runtimeConfig: runtime.config,
      pages,
      localeContext,
      activeLocale,
    }
  } catch (error) {
    console.error("[admin] failed to load pages", error)
    return {
      tenant,
      runtimeConfig: runtime.config,
      pages: [],
      localeContext,
      activeLocale,
      error: true,
    }
  }
}
