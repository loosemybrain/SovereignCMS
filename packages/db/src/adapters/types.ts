/**
 * Persistence adapter contracts (Phase 65+).
 *
 * `ContentPersistenceAdapter` is wired at runtime via `packages/runtime/src/persistence.ts`.
 * Other facades remain documentation targets until their domains are extracted.
 *
 * Rules: small interfaces, no generic CRUD engines, no dynamic schemas.
 */

import type {
  CmsBlock,
  CmsPage,
  CreateNavigationItemInput,
  CreatePageInput,
  CreatePrivacyScanInput,
  Locale,
  MediaAssetInput,
  MediaAssetRecord,
  NavigationItem,
  NavigationScope,
  PrivacyScanFinding,
  PrivacyScanJob,
  TenantSettings,
  TenantSettingsPersistenceResult,
  TenantSettingsSaveResult,
  TenantUserMembership,
  TenantUserMembershipInput,
  TransitionPageStatusInput,
  UpdatePrivacyScanApprovalInput,
  UpdateTenantSettingsInput,
} from "@sovereign-cms/core"

/**
 * Content: pages + blocks (maps to `PageRepository` + `BlockRepository`).
 * Phase 70: every read requires explicit `tenantId` — no silent default tenant in adapters.
 * Phase 71: writes require scoped `tenantId` + page ownership checks before mutation.
 */
export interface ContentPersistenceAdapter {
  listPages(params: { tenantId: string; locale?: string }): Promise<CmsPage[]>
  getPageById(params: { tenantId: string; pageId: string }): Promise<CmsPage | null>
  getPageBySlug(params: {
    tenantId: string
    locale: string
    slug: string
  }): Promise<CmsPage | null>
  createPage(params: { tenantId: string; input: CreatePageInput }): Promise<CmsPage>
  transitionPageStatus(params: {
    tenantId: string
    input: TransitionPageStatusInput
  }): Promise<CmsPage>
  listBlocks(params: { tenantId: string; pageId: string }): Promise<CmsBlock[]>
  saveBlocks(params: {
    tenantId: string
    pageId: string
    locale: Locale
    blocks: CmsBlock[]
  }): Promise<CmsBlock[]>
}

/**
 * Settings (maps to `SettingsRepository`). Brand-specific settings are not a separate store yet.
 * Phase 72: writes require scoped `tenantId`.
 * Phase 74: reads require explicit `tenantId` params.
 */
export interface SettingsPersistenceAdapter {
  getTenantSettings(params: { tenantId: string }): Promise<TenantSettings>
  /** Brand settings share tenant store until a dedicated brand table exists (Phase 74). */
  getBrandSettings(params: { tenantId: string; brand: string }): Promise<TenantSettings>
  updateTenantSettings(params: {
    tenantId: string
    input: UpdateTenantSettingsInput
  }): Promise<TenantSettingsPersistenceResult>
}

/**
 * Navigation (maps to `NavigationRepository`).
 * Phase 74: all reads require explicit `tenantId`.
 */
export interface NavigationPersistenceAdapter {
  listNavigationItems(params: {
    tenantId: string
    locale?: string
    scope?: NavigationScope
  }): Promise<NavigationItem[]>
  createNavigationItem(params: {
    tenantId: string
    input: CreateNavigationItemInput
  }): Promise<NavigationItem>
}

/**
 * Footer navigation (same store as main nav, `scope: "footer"`).
 * Implemented by the navigation memory adapter in Phase 74.
 */
export interface FooterPersistenceAdapter {
  listFooterNavigationItems(params: {
    tenantId: string
    locale?: string
  }): Promise<NavigationItem[]>
}

/**
 * Media metadata only (maps to `MediaRepository`).
 * Binary upload/delete and signed URLs belong on a future `StorageProviderAdapter` (Phase 75+).
 */
export interface MediaPersistenceAdapter {
  listMedia(params: { tenantId: string; folderId?: string }): Promise<MediaAssetRecord[]>
  getMediaById(params: { tenantId: string; mediaId: string }): Promise<MediaAssetRecord | null>
  createMediaMetadata(params: {
    tenantId: string
    input: MediaAssetInput
  }): Promise<MediaAssetRecord>
  updateMediaMetadata(params: {
    tenantId: string
    mediaId: string
    input: Partial<MediaAssetInput>
  }): Promise<MediaAssetRecord>
  archiveMedia(params: { tenantId: string; mediaId: string }): Promise<MediaAssetRecord>
}

/** Privacy scanner jobs (maps to `PrivacyScanRepository`). */
export interface PrivacyScannerPersistenceAdapter {
  listScans(params: { tenantId: string }): Promise<PrivacyScanJob[]>
  listFindings(params: {
    tenantId: string
    scanId?: string
  }): Promise<PrivacyScanFinding[]>
  createScan(params: { tenantId: string; input: CreatePrivacyScanInput }): Promise<PrivacyScanJob>
  updateScanApproval(params: {
    tenantId: string
    input: UpdatePrivacyScanApprovalInput
  }): Promise<PrivacyScanJob>
}

/** Tenant resolution (maps to `TenantRepository`). */
export interface TenantPersistenceAdapter {
  findByDomain(host: string): Promise<unknown | null>
  findById(tenantId: string): Promise<unknown | null>
}

/**
 * Tenant user membership persistence (Phase 69 contract — not wired at runtime yet).
 * Maps authenticated users to tenant-scoped roles and optional permission overrides.
 */
export interface TenantAccessPersistenceAdapter {
  listMembershipsForTenant(tenantId: string): Promise<TenantUserMembership[]>
  listMembershipsForUser(userId: string): Promise<TenantUserMembership[]>
  getMembership(tenantId: string, userId: string): Promise<TenantUserMembership | null>
  upsertMembership(input: TenantUserMembershipInput): Promise<TenantUserMembership>
  disableMembership(tenantId: string, userId: string): Promise<TenantUserMembership>
}

/**
 * Optional aggregate for documentation only.
 * Production wiring should prefer `DatabaseAdapter` until facades are explicitly adopted.
 */
export interface SovereignPersistenceAdapters {
  tenants: TenantPersistenceAdapter
  tenantAccess: TenantAccessPersistenceAdapter
  content: ContentPersistenceAdapter
  settings: SettingsPersistenceAdapter
  navigation: NavigationPersistenceAdapter
  media: MediaPersistenceAdapter
  privacyScanner: PrivacyScannerPersistenceAdapter
}
