import type { BlockInstance, PreviewContext } from "@sovereign-cms/core"
import type { PageRecord } from "@sovereign-cms/db"
import type { TenantContext } from "@sovereign-cms/tenancy"
import {
  assertTenantScope,
  createRuntime,
  mapSeoMetadataToPublicViewModel,
  mapSettingsToPublicFooterViewModel,
  mapSettingsToPublicHeaderViewModel,
  type PublicFooterViewModel,
  type PublicHeaderViewModel,
  type PublicNavigationItemViewModel,
  type PublicSeoViewModel,
} from "@sovereign-cms/runtime"
import { createPreviewContext } from "@sovereign-cms/core"

const runtime = createRuntime()

export type PublicPagePayload = {
  tenant: TenantContext
  locale: string
  page: PageRecord
  blocks: BlockInstance[]
  navigation: PublicNavigationItemViewModel[]
  seo: PublicSeoViewModel
  previewContext: PreviewContext
  footer: PublicFooterViewModel
  header: PublicHeaderViewModel
  contactEmail?: string
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

  const tenantScope = assertTenantScope({
    tenantId: tenant.id,
    locale: input.locale,
  })

  // Resolve page using public resolution with preview context
  const page = await runtime.publicPageResolution.resolvePage({
    tenantId: tenantScope.tenantId,
    locale: tenantScope.locale ?? input.locale,
    slug: input.slug,
    preview: previewContext,
  })
  if (!page) return null
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] page found", page.slug, page.locale, "preview:", previewContext.mode)
  }

  // Load blocks
  const blocksRaw = await runtime.content.listBlocks({
    tenantId: tenantScope.tenantId,
    pageId: page.id,
  })
  const blocks = blocksRaw.filter((block) => block.visibility === "visible") as BlockInstance[]
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] blocks count", blocks.length)
  }

  const navigation = await runtime.publicNavigationResolution.resolveNavigation({
    tenantId: tenantScope.tenantId,
    locale: input.locale,
    preview: previewContext,
    scope: "main",
  })
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] main navigation items count", navigation.length)
  }

  const footerNavigation = await runtime.publicNavigationResolution.resolveNavigation({
    tenantId: tenantScope.tenantId,
    locale: input.locale,
    preview: previewContext,
    scope: "footer",
  })
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] footer navigation items count", footerNavigation.length)
  }

  const settings = await runtime.settingsPersistence.getTenantSettings({
    tenantId: tenantScope.tenantId,
  })

  const footer = mapSettingsToPublicFooterViewModel({
    settings,
    navigationItems: footerNavigation.map((item) => ({
      label: item.label,
      href: item.href,
    })),
    locale: input.locale,
  })

  const slugParts = input.slug.split("/").filter((s) => s.length > 0)
  const currentPath = `/${[input.locale, ...slugParts].join("/")}`

  const header = mapSettingsToPublicHeaderViewModel({
    settings,
    navigationItems: navigation.map((item) => ({
      label: item.label,
      href: item.href,
    })),
    currentPath,
    currentLocale: input.locale,
    supportedLocales: runtime.config.supportedLocales,
  })

  // Map SEO metadata
  const seo = mapSeoMetadataToPublicViewModel(page.seo)

  return {
    tenant,
    locale: input.locale,
    page,
    blocks,
    navigation,
    seo,
    previewContext,
    footer,
    header,
    contactEmail: settings.contact.email,
  }
}
