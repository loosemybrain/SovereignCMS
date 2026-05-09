import type { NavigationItem, PreviewContext } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export function createPublicNavigationResolution(input: {
  db: DatabaseAdapter
}) {
  return {
    async resolveNavigation(params: {
      tenantId: string
      locale: string
      preview: PreviewContext
    }): Promise<NavigationItem[]> {
      const items = await input.db.navigation.listByTenant({
        tenantId: params.tenantId,
        locale: params.locale,
      })

      return items.filter((item) => {
        // archived: never visible
        if (item.status === "archived") {
          return false
        }

        // published: always visible
        if (item.status === "published") {
          return true
        }

        // draft: only visible in preview mode
        if (item.status === "draft" && params.preview.mode === "enabled") {
          return true
        }

        // all other cases: not visible
        return false
      })
    },
  }
}
