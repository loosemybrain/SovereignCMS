import type {
  BlockRepository,
  PageRecord,
  DatabaseAdapter,
  PageRepository,
  TenantRepository,
} from "./contracts"
import type { CmsBlock } from "@sovereign-cms/core"

type TenantRow = {
  id: string
  domain: string
  slug: string
  displayName: string
}

type BlockRow = {
  id: string
  pageId: string
  tenantId: string
  type: string
  sortOrder: number
  props: Record<string, unknown>
  visibility: "visible" | "hidden" | "scheduled"
  createdAt: string
  updatedAt: string
}

type InternalPageRow = {
  id: string
  tenantId: string
  slug: string
  locale: string
  title: string
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
}

function normalizeHost(hostHeader: string): string {
  const trimmed = hostHeader.trim().toLowerCase()
  return trimmed.split(":")[0] ?? trimmed
}

function buildStores(): {
  tenants: readonly TenantRow[]
  pages: readonly InternalPageRow[]
  blocksByPageId: ReadonlyMap<string, readonly BlockRow[]>
} {
  // German blocks
  const heroDE: BlockRow = {
    id: "blk-hero-1",
    pageId: "page-demo-home-de",
    tenantId: "demo",
    type: "hero",
    sortOrder: 1,
    props: {
      headline: "SovereignCMS",
      subline: "Mandanten-Laufzeit — Host → Mandant → Seite → Blöcke",
    },
    visibility: "visible",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  }

  const textDE: BlockRow = {
    id: "blk-text-1",
    pageId: "page-demo-home-de",
    tenantId: "demo",
    type: "text",
    sortOrder: 2,
    props: {
      body: "Diese Seite stammt aus dem In-Memory-Adapter (Phase 2.1, ohne echte Datenbank).",
    },
    visibility: "visible",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  }

  // English blocks
  const heroEN: BlockRow = {
    id: "blk-hero-2",
    pageId: "page-demo-home-en",
    tenantId: "demo",
    type: "hero",
    sortOrder: 1,
    props: {
      headline: "SovereignCMS",
      subline: "Multi-tenant Runtime — Host → Tenant → Page → Blocks",
    },
    visibility: "visible",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  }

  const textEN: BlockRow = {
    id: "blk-text-2",
    pageId: "page-demo-home-en",
    tenantId: "demo",
    type: "text",
    sortOrder: 2,
    props: {
      body: "This page is served from the in-memory adapter (Phase 2.1, no real database).",
    },
    visibility: "visible",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  }

  const blocksDE: readonly BlockRow[] = [heroDE, textDE]
  const blocksEN: readonly BlockRow[] = [heroEN, textEN]

  const tenant: TenantRow = {
    id: "demo",
    domain: "localhost",
    slug: "demo",
    displayName: "Demo",
  }

  // German page
  const pageDE: InternalPageRow = {
    id: "page-demo-home-de",
    tenantId: "demo",
    slug: "home",
    locale: "de",
    title: "Startseite",
    status: "published",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  }

  // English page
  const pageEN: InternalPageRow = {
    id: "page-demo-home-en",
    tenantId: "demo",
    slug: "home",
    locale: "en",
    title: "Home",
    status: "published",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  }

  const blocksByPageId = new Map<string, readonly BlockRow[]>([
    [pageDE.id, blocksDE],
    [pageEN.id, blocksEN],
  ])

  return {
    tenants: [tenant],
    pages: [pageDE, pageEN],
    blocksByPageId,
  }
}

function toCmsPage(row: InternalPageRow): PageRecord {
  return {
    id: row.id,
    tenantId: row.tenantId,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function toCmsBlock(row: BlockRow): CmsBlock {
  return {
    id: row.id,
    tenantId: row.tenantId,
    pageId: row.pageId,
    type: row.type,
    sortOrder: row.sortOrder,
    props: row.props,
    visibility: row.visibility,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function buildAdapterFromStores(stores: ReturnType<typeof buildStores>): DatabaseAdapter {
  const tenantRepo: TenantRepository = {
    async findByDomain(host) {
      const key = normalizeHost(host)
      const row = stores.tenants.find((t) => t.domain === key) ?? null
      return row
    },
    async findById(tenantId) {
      return stores.tenants.find((t) => t.id === tenantId) ?? null
    },
  }

  const pageRepo: PageRepository = {
    async findBySlug(input) {
      const p =
        stores.pages.find(
          (x) =>
            x.tenantId === input.tenantId &&
            x.slug === input.slug &&
            x.locale === input.locale,
        ) ?? null
      return p ? toCmsPage(p) : null
    },
    async listByTenant(input) {
      let list = stores.pages.filter((p) => p.tenantId === input.tenantId)
      if (input.locale !== undefined) {
        list = list.filter((p) => p.locale === input.locale)
      }
      return list.map(toCmsPage)
    },
  }

  const blockRepo: BlockRepository = {
    async listByPage(input) {
      const page = stores.pages.find((p) => p.id === input.pageId) ?? null
      if (!page || page.tenantId !== input.tenantId) return []
      const found = stores.blocksByPageId.get(input.pageId)
      return found ? found.map(toCmsBlock) : []
    },
  }

  return {
    tenants: tenantRepo,
    pages: pageRepo,
    blocks: blockRepo,
  }
}

let cached: DatabaseAdapter | null = null

/** In-Memory-Demo: Mandant `demo` / `localhost`, Seite `home`/`de`, Blöcke hero + text. */
export function createInMemoryAdapter(): DatabaseAdapter {
  if (!cached) {
    cached = buildAdapterFromStores(buildStores())
  }
  return cached
}
