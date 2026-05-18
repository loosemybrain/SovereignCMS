import type { CmsPage, PreviewContext } from "@sovereign-cms/core"
import type { ContentPersistenceAdapter } from "@sovereign-cms/db"
import { isPubliclyVisible } from "./public-visibility"
import { assertTenantScope, type TenantRuntimeScope } from "./tenant/scope"

export type ResolvePublicPageInput = {
  tenantId: string
  locale: string
  slug: string
  preview: PreviewContext
  brand?: string
}

export function toPublicPageTenantScope(
  input: Pick<ResolvePublicPageInput, "tenantId" | "locale" | "brand">,
): TenantRuntimeScope {
  return assertTenantScope({
    tenantId: input.tenantId,
    locale: input.locale,
    brand: input.brand,
  })
}

export function createPublicPageResolution(input: {
  content: ContentPersistenceAdapter
}) {
  return {
    async resolvePage(
      params: ResolvePublicPageInput
    ): Promise<CmsPage | null> {
      const scope = toPublicPageTenantScope(params)
      const page = await input.content.getPageBySlug({
        tenantId: scope.tenantId,
        locale: scope.locale ?? params.locale,
        slug: params.slug,
      })

      if (!page) return null

      return isPubliclyVisible(page.status, params.preview) ? page : null
    },
  }
}
