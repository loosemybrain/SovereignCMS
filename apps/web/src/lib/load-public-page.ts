import type { BlockInstance, NavigationItem, PreviewContext } from "@sovereign-cms/core"
import type { PageRecord } from "@sovereign-cms/db"
import type { TenantContext } from "@sovereign-cms/tenancy"
import { createRuntime, mapSeoMetadataToPublicViewModel, type PublicSeoViewModel } from "@sovereign-cms/runtime"
import { createPreviewContext } from "@sovereign-cms/core"

const runtime = createRuntime()

export type PublicPagePayload = {
  tenant: TenantContext
  locale: string
  page: PageRecord
  blocks: BlockInstance[]
  navigation: NavigationItem[]
  seo: PublicSeoViewModel
  previewContext: PreviewContext
}

export async function loadPublicPage(input: {
  host: string
  slug: string
  locale: string
  searchParams?: Record<string, string | string[] | undefined>
}): Promise<PublicPagePayload | null> {
  // Create preview context from search params
  const previewContext = createPreviewContext({
    preview: input.searchParams?.preview,
  })

  const tenant = await runtime.tenantResolver.resolveByHost(input.host)
  if (!tenant) return null
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] tenant resolved", tenant.id)
  }

  // Resolve page using public resolution with preview context
  const page = await runtime.publicPageResolution.resolvePage({
    tenantId: tenant.id,
    locale: input.locale,
    slug: input.slug,
    preview: previewContext,
  })
  if (!page) return null
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] page found", page.slug, page.locale, "preview:", previewContext.mode)
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

  // Load navigation with preview context
  const navigation = await runtime.publicNavigationResolution.resolveNavigation({
    tenantId: tenant.id,
    locale: input.locale,
    preview: previewContext,
  })
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] navigation items count", navigation.length)
  }

  // Map SEO metadata
  const seo = mapSeoMetadataToPublicViewModel(page.seo)

  return { tenant, locale: input.locale, page, blocks, navigation, seo, previewContext }
}
