import type { NavigationScope, PreviewContext } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"
import type { PublicNavigationItemViewModel } from "./public-navigation-view-model"
import { isPubliclyVisible } from "./public-visibility"

export function createPublicNavigationResolution(input: {
  db: DatabaseAdapter
}) {
  return {
    async resolveNavigation(params: {
      tenantId: string
      locale: string
      preview: PreviewContext
      scope?: NavigationScope
    }): Promise<PublicNavigationItemViewModel[]> {
      const scope = params.scope ?? "main"
      const items = await input.db.navigation.listByTenant({
        tenantId: params.tenantId,
        locale: params.locale,
        scope,
      })

      const visibleItems = items.filter((item) =>
        isPubliclyVisible(item.status, params.preview),
      )

      const pages = await input.db.pages.listByTenant({
        tenantId: params.tenantId,
        locale: params.locale,
      })
      const pageById = new Map(pages.map((page) => [page.id, page]))

      return visibleItems
        .map((item): PublicNavigationItemViewModel | null => {
          if (item.type === "external") {
            if (!item.href) {
              return null
            }
            return {
              id: item.id,
              label: item.label,
              type: "external",
              href: item.href,
              status: item.status,
            }
          }

          if (!item.pageId) {
            return null
          }

          const page = pageById.get(item.pageId)
          if (!page) {
            return null
          }
          if (!isPubliclyVisible(page.status, params.preview)) {
            return null
          }

          return {
            id: item.id,
            label: item.label,
            type: "page",
            href: `/${params.locale}/${page.slug}`,
            status: item.status,
          }
        })
        .filter((item): item is PublicNavigationItemViewModel => item !== null)
    },
  }
}
