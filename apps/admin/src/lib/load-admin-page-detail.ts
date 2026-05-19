import type { CmsBlock, CmsPage, LocaleContext, NavigationItem } from "@sovereign-cms/core"
import type { PageGovernanceNavigationItem } from "@/lib/page-governance"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import type { PublishGovernanceIssue } from "@sovereign-cms/core"
import { mediaCompositionGovernanceIssues } from "@sovereign-cms/core"
import {
  composeAdminPreviewBlockMedia,
  createLocaleContext,
  resolveAdminTenantContext,
  resolvePreviewTenantContext,
  toTenantRuntimeScope,
} from "@sovereign-cms/runtime"
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
    preview?: string
  }
}): Promise<{
  tenant: ReturnType<typeof getAdminRuntime>["tenant"]
  runtimeConfig: RuntimeConfig
  page: CmsPage | null
  blocks: CmsBlock[]
  mediaCompositionGovernanceHints: PublishGovernanceIssue[]
  navigationGovernanceItems: PageGovernanceNavigationItem[]
  localeContext: LocaleContext
  activeLocale: string
  error?: boolean
  notFound?: boolean
}> {
  const { runtime, tenant, resolved: adminResolved } = getAdminRuntime({ host: input.host })

  const localeContext = createLocaleContext({
    locale: runtime.config.defaultLocale,
    supportedLocales: runtime.config.supportedLocales,
    defaultLocale: runtime.config.defaultLocale,
  })

  const activeLocale = resolveAdminLocale({
    locale: input?.searchParams?.locale,
    localeContext,
  })

  const isPreviewRequest =
    input.searchParams?.preview === "1" || input.searchParams?.preview === "true"

  const resolved = isPreviewRequest
    ? resolvePreviewTenantContext({
        tenantId: adminResolved.tenantId,
        locale: activeLocale,
      })
    : resolveAdminTenantContext({
        explicitTenantId: process.env.LOCAL_TENANT_ID,
        selectedTenantId: tenant.tenantId,
        locale: activeLocale,
        host: input.host,
      })

  const tenantScope = toTenantRuntimeScope(resolved)

  try {
    const page = await runtime.content.getPageBySlug({
      tenantId: tenantScope.tenantId,
      locale: tenantScope.locale ?? activeLocale,
      slug: input.slug,
    })

    if (!page) {
      return {
        tenant,
        runtimeConfig: runtime.config,
        page: null,
        blocks: [],
        mediaCompositionGovernanceHints: [],
        navigationGovernanceItems: [],
        localeContext,
        activeLocale,
        notFound: true,
      }
    }

    const [blocksRaw, navigationItems] = await Promise.all([
      runtime.content.listBlocks({
        tenantId: tenantScope.tenantId,
        pageId: page.id,
      }),
      runtime.navigationPersistence.listNavigationItems({
        tenantId: tenantScope.tenantId,
        locale: tenantScope.locale ?? activeLocale,
      }),
    ])

    const mediaComposition = await composeAdminPreviewBlockMedia({
      tenantId: tenantScope.tenantId,
      blocks: blocksRaw,
      mediaResolver: runtime.mediaResolver,
    })

    return {
      tenant,
      runtimeConfig: runtime.config,
      page,
      blocks: mediaComposition.value,
      mediaCompositionGovernanceHints: mediaCompositionGovernanceIssues(mediaComposition),
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
      mediaCompositionGovernanceHints: [],
      navigationGovernanceItems: [],
      localeContext,
      activeLocale,
      error: true,
    }
  }
}
