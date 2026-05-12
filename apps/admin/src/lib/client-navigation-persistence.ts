/**
 * This client adapter delegates to server-side navigation boundaries.
 */
import type { CreateNavigationItemInput, NavigationScope } from "@sovereign-cms/core"
import { createNavigationItemAction } from "@/actions/create-navigation-item"
import { loadNavigationItemsAction } from "@/actions/load-navigation-items"

export const clientNavigationPersistence = {
  async listNavigationItems(input: {
    tenantId: string
    locale?: string
    scope?: NavigationScope
  }) {
    return loadNavigationItemsAction(input)
  },

  async createNavigationItem(input: CreateNavigationItemInput) {
    return createNavigationItemAction(input)
  },
}
