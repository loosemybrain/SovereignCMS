import type { CreatePageInput, Locale, TransitionPageStatusInput } from "@sovereign-cms/core"
import type { DatabaseAdapter } from "../contracts"
import type { ContentPersistenceAdapter } from "./types"
import {
  assertPageOwnedByTenant,
  requireScopedContentTenantId,
} from "./assert-content-write-tenant"
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

    async createPage(params) {
      const tenantId = requireScopedContentTenantId(
        params.tenantId,
        params.input.tenantId,
        "createPage",
      )
      try {
        return await db.pages.create({ ...params.input, tenantId })
      } catch (error) {
        throw normalizeAdapterError("createPage", error)
      }
    },

    async transitionPageStatus(params) {
      const tenantId = requireScopedContentTenantId(
        params.tenantId,
        params.input.tenantId,
        "transitionPageStatus",
      )
      try {
        const existing = await db.pages.listByTenant({ tenantId })
        const page =
          existing.find(
            (candidate) =>
              candidate.id === params.input.pageId && candidate.locale === params.input.locale,
          ) ?? null
        assertPageOwnedByTenant(page, tenantId, params.input.pageId, "transitionPageStatus")
        return await db.pages.transitionStatus({ ...params.input, tenantId })
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
        const pages = await db.pages.listByTenant({ tenantId })
        const page = pages.find((candidate) => candidate.id === params.pageId) ?? null
        assertPageOwnedByTenant(page, tenantId, params.pageId, "saveBlocks")
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
