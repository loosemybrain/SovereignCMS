import type { ContentStatus } from "./content-status"
import type { SeoMetadata } from "./seo"

export type TenantId = string
export type Locale = string

export type CmsEntityBase = {
  id: string
  tenantId: TenantId
  createdAt: string
  updatedAt: string
}

export type CmsBlockVisibility = "visible" | "hidden" | "scheduled"

export type CmsPage = CmsEntityBase & {
  slug: string
  locale: Locale
  title: string
  status: ContentStatus
  seo: SeoMetadata
}

export type CmsBlock = CmsEntityBase & {
  pageId: string
  type: string
  sortOrder: number
  props: Record<string, unknown>
  visibility: CmsBlockVisibility
}