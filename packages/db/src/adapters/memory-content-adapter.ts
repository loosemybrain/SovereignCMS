import type { CreatePageInput, Locale, TransitionPageStatusInput } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "../contracts"
import type { ContentPersistenceAdapter } from "./types"
import { normalizeAdapterError } from "./errors"
import { requireAdapterTenantId } from "./require-tenant-id"

/**
 * Delegates content reads/writes to an existing {@link DatabaseAdapter} (in-memory or future full DB adapter).
 */
export function createContentAdapterFromDatabase(db: DatabaseAdapter): ContentPersistenceAdapter {
  return {
    async listPages(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listPages")
      try {
        return await db.pages.listByTenant({ ...params, tenantId })
      } catch (error) {
        throw normalizeAdapterError("listPages", error)
      }
    },

    async getPageById(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getPageById")
      try {
        const pages = await db.pages.listByTenant({ tenantId })
        return pages.find((page) => page.id === params.pageId) ?? null
      } catch (error) {
        throw normalizeAdapterError("getPageById", error)
      }
    },

    async getPageBySlug(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getPageBySlug")
      try {
        return await db.pages.findBySlug({ ...params, tenantId })
      } catch (error) {
        throw normalizeAdapterError("getPageBySlug", error)
      }
    },

    async createPage(input) {
      try {
        return await db.pages.create(input)
      } catch (error) {
        throw normalizeAdapterError("createPage", error)
      }
    },

    async transitionPageStatus(input) {
      try {
        return await db.pages.transitionStatus(input)
      } catch (error) {
        throw normalizeAdapterError("transitionPageStatus", error)
      }
    },

    async listBlocks(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listBlocks")
      try {
        return await db.blocks.listByPage({ ...params, tenantId })
      } catch (error) {
        throw normalizeAdapterError("listBlocks", error)
      }
    },

    async saveBlocks(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "saveBlocks")
      try {
        return await db.blocks.replacePageBlocks({
          tenantId,
          pageId: params.pageId,
          locale: params.locale as Locale,
          blocks: params.blocks,
        })
      } catch (error) {
        throw normalizeAdapterError("saveBlocks", error)
      }
    },
  }
}
