import type { CmsBlock, CmsPage } from "@sovereign-cms/core"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

export async function loadAdminPageDetail(input: {
  host?: string
  slug: string
  locale?: string
}): Promise<{
  tenant: ReturnType<typeof getAdminRuntime>["tenant"]
  runtimeConfig: RuntimeConfig
  page: CmsPage | null
  blocks: CmsBlock[]
  locale: string
  supportedLocales: string[]
  error?: boolean
  notFound?: boolean
}> {
  const { runtime, tenant } = getAdminRuntime({ host: input.host })
  const locale = input.locale ?? runtime.config.defaultLocale

  try {
    const page = await runtime.db.pages.findBySlug({
      tenantId: tenant.tenantId,
      locale,
      slug: input.slug,
    })

    if (!page) {
      return {
        tenant,
        runtimeConfig: runtime.config,
        page: null,
        blocks: [],
        locale,
        supportedLocales: runtime.config.supportedLocales,
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
      locale,
      supportedLocales: runtime.config.supportedLocales,
    }
  } catch (error) {
    console.error("[admin] failed to load page detail", error)
    return {
      tenant,
      runtimeConfig: runtime.config,
      page: null,
      blocks: [],
      locale,
      supportedLocales: runtime.config.supportedLocales,
      error: true,
    }
  }
}
