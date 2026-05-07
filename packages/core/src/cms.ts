import type { ContentStatus } from "./content-status"

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
  seo?: Record<string, unknown>
}

export type CmsBlock = CmsEntityBase & {
  pageId: string
  type: string
  sortOrder: number
  props: Record<string, unknown>
  visibility: CmsBlockVisibility
}