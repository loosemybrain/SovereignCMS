import type { CmsBlock, CmsPage, LocaleContext, NavigationItem } from "@sovereign-cms/core"
import type { PageGovernanceNavigationItem } from "@/lib/page-governance"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import { createLocaleContext } from "@sovereign-cms/runtime"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { resolveAdminLocale } from "@/lib/resolve-admin-locale"

function toGovernanceNavigationItems(items: NavigationItem[]): PageGovernanceNavigationItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    type: item.type,
    pageId: item.pageId,
    href: item.href,
    scope: item.scope,
  }))
}

export async function loadAdminPageDetail(input: {
  host?: string
  slug: string
  searchParams?: {
    locale?: string
  }
}): Promise<{
  tenant: ReturnType<typeof getAdminRuntime>["tenant"]
  runtimeConfig: RuntimeConfig
  page: CmsPage | null
  blocks: CmsBlock[]
  navigationGovernanceItems: PageGovernanceNavigationItem[]
  localeContext: LocaleContext
  activeLocale: string
  error?: boolean
  notFound?: boolean
}> {
  const { runtime, tenant } = getAdminRuntime({ host: input.host })

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
    const page = await runtime.db.pages.findBySlug({
      tenantId: tenant.tenantId,
      locale: activeLocale,
      slug: input.slug,
    })

    if (!page) {
      return {
        tenant,
        runtimeConfig: runtime.config,
        page: null,
        blocks: [],
        navigationGovernanceItems: [],
        localeContext,
        activeLocale,
        notFound: true,
      }
    }

    const [blocks, navigationItems] = await Promise.all([
      runtime.db.blocks.listByPage({
        tenantId: tenant.tenantId,
        pageId: page.id,
      }),
      runtime.db.navigation.listByTenant({
        tenantId: tenant.tenantId,
        locale: activeLocale,
      }),
    ])

    return {
      tenant,
      runtimeConfig: runtime.config,
      page,
      blocks,
      navigationGovernanceItems: toGovernanceNavigationItems(navigationItems),
      localeContext,
      activeLocale,
    }
  } catch (error) {
    console.error("[admin] failed to load page detail", error)
    return {
      tenant,
      runtimeConfig: runtime.config,
      page: null,
      blocks: [],
      navigationGovernanceItems: [],
      localeContext,
      activeLocale,
      error: true,
    }
  }
}
