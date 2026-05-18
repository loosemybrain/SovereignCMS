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
  CreateMediaAssetInput,
  CreateNavigationItemInput,
  CreatePageInput,
  CreatePrivacyScanInput,
  Locale,
  MediaAsset,
  NavigationItem,
  NavigationScope,
  PrivacyScanJob,
  TenantSettings,
  TenantUserMembership,
  TenantUserMembershipInput,
  TransitionPageStatusInput,
  UpdatePrivacyScanApprovalInput,
  UpdateTenantSettingsInput,
} from "@sovereign-cms/core"

/**
 * Content: pages + blocks (maps to `PageRepository` + `BlockRepository`).
 * Phase 70: every read requires explicit `tenantId` — no silent default tenant in adapters.
 */
export interface ContentPersistenceAdapter {
  listPages(params: { tenantId: string; locale?: string }): Promise<CmsPage[]>
  getPageById(params: { tenantId: string; pageId: string }): Promise<CmsPage | null>
  getPageBySlug(params: {
    tenantId: string
    locale: string
    slug: string
  }): Promise<CmsPage | null>
  createPage(input: CreatePageInput): Promise<CmsPage>
  transitionPageStatus(input: TransitionPageStatusInput): Promise<CmsPage>
  listBlocks(params: { tenantId: string; pageId: string }): Promise<CmsBlock[]>
  saveBlocks(params: {
    tenantId: string
    pageId: string
    locale: Locale
    blocks: CmsBlock[]
  }): Promise<CmsBlock[]>
}

/** Settings (maps to `SettingsRepository`). Brand-specific settings are not a separate store yet. */
export interface SettingsPersistenceAdapter {
  getTenantSettings(tenantId: string): Promise<TenantSettings>
  updateTenantSettings(input: UpdateTenantSettingsInput): Promise<TenantSettings>
}

/** Navigation including footer scope (maps to `NavigationRepository`). */
export interface NavigationPersistenceAdapter {
  listNavigationItems(params: {
    tenantId: string
    locale?: string
    scope?: NavigationScope
  }): Promise<NavigationItem[]>
  createNavigationItem(input: CreateNavigationItemInput): Promise<NavigationItem>
}

/** Media metadata (maps to `MediaRepository`). Upload bytes use `StorageAdapter`, not this interface. */
export interface MediaPersistenceAdapter {
  listMedia(params: { tenantId: string }): Promise<MediaAsset[]>
  createMedia(input: CreateMediaAssetInput): Promise<MediaAsset>
}

/** Privacy scanner jobs (maps to `PrivacyScanRepository`). */
export interface PrivacyScannerPersistenceAdapter {
  listScans(params: { tenantId: string }): Promise<PrivacyScanJob[]>
  createScan(input: CreatePrivacyScanInput): Promise<PrivacyScanJob>
  updateScanApproval(input: UpdatePrivacyScanApprovalInput): Promise<PrivacyScanJob>
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
