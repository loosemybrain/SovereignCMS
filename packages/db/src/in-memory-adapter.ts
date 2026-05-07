import type {
  BlockRepository,
  PageRecord,
  DatabaseAdapter,
  PageRepository,
  TenantRepository,
  ReplacePageBlocksInput,
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

type MutableStore = {
  pages: InternalPageRow[]
  blocksByPageId: Map<string, BlockRow[]>
}

function normalizeHost(hostHeader: string): string {
  const trimmed = hostHeader.trim().toLowerCase()
  return trimmed.split(":")[0] ?? trimmed
}

function buildStores(): MutableStore {
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

  const blocksDE: BlockRow[] = [heroDE, textDE]
  const blocksEN: BlockRow[] = [heroEN, textEN]

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

  const blocksByPageId = new Map<string, BlockRow[]>([
    [pageDE.id, blocksDE],
    [pageEN.id, blocksEN],
  ])

  return {
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

const tenants: readonly TenantRow[] = [
  {
    id: "demo",
    domain: "localhost",
    slug: "demo",
    displayName: "Demo",
  },
]

function buildAdapterFromStores(store: MutableStore): DatabaseAdapter {
  const tenantRepo: TenantRepository = {
    async findByDomain(host) {
      const key = normalizeHost(host)
      const row = tenants.find((t) => t.domain === key) ?? null
      return row
    },
    async findById(tenantId) {
      return tenants.find((t) => t.id === tenantId) ?? null
    },
  }

  const pageRepo: PageRepository = {
    async findBySlug(input) {
      const p =
        store.pages.find(
          (x) =>
            x.tenantId === input.tenantId &&
            x.slug === input.slug &&
            x.locale === input.locale,
        ) ?? null
      return p ? toCmsPage(p) : null
    },
    async listByTenant(input) {
      let list = store.pages.filter((p) => p.tenantId === input.tenantId)
      if (input.locale !== undefined) {
        list = list.filter((p) => p.locale === input.locale)
      }
      return list.map(toCmsPage)
    },
  }

  const blockRepo: BlockRepository = {
    async listByPage(input) {
      const page = store.pages.find((p) => p.id === input.pageId) ?? null
      if (!page || page.tenantId !== input.tenantId) return []
      const found = store.blocksByPageId.get(input.pageId)
      return found ? found.map(toCmsBlock) : []
    },

    async replacePageBlocks(input: ReplacePageBlocksInput): Promise<CmsBlock[]> {
      // Validate page exists with tenant + locale
      const page = store.pages.find(
        (p) =>
          p.id === input.pageId &&
          p.tenantId === input.tenantId &&
          p.locale === input.locale,
      )

      if (!page) {
        throw new Error(
          `Page not found: tenantId=${input.tenantId}, pageId=${input.pageId}, locale=${input.locale}`,
        )
      }

      // Normalize blocks: renumber sortOrder, update timestamps
      const normalized: BlockRow[] = input.blocks.map((block, index) => ({
        id: block.id,
        pageId: input.pageId,
        tenantId: input.tenantId,
        type: block.type,
        sortOrder: index + 1,
        props: block.props,
        visibility: block.visibility,
        createdAt: block.createdAt,
        updatedAt: new Date().toISOString(),
      }))

      // Update store
      store.blocksByPageId.set(input.pageId, normalized)

      // Return as CmsBlock
      return normalized.map(toCmsBlock)
    },
  }

  return {
    tenants: tenantRepo,
    pages: pageRepo,
    blocks: blockRepo,
  }
}

let cached: DatabaseAdapter | null = null
let cachedStore: MutableStore | null = null

/** In-Memory-Demo: Mandant `demo` / `localhost`, Seite `home`/`de` + `en`, Blöcke hero + text. */
export function createInMemoryAdapter(): DatabaseAdapter {
  if (!cached) {
    cachedStore = buildStores()
    cached = buildAdapterFromStores(cachedStore)
  }
  return cached
}