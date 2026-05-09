import type { CmsPage } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export type ResolvePublicPageInput = {
  tenantId: string
  locale: string
  slug: string
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

      return (
        pages.find(
          (page) =>
            page.slug === params.slug &&
            page.status !== "archived"
        ) ?? null
      )
    },
  }
}
