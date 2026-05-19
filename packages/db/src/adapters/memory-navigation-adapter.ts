import type { CreateNavigationItemInput } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "../contracts"
import type { FooterPersistenceAdapter, NavigationPersistenceAdapter } from "./types"
import { filterRowsByTenant } from "./assert-operational-read-tenant"
import {
  assertPageOwnedByTenant,
  requireScopedContentTenantId,
} from "./assert-content-write-tenant"
import { normalizeAdapterError } from "./errors"
import { requireAdapterTenantId } from "./require-tenant-id"

export type NavigationPersistenceAdapterWithFooter = NavigationPersistenceAdapter &
  FooterPersistenceAdapter

export function createNavigationAdapterFromDatabase(
  db: DatabaseAdapter,
): NavigationPersistenceAdapterWithFooter {
  return {
    async listNavigationItems(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listNavigationItems")
      try {
        const items = await db.navigation.listByTenant({ ...params, tenantId })
        return filterRowsByTenant(items, tenantId, "listNavigationItems")
      } catch (error) {
        throw normalizeAdapterError("listNavigationItems", error)
      }
    },

    async listFooterNavigationItems(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listFooterNavigationItems")
      try {
        const items = await db.navigation.listByTenant({
          tenantId,
          locale: params.locale,
          scope: "footer",
        })
        return filterRowsByTenant(items, tenantId, "listFooterNavigationItems")
      } catch (error) {
        throw normalizeAdapterError("listFooterNavigationItems", error)
      }
    },

    async createNavigationItem(params) {
      const tenantId = requireScopedContentTenantId(
        params.tenantId,
        params.input.tenantId,
        "createNavigationItem",
      )
      try {
        if (params.input.type === "page" && params.input.pageId) {
          const pages = await db.pages.listByTenant({ tenantId })
          const page =
            pages.find((candidate) => candidate.id === params.input.pageId) ?? null
          assertPageOwnedByTenant(
            page,
            tenantId,
            params.input.pageId,
            "createNavigationItem",
          )
        }

        return await db.navigation.create({ ...params.input, tenantId })
      } catch (error) {
        throw normalizeAdapterError("createNavigationItem", error)
      }
    },
  }
}
