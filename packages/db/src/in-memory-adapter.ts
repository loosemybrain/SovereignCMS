import type {
  BlockRepository,
  PageRecord,
  DatabaseAdapter,
  PageRepository,
  TenantRepository,
  ReplacePageBlocksInput,
  NavigationRepository,
  MediaRepository,
} from "./contracts"
import type { CmsBlock, MediaAsset, NavigationItem, SeoMetadata } from "@sovereign-cms/core"

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
  seo?: SeoMetadata
  createdAt: string
  updatedAt: string
}

type MutableStore = {
  pages: InternalPageRow[]
  blocksByPageId: Map<string, BlockRow[]>
  navigationItems: NavigationItem[]
  mediaAssets: MediaAsset[]
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
    seo: {
      seoTitle: "SovereignCMS Demo — Startseite",
      seoDescription: "SovereignCMS ist ein modulares, tenant-aware CMS für portable Deployments.",
      seoImageAssetId: null,
      seoImageUrl: "",
      canonicalUrl: "https://sovereign-cms-demo.local/de/home",
      robotsIndex: true,
    },
  }

  // English page (draft for status demo)
  const pageEN: InternalPageRow = {
    id: "page-demo-home-en",
    tenantId: "demo",
    slug: "home",
    locale: "en",
    title: "Home",
    status: "draft",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
    seo: {
      seoTitle: "SovereignCMS Demo — Home",
      seoDescription: "SovereignCMS is a modular, tenant-aware CMS for portable deployments.",
      seoImageAssetId: null,
      seoImageUrl: "",
      canonicalUrl: "https://sovereign-cms-demo.local/en/home",
      robotsIndex: true,
    },
  }

  const blocksByPageId = new Map<string, BlockRow[]>([
    [pageDE.id, blocksDE],
    [pageEN.id, blocksEN],
  ])

  const navigationItems: NavigationItem[] = [
    {
      id: "nav-demo-de-home",
      tenantId: "demo",
      locale: "de",
      label: "Startseite",
      type: "page",
      pageId: pageDE.id,
      sortOrder: 1,
      status: "published",
      createdAt: "2026-05-03T00:00:00.000Z",
      updatedAt: "2026-05-04T00:00:00.000Z",
    },
    {
      id: "nav-demo-en-home",
      tenantId: "demo",
      locale: "en",
      label: "Home",
      type: "page",
      pageId: pageEN.id,
      sortOrder: 1,
      status: "draft",
      createdAt: "2026-05-03T00:00:00.000Z",
      updatedAt: "2026-05-04T00:00:00.000Z",
    },
  ]

  const demoMediaAsset: MediaAsset = {
    id: "media-demo-1",
    tenantId: "demo",
    type: "image",
    title: "Demo Image",
    url: "/placeholder.svg",
    alt: "Demo image",
    status: "draft",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  }

  return {
    pages: [pageDE, pageEN],
    blocksByPageId,
    navigationItems,
    mediaAssets: [demoMediaAsset],
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
    seo: row.seo || {},
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

    async transitionStatus(input) {
      // Import transition logic
      const { getNextStatusForAction } = await import("@sovereign-cms/core")

      // Find page
      const pageIndex = store.pages.findIndex(
        (p) =>
          p.id === input.pageId &&
          p.tenantId === input.tenantId &&
          p.locale === input.locale,
      )

      if (pageIndex === -1) {
        throw new Error(
          `Page not found: tenantId=${input.tenantId}, pageId=${input.pageId}, locale=${input.locale}`,
        )
      }

      const page = store.pages[pageIndex]!
      const nextStatus = getNextStatusForAction(page.status, input.action)

      // Update status
      const updatedPage: InternalPageRow = {
        ...page,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      }

      store.pages[pageIndex] = updatedPage

      return toCmsPage(updatedPage)
    },

    async create(input) {
      // Import validation functions
      const { normalizePageSlug, validatePageSlug, validatePageTitle } = await import(
        "@sovereign-cms/core"
      )

      // Normalize and validate
      const normalizedSlug = normalizePageSlug(input.slug)
      const trimmedTitle = input.title.trim()

      if (!validatePageSlug(normalizedSlug)) {
        throw new Error(`Invalid slug: ${normalizedSlug}`)
      }

      if (!validatePageTitle(trimmedTitle)) {
        throw new Error("Invalid title: must not be empty")
      }

      // Check for duplicate
      const existingPage = store.pages.find(
        (p) =>
          p.tenantId === input.tenantId &&
          p.locale === input.locale &&
          p.slug === normalizedSlug,
      )

      if (existingPage) {
        throw new Error(
          `Page already exists: tenantId=${input.tenantId}, locale=${input.locale}, slug=${normalizedSlug}`,
        )
      }

      // Generate ID
      const id = `page-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

      // Create new page
      const now = new Date().toISOString()
      const newPage: InternalPageRow = {
        id,
        tenantId: input.tenantId,
        slug: normalizedSlug,
        locale: input.locale,
        title: trimmedTitle,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      }

      // Add to store
      store.pages.push(newPage)
      // Initialize empty blocks for this page
      store.blocksByPageId.set(id, [])

      return toCmsPage(newPage)
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

  const navigationRepo: NavigationRepository = {
    async listByTenant(input) {
      let list = store.navigationItems.filter((item) => item.tenantId === input.tenantId)
      if (input.locale !== undefined) {
        list = list.filter((item) => item.locale === input.locale)
      }
      return list.sort((a, b) => a.sortOrder - b.sortOrder)
    },

    async create(input) {
      const { validateNavigationLabel, validateExternalHref } = await import("@sovereign-cms/core")

      const label = input.label.trim()
      if (!validateNavigationLabel(label)) {
        throw new Error("Invalid navigation label")
      }

      if (input.type === "page" && (!input.pageId || input.pageId.trim().length === 0)) {
        throw new Error("Page navigation item requires pageId")
      }

      if (input.type === "external") {
        if (!input.href || !validateExternalHref(input.href)) {
          throw new Error("External navigation item requires a valid href")
        }
      }

      const hasDuplicateLabel = store.navigationItems.some(
        (item) =>
          item.tenantId === input.tenantId &&
          item.locale === input.locale &&
          item.label.toLowerCase() === label.toLowerCase(),
      )
      if (hasDuplicateLabel) {
        throw new Error("Navigation item label already exists for tenant and locale")
      }

      const existingForScope = store.navigationItems.filter(
        (item) => item.tenantId === input.tenantId && item.locale === input.locale,
      )
      const maxSortOrder = existingForScope.length
        ? Math.max(...existingForScope.map((item) => item.sortOrder))
        : 0

      const now = new Date().toISOString()
      const created: NavigationItem = {
        id: `nav-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        tenantId: input.tenantId,
        locale: input.locale,
        label,
        type: input.type,
        pageId: input.type === "page" ? input.pageId : undefined,
        href: input.type === "external" ? input.href?.trim() : undefined,
        sortOrder: maxSortOrder + 1,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      }

      store.navigationItems.push(created)
      return created
    },
  }

  const mediaRepo: MediaRepository = {
    async listByTenant(input) {
      return store.mediaAssets
        .filter((asset) => asset.tenantId === input.tenantId)
        .sort((a, b) => {
          const ta = Date.parse(a.updatedAt)
          const tb = Date.parse(b.updatedAt)
          return tb - ta
        })
    },

    async create(input) {
      const { validateMediaTitle, validateMediaUrl } = await import("@sovereign-cms/core")

      if (!validateMediaTitle(input.title)) {
        throw new Error("Invalid media title")
      }

      if (!validateMediaUrl(input.url)) {
        throw new Error("Invalid media URL")
      }

      const now = new Date().toISOString()
      const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const trimmedTitle = input.title.trim()
      const trimmedAlt = input.alt?.trim()

      const asset: MediaAsset = {
        id,
        tenantId: input.tenantId,
        type: input.type,
        title: trimmedTitle,
        url: input.url.trim(),
        alt: trimmedAlt && trimmedAlt.length > 0 ? trimmedAlt : undefined,
        mimeType: input.mimeType,
        size: input.size,
        width: input.width,
        height: input.height,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      }

      store.mediaAssets.push(asset)
      return asset
    },
  }

  return {
    tenants: tenantRepo,
    pages: pageRepo,
    blocks: blockRepo,
    navigation: navigationRepo,
    media: mediaRepo,
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