import type {
  CmsBlock,
  CmsPage,
  CreatePageInput,
  Locale,
  TransitionPageStatusInput,
} from "@sovereign-cms/core"
import type { ContentPersistenceAdapter } from "../types"
import { PersistenceAdapterError, normalizeAdapterError } from "../errors"
import { requireAdapterTenantId } from "../require-tenant-id"
import type { SupabaseContentClientPort } from "./client-port"
import { mapSupabaseBlockRow, mapSupabasePageRow } from "./row-mappers"

function assertMappedPageTenant(page: CmsPage, tenantId: string, operation: string): void {
  if (page.tenantId !== tenantId) {
    throw new PersistenceAdapterError(
      "tenant_scope_mismatch",
      `${operation}: page tenant ${page.tenantId} does not match scope ${tenantId}`,
    )
  }
}

function assertMappedBlockTenant(block: CmsBlock, tenantId: string, operation: string): void {
  if (block.tenantId !== tenantId) {
    throw new PersistenceAdapterError(
      "tenant_scope_mismatch",
      `${operation}: block tenant ${block.tenantId} does not match scope ${tenantId}`,
    )
  }
}

function assertNoQueryError(
  operation: string,
  error: { message: string; code?: string } | null,
): void {
  if (!error) return
  throw new PersistenceAdapterError(
    "supabase_query_failed",
    `${operation} failed: ${error.message}`,
  )
}

/**
 * Supabase-backed content reads via a provider-neutral client port.
 * Writes are intentionally not implemented in Phase 66.
 */
export function createSupabaseContentAdapter(
  client: SupabaseContentClientPort,
): ContentPersistenceAdapter {
  return {
    async listPages(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listPages")
      try {
        const result = await client.listPages({ ...params, tenantId })
        assertNoQueryError("listPages", result.error)
        return (result.data ?? []).map((row) => {
          const page = mapSupabasePageRow(row)
          assertMappedPageTenant(page, tenantId, "listPages")
          return page
        })
      } catch (error) {
        throw normalizeAdapterError("listPages", error)
      }
    },

    async getPageById(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getPageById")
      try {
        const result = await client.getPageById({ ...params, tenantId })
        assertNoQueryError("getPageById", result.error)
        if (!result.data) return null
        const page = mapSupabasePageRow(result.data)
        assertMappedPageTenant(page, tenantId, "getPageById")
        return page
      } catch (error) {
        throw normalizeAdapterError("getPageById", error)
      }
    },

    async getPageBySlug(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "getPageBySlug")
      try {
        const result = await client.getPageBySlug({ ...params, tenantId })
        assertNoQueryError("getPageBySlug", result.error)
        if (!result.data) return null
        const page = mapSupabasePageRow(result.data)
        assertMappedPageTenant(page, tenantId, "getPageBySlug")
        return page
      } catch (error) {
        throw normalizeAdapterError("getPageBySlug", error)
      }
    },

    async createPage(_input: CreatePageInput) {
      throw new PersistenceAdapterError(
        "not_implemented",
        "Supabase createPage is not implemented in Phase 66",
      )
    },

    async transitionPageStatus(_input: TransitionPageStatusInput) {
      throw new PersistenceAdapterError(
        "not_implemented",
        "Supabase transitionPageStatus is not implemented in Phase 66",
      )
    },

    async listBlocks(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listBlocks")
      try {
        const result = await client.listBlocks({ ...params, tenantId })
        assertNoQueryError("listBlocks", result.error)
        return (result.data ?? []).map((row) => {
          const block = mapSupabaseBlockRow(row)
          assertMappedBlockTenant(block, tenantId, "listBlocks")
          return block
        })
      } catch (error) {
        throw normalizeAdapterError("listBlocks", error)
      }
    },

    async saveBlocks(_params: {
      tenantId: string
      pageId: string
      locale: Locale
      blocks: import("@sovereign-cms/core").CmsBlock[]
    }) {
      throw new PersistenceAdapterError(
        "not_implemented",
        "Supabase saveBlocks is not implemented in Phase 66",
      )
    },
  }
}
