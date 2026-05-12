import type { CmsPage, PreviewContext } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"
import { isPubliclyVisible } from "./public-visibility"

export type ResolvePublicPageInput = {
  tenantId: string
  locale: string
  slug: string
  preview: PreviewContext
}

export function createPublicPageResolution(input: {
  db: DatabaseAdapter
}) {
  return {
    async resolvePage(
      params: ResolvePublicPageInput
    ): Promise<CmsPage | null> {
      const pages = await input.db.pages.listByTenant({
        tenantId: params.tenantId,
        locale: params.locale,
      })

      const page = pages.find((page) => page.slug === params.slug)

      if (!page) return null

      return isPubliclyVisible(page.status, params.preview) ? page : null
    },
  }
}
