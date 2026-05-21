import type {
  BlockRepository,
  PageRecord,
  DatabaseAdapter,
  PageRepository,
  TenantRepository,
  ReplacePageBlocksInput,
  NavigationRepository,
  MediaRepository,
  SettingsRepository,
  PrivacyScanRepository,
} from "./contracts"
import type {
  CmsBlock,
  MediaAsset,
  NavigationItem,
  SeoMetadata,
  TenantSettings,
  UpdateTenantSettingsInput,
  PrivacyScanJob,
  CreatePrivacyScanInput,
  UpdatePrivacyScanApprovalInput,
} from "@sovereign-cms/core"
import { createDefaultTenantSettings, createDefaultTenantAppearanceSettings } from "@sovereign-cms/core"
import { nanoid } from "nanoid"

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
  tenantSettingsByTenantId: Map<string, TenantSettings>
  privacyScanJobs: PrivacyScanJob[]
}

function cloneTenantSettings(settings: TenantSettings): TenantSettings {
  return {
    ...settings,
    siteIdentity: { ...settings.siteIdentity },
    contact: { ...settings.contact },
    business: { ...settings.business },
    legal: { ...settings.legal },
    socialLinks: settings.socialLinks.map((link) => ({ ...link })),
    appearance: settings.appearance
      ? {
          themeTokens: { ...settings.appearance.themeTokens },
          customFonts: settings.appearance.customFonts.map((font) => ({ ...font })),
          spinner: { ...settings.appearance.spinner },
        }
      : createDefaultTenantAppearanceSettings(),
  }
}

function mergeTenantSettingsPatch(
  base: TenantSettings,
  patch: UpdateTenantSettingsInput["settings"],
): TenantSettings {
  const now = new Date().toISOString()
  return {
    tenantId: base.tenantId,
    siteIdentity: patch.siteIdentity
      ? { ...base.siteIdentity, ...patch.siteIdentity }
      : { ...base.siteIdentity },
    contact: patch.contact ? { ...base.contact, ...patch.contact } : { ...base.contact },
    business: patch.business ? { ...base.business, ...patch.business } : { ...base.business },
    legal: patch.legal ? { ...base.legal, ...patch.legal } : { ...base.legal },
    socialLinks:
      patch.socialLinks !== undefined
        ? patch.socialLinks.map((link) => ({ ...link }))
        : base.socialLinks.map((link) => ({ ...link })),
    appearance: patch.appearance
      ? {
          themeTokens: patch.appearance.themeTokens
            ? { ...base.appearance.themeTokens, ...patch.appearance.themeTokens }
            : { ...base.appearance.themeTokens },
          customFonts:
            patch.appearance.customFonts !== undefined
              ? patch.appearance.customFonts.map((font) => ({ ...font }))
              : base.appearance.customFonts.map((font) => ({ ...font })),
          spinner: patch.appearance.spinner
            ? { ...base.appearance.spinner, ...patch.appearance.spinner }
            : { ...base.appearance.spinner },
        }
      : {
          themeTokens: { ...base.appearance.themeTokens },
          customFonts: base.appearance.customFonts.map((font) => ({ ...font })),
          spinner: { ...base.appearance.spinner },
        },
    updatedAt: now,
  }
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
      scope: "main",
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
      scope: "main",
      label: "Home",
      type: "page",
      pageId: pageEN.id,
      sortOrder: 1,
      status: "draft",
      createdAt: "2026-05-03T00:00:00.000Z",
      updatedAt: "2026-05-04T00:00:00.000Z",
    },
    {
      id: "nav-demo-footer-de-privacy",
      tenantId: "demo",
      locale: "de",
      scope: "footer",
      label: "Datenschutz",
      type: "external",
      href: "/de/datenschutz",
      sortOrder: 1,
      status: "published",
      createdAt: "2026-05-03T00:00:00.000Z",
      updatedAt: "2026-05-04T00:00:00.000Z",
    },
    {
      id: "nav-demo-footer-de-imprint",
      tenantId: "demo",
      locale: "de",
      scope: "footer",
      label: "Impressum",
      type: "external",
      href: "/de/impressum",
      sortOrder: 2,
      status: "published",
      createdAt: "2026-05-03T00:00:00.000Z",
      updatedAt: "2026-05-04T00:00:00.000Z",
    },
    {
      id: "nav-demo-footer-de-cookies",
      tenantId: "demo",
      locale: "de",
      scope: "footer",
      label: "Cookies",
      type: "external",
      href: "/de/cookies",
      sortOrder: 3,
      status: "published",
      createdAt: "2026-05-03T00:00:00.000Z",
      updatedAt: "2026-05-04T00:00:00.000Z",
    },
    {
      id: "nav-demo-footer-en-privacy",
      tenantId: "demo",
      locale: "en",
      scope: "footer",
      label: "Privacy",
      type: "external",
      href: "/en/datenschutz",
      sortOrder: 1,
      status: "published",
      createdAt: "2026-05-03T00:00:00.000Z",
      updatedAt: "2026-05-04T00:00:00.000Z",
    },
    {
      id: "nav-demo-footer-en-cookies",
      tenantId: "demo",
      locale: "en",
      scope: "footer",
      label: "Cookies",
      type: "external",
      href: "/en/cookies",
      sortOrder: 2,
      status: "published",
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

  const tenantSettingsByTenantId = new Map<string, TenantSettings>()
  const demoSettings: TenantSettings = {
    tenantId: "demo",
    siteIdentity: {
      siteName: "SovereignCMS Demo",
      tagline: "Modular CMS Foundation",
      logoUrl: "",
    },
    contact: {
      email: "info@example.com",
      phone: "",
      city: "Templin",
      country: "Deutschland",
    },
    business: {},
    socialLinks: [],
    legal: {
      imprintSlug: "impressum",
      privacySlug: "datenschutz",
      cookieSlug: "cookies",
    },
    appearance: createDefaultTenantAppearanceSettings(),
    updatedAt: new Date().toISOString(),
  }
  tenantSettingsByTenantId.set("demo", demoSettings)

  // Demo privacy scan (optional, shows the scanner in action)
  const demoPrivacyScan: PrivacyScanJob = {
    id: "scan-demo-1",
    tenantId: "demo",
    locale: "de",
    targetUrl: "https://example.com",
    status: "completed",
    approvalStatus: "draft",
    findings: [
      {
        id: "finding-1",
        type: "external-request",
        name: "Google Maps Embed",
        provider: "google-maps",
        category: "external-media",
        sourceUrl: "https://www.google.com/maps/embed?pb=...",
        description: "External iframe from Google Maps (properly gated by consent)",
        detectedBeforeConsent: false,
        createdAt: "2026-05-11T10:00:00.000Z",
      },
      {
        id: "finding-2",
        type: "iframe",
        name: "External Embed",
        provider: "google-maps",
        category: "external-media",
        description: "Embedded map content",
        detectedBeforeConsent: false,
        createdAt: "2026-05-11T10:00:00.000Z",
      },
    ],
    createdAt: "2026-05-11T10:00:00.000Z",
    updatedAt: "2026-05-11T10:00:00.000Z",
    completedAt: "2026-05-11T10:05:00.000Z",
  }

  return {
    pages: [pageDE, pageEN],
    blocksByPageId,
    navigationItems,
    mediaAssets: [demoMediaAsset],
    tenantSettingsByTenantId,
    privacyScanJobs: [demoPrivacyScan],
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
      if (input.scope !== undefined) {
        list = list.filter((item) => item.scope === input.scope)
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

      const scope = input.scope ?? "main"

      const hasDuplicateLabel = store.navigationItems.some(
        (item) =>
          item.tenantId === input.tenantId &&
          item.locale === input.locale &&
          item.scope === scope &&
          item.label.toLowerCase() === label.toLowerCase(),
      )
      if (hasDuplicateLabel) {
        throw new Error("Navigation item label already exists for tenant, locale, and scope")
      }

      const existingForScope = store.navigationItems.filter(
        (item) =>
          item.tenantId === input.tenantId && item.locale === input.locale && item.scope === scope,
      )
      const maxSortOrder = existingForScope.length
        ? Math.max(...existingForScope.map((item) => item.sortOrder))
        : 0

      const now = new Date().toISOString()
      const created: NavigationItem = {
        id: `nav-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        tenantId: input.tenantId,
        locale: input.locale,
        scope,
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

    async updateMetadata(input) {
      if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
        throw new Error("media.updateMetadata: tenantId is required")
      }

      const index = store.mediaAssets.findIndex(
        (candidate) => candidate.id === input.mediaId && candidate.tenantId === input.tenantId,
      )
      if (index < 0) {
        return null
      }

      const current = store.mediaAssets[index]
      const now = new Date().toISOString()
      const patch = input.patch

      const next: MediaAsset = {
        ...current,
        ...(patch.type !== undefined ? { type: patch.type } : {}),
        ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
        ...(patch.url !== undefined ? { url: patch.url.trim() } : {}),
        ...(patch.alt !== undefined ? { alt: patch.alt?.trim() || undefined } : {}),
        ...(patch.mimeType !== undefined ? { mimeType: patch.mimeType } : {}),
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        updatedAt: now,
      }

      store.mediaAssets[index] = next
      return next
    },

    async archive(input) {
      if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
        throw new Error("media.archive: tenantId is required")
      }

      const index = store.mediaAssets.findIndex(
        (candidate) => candidate.id === input.mediaId && candidate.tenantId === input.tenantId,
      )
      if (index < 0) {
        return null
      }

      const now = new Date().toISOString()
      const next: MediaAsset = {
        ...store.mediaAssets[index],
        status: "archived",
        updatedAt: now,
      }
      store.mediaAssets[index] = next
      return next
    },
  }

  const settingsRepo: SettingsRepository = {
    async getByTenant(input) {
      if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
        throw new Error("settings.getByTenant: tenantId is required")
      }
      const existing = store.tenantSettingsByTenantId.get(input.tenantId)
      if (existing) {
        return cloneTenantSettings(existing)
      }
      const created = createDefaultTenantSettings(input.tenantId)
      store.tenantSettingsByTenantId.set(input.tenantId, created)
      return cloneTenantSettings(created)
    },

    async update(input) {
      if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
        throw new Error("settings.update: tenantId is required")
      }
      const current =
        store.tenantSettingsByTenantId.get(input.tenantId) ??
        createDefaultTenantSettings(input.tenantId)
      const merged = mergeTenantSettingsPatch(current, input.settings)
      store.tenantSettingsByTenantId.set(input.tenantId, merged)
      return {
        settings: cloneTenantSettings(merged),
        persisted: false,
      }
    },
  }

  const privacyScanRepo: PrivacyScanRepository = {
    async listByTenant(input) {
      if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
        throw new Error("privacyScans.listByTenant: tenantId is required")
      }
      return store.privacyScanJobs
        .filter((scan) => scan.tenantId === input.tenantId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },

    async create(input: CreatePrivacyScanInput) {
      if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
        throw new Error("privacyScans.create: tenantId is required")
      }
      if (typeof input.targetUrl !== "string" || input.targetUrl.trim().length === 0) {
        throw new Error("privacyScans.create: targetUrl is required")
      }

      const now = new Date().toISOString()
      const scan: PrivacyScanJob = {
        id: nanoid(),
        tenantId: input.tenantId,
        locale: input.locale,
        targetUrl: input.targetUrl.trim(),
        status: "queued",
        approvalStatus: "draft",
        findings: [],
        createdAt: now,
        updatedAt: now,
      }

      store.privacyScanJobs.push(scan)
      return scan
    },

    async updateApproval(input: UpdatePrivacyScanApprovalInput) {
      if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
        throw new Error("privacyScans.updateApproval: tenantId is required")
      }
      if (typeof input.scanId !== "string" || input.scanId.trim().length === 0) {
        throw new Error("privacyScans.updateApproval: scanId is required")
      }

      const scan = store.privacyScanJobs.find(
        (s) => s.id === input.scanId && s.tenantId === input.tenantId
      )
      if (!scan) {
        throw new Error(
          `privacyScans.updateApproval: scan not found (tenantId=${input.tenantId}, scanId=${input.scanId})`
        )
      }

      scan.approvalStatus = input.approvalStatus
      scan.updatedAt = new Date().toISOString()
      return scan
    },
  }

  return {
    tenants: tenantRepo,
    pages: pageRepo,
    blocks: blockRepo,
    navigation: navigationRepo,
    media: mediaRepo,
    settings: settingsRepo,
    privacyScans: privacyScanRepo,
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