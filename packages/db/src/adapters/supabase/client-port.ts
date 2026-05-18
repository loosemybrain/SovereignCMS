/**
 * Provider-neutral query port for Supabase content reads.
 * Implemented in `@sovereign-cms/adapter-supabase` (server-side, optional SDK).
 */

export type SupabasePageRow = {
  id: string
  tenant_id: string
  locale: string
  slug: string
  title: string
  status: string
  seo: unknown
  created_at: string
  updated_at: string
}

export type SupabaseBlockRow = {
  id: string
  tenant_id: string
  page_id: string
  type: string
  sort_order: number
  props: unknown
  visibility: string
  created_at: string
  updated_at: string
}

export type SupabaseQueryError = {
  message: string
  code?: string
}

export type SupabaseQueryResult<T> = {
  data: T | null
  error: SupabaseQueryError | null
}

export interface SupabaseContentClientPort {
  listPages(input: {
    tenantId: string
    locale?: string
  }): Promise<SupabaseQueryResult<SupabasePageRow[]>>

  getPageBySlug(input: {
    tenantId: string
    locale: string
    slug: string
  }): Promise<SupabaseQueryResult<SupabasePageRow | null>>

  getPageById(input: {
    tenantId: string
    pageId: string
  }): Promise<SupabaseQueryResult<SupabasePageRow | null>>

  listBlocks(input: {
    tenantId: string
    pageId: string
  }): Promise<SupabaseQueryResult<SupabaseBlockRow[]>>
}
