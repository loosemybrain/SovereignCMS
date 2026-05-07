import type { CmsBlock, CmsPage } from "@sovereign-cms/core"

export type PageRecord = CmsPage

export interface TenantRepository {
  findByDomain(host: string): Promise<unknown | null>
  findById(tenantId: string): Promise<unknown | null>
}

export interface PageRepository {
  findBySlug(input: {
    tenantId: string
    locale: string
    slug: string
  }): Promise<CmsPage | null>

  listByTenant(input: { tenantId: string; locale?: string }): Promise<CmsPage[]>
}

export interface BlockRepository {
  listByPage(input: { tenantId: string; pageId: string }): Promise<CmsBlock[]>
}

export interface DatabaseAdapter {
  tenants: TenantRepository
  pages: PageRepository
  blocks: BlockRepository
}
