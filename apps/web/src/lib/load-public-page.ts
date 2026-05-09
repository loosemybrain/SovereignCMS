import type { BlockInstance, NavigationItem } from "@sovereign-cms/core"
import type { PageRecord } from "@sovereign-cms/db"
import type { TenantContext } from "@sovereign-cms/tenancy"
import { createRuntime, mapSeoMetadataToPublicViewModel, type PublicSeoViewModel } from "@sovereign-cms/runtime"

const runtime = createRuntime()

export type PublicPagePayload = {
  tenant: TenantContext
  locale: string
  page: PageRecord
  blocks: BlockInstance[]
  navigation: NavigationItem[]
  seo: PublicSeoViewModel
}

export async function loadPublicPage(input: {
  host: string
  slug: string
  locale: string
}): Promise<PublicPagePayload | null> {
  const tenant = await runtime.tenantResolver.resolveByHost(input.host)
  if (!tenant) return null
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] tenant resolved", tenant.id)
  }

  // Resolve page using public resolution
  const page = await runtime.publicPageResolution.resolvePage({
    tenantId: tenant.id,
    locale: input.locale,
    slug: input.slug,
  })
  if (!page) return null
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] page found", page.slug, page.locale)
  }

  // Load blocks
  const blocksRaw = await runtime.db.blocks.listByPage({
    tenantId: tenant.id,
    pageId: page.id,
  })
  const blocks = blocksRaw as BlockInstance[]
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] blocks count", blocks.length)
  }

  // Load navigation
  const navigation = await runtime.publicNavigationResolution.resolveNavigation({
    tenantId: tenant.id,
    locale: input.locale,
  })
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] navigation items count", navigation.length)
  }

  // Map SEO metadata
  const seo = mapSeoMetadataToPublicViewModel(page.seo)

  return { tenant, locale: input.locale, page, blocks, navigation, seo }
}
