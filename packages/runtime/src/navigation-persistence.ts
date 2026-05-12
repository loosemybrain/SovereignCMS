import type {
  CreateNavigationItemInput,
  CreateNavigationItemResult,
  NavigationItem,
  NavigationScope,
} from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export function createNavigationPersistence(input: { db: DatabaseAdapter }) {
  return {
    async listNavigationItems(params: {
      tenantId: string
      locale?: string
      scope?: NavigationScope
    }): Promise<NavigationItem[]> {
      return input.db.navigation.listByTenant(params)
    },

    async createNavigationItem(
      createInput: CreateNavigationItemInput,
    ): Promise<CreateNavigationItemResult> {
      const item = await input.db.navigation.create(createInput)
      return {
        success: true,
        item,
        createdAt: new Date().toISOString(),
        persisted: false,
      }
    },
  }
}
