import type { NavigationItem } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export function createPublicNavigationResolution(input: {
  db: DatabaseAdapter
}) {
  return {
    async resolveNavigation(params: {
      tenantId: string
      locale: string
    }): Promise<NavigationItem[]> {
      const items = await input.db.navigation.listByTenant({
        tenantId: params.tenantId,
        locale: params.locale,
      })

      return items.filter(
        (item) => item.status !== "archived"
      )
    },
  }
}
