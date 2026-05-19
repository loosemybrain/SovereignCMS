import type {
  CreateNavigationItemInput,
  CreateNavigationItemResult,
  NavigationItem,
  NavigationScope,
} from "@sovereign-cms/core"
import type { FooterPersistenceAdapter, NavigationPersistenceAdapter } from "@sovereign-cms/db"

type NavigationPersistenceWithFooter = NavigationPersistenceAdapter & FooterPersistenceAdapter

export function createNavigationPersistence(input: {
  navigation: NavigationPersistenceAdapter
}) {
  return {
    async listNavigationItems(params: {
      tenantId: string
      locale?: string
      scope?: NavigationScope
    }): Promise<NavigationItem[]> {
      return input.navigation.listNavigationItems(params)
    },

    async listFooterNavigationItems(params: {
      tenantId: string
      locale?: string
    }): Promise<NavigationItem[]> {
      const navigation = input.navigation as NavigationPersistenceWithFooter
      if (typeof navigation.listFooterNavigationItems === "function") {
        return navigation.listFooterNavigationItems(params)
      }
      return navigation.listNavigationItems({ ...params, scope: "footer" })
    },

    async createNavigationItem(
      createInput: CreateNavigationItemInput,
    ): Promise<CreateNavigationItemResult> {
      const item = await input.navigation.createNavigationItem({
        tenantId: createInput.tenantId,
        input: createInput,
      })
      return {
        success: true,
        item,
        createdAt: new Date().toISOString(),
        persisted: false,
      }
    },
  }
}
