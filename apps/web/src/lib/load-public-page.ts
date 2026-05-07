import type { BlockInstance } from "@sovereign-cms/core"
import type { PageRecord } from "@sovereign-cms/db"
import type { TenantContext } from "@sovereign-cms/tenancy"
import { createRuntime } from "@sovereign-cms/runtime"

const runtime = createRuntime()

function isPageRecord(v: unknown): v is PageRecord {
  if (!v || typeof v !== "object") return false
  const o = v as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.tenantId === "string" &&
    typeof o.slug === "string" &&
    typeof o.locale === "string" &&
    typeof o.title === "string" &&
    typeof o.updatedAt === "string"
  )
}

export type PublicPagePayload = {
  tenant: TenantContext
  page: PageRecord
  blocks: BlockInstance[]
}

export async function loadPublicPage(input: {
  host: string
  slug: string
  locale: string
}): Promise<PublicPagePayload | null> {
  const tenant = await runtime.tenantResolver.resolveByHost(input.host)
  if (!tenant) return null
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] tenant resolved", tenant.id)
  }

  const pageRaw = await runtime.db.pages.findBySlug({
    tenantId: tenant.id,
    locale: input.locale,
    slug: input.slug,
  })
  if (!isPageRecord(pageRaw)) return null
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] page found", pageRaw.slug, pageRaw.locale)
  }

  const blocksRaw = await runtime.db.blocks.listByPage({
    tenantId: tenant.id,
    pageId: pageRaw.id,
  })
  const blocks = blocksRaw as BlockInstance[]
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] blocks count", blocks.length)
  }

  return { tenant, page: pageRaw, blocks }
}
