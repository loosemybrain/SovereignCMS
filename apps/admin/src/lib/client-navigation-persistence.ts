/**
 * This client adapter delegates to server-side navigation boundaries.
 */
import type { CreateNavigationItemInput } from "@sovereign-cms/core"
import { createNavigationItemAction } from "@/actions/create-navigation-item"
import { loadNavigationItemsAction } from "@/actions/load-navigation-items"

export const clientNavigationPersistence = {
  async listNavigationItems(input: { tenantId: string; locale?: string }) {
    return loadNavigationItemsAction(input)
  },

  async createNavigationItem(input: CreateNavigationItemInput) {
    return createNavigationItemAction(input)
  },
}
