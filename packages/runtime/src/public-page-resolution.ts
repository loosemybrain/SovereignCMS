import type { CmsPage, PreviewContext } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

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

      const page = pages.find(
        (page) =>
          page.slug === params.slug &&
          page.status !== "archived"
      )

      if (!page) return null

      // published: always visible
      if (page.status === "published") {
        return page
      }

      // draft: only visible in preview mode
      if (page.status === "draft" && params.preview.mode === "enabled") {
        return page
      }

      // all other cases: not visible
      return null
    },
  }
}
