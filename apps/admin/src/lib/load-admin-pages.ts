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
  activeLocalePagesCount: number
  pageVariantsCount: number
  logicalPagesCount: number
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
    // Load pages for active locale
    const pages: CmsPage[] = await runtime.content.listPages({
      tenantId: tenant.tenantId,
      locale: activeLocale,
    })

    // Load all locale variants to calculate counts
    const allLocalePages: CmsPage[] = await runtime.content.listPages({
      tenantId: tenant.tenantId,
    })

    // Calculate counts
    const activeLocalePagesCount = pages.length
    const pageVariantsCount = allLocalePages.length

    // Count unique slugs across all locales
    const uniqueSlugs = new Set(allLocalePages.map((p) => p.slug))
    const logicalPagesCount = uniqueSlugs.size

    return {
      tenant,
      runtimeConfig: runtime.config,
      pages,
      localeContext,
      activeLocale,
      activeLocalePagesCount,
      pageVariantsCount,
      logicalPagesCount,
    }
  } catch (error) {
    console.error("[admin] failed to load pages", error)
    return {
      tenant,
      runtimeConfig: runtime.config,
      pages: [],
      localeContext,
      activeLocale,
      activeLocalePagesCount: 0,
      pageVariantsCount: 0,
      logicalPagesCount: 0,
      error: true,
    }
  }
}
