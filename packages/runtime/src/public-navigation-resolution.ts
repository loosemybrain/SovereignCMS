import type { NavigationScope, PreviewContext } from "@sovereign-cms/core"
import type {
  ContentPersistenceAdapter,
  NavigationPersistenceAdapter,
} from "@sovereign-cms/db"
import type { PublicNavigationItemViewModel } from "./public-navigation-view-model"
import { isPubliclyVisible } from "./public-visibility"
import { prepareOperationalRead } from "./tenant/read-authorization-boundary"
import { toTenantRuntimeScope } from "./tenant/resolution"

export function createPublicNavigationResolution(input: {
  navigation: NavigationPersistenceAdapter
  content: ContentPersistenceAdapter
}) {
  return {
    async resolveNavigation(params: {
      tenantId: string
      locale: string
      preview: PreviewContext
      scope?: NavigationScope
    }): Promise<PublicNavigationItemViewModel[]> {
      const readScope = prepareOperationalRead(
        toTenantRuntimeScope({
          tenantId: params.tenantId,
          source: "explicit",
          locale: params.locale,
        }),
        "navigation:read",
      )

      const scope = params.scope ?? "main"
      const items = await input.navigation.listNavigationItems({
        tenantId: readScope.tenantId,
        locale: params.locale,
        scope,
      })

      const visibleItems = items.filter((item) =>
        isPubliclyVisible(item.status, params.preview),
      )

      const pages = await input.content.listPages({
        tenantId: readScope.tenantId,
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
