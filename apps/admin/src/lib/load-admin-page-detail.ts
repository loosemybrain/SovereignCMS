import type { CmsBlock, CmsPage, LocaleContext } from "@sovereign-cms/core"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import { createLocaleContext } from "@sovereign-cms/runtime"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { resolveAdminLocale } from "@/lib/resolve-admin-locale"

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
        localeContext,
        activeLocale,
        notFound: true,
      }
    }

    const blocks = await runtime.db.blocks.listByPage({
      tenantId: tenant.tenantId,
      pageId: page.id,
    })

    return {
      tenant,
      runtimeConfig: runtime.config,
      page,
      blocks,
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
      localeContext,
      activeLocale,
      error: true,
    }
  }
}
