import type {
  CmsBlock,
  CmsPage,
  Locale,
  TransitionPageStatusInput,
  CreatePageInput,
  NavigationItem,
  CreateNavigationItemInput,
  NavigationScope,
  MediaAsset,
  CreateMediaAssetInput,
  TenantSettings,
  UpdateTenantSettingsInput,
  PrivacyScanJob,
  CreatePrivacyScanInput,
  UpdatePrivacyScanApprovalInput,
} from "@sovereign-cms/core"

export type PageRecord = CmsPage

export type ReplacePageBlocksInput = {
  tenantId: string
  pageId: string
  locale: Locale
  blocks: CmsBlock[]
}

export interface TenantRepository {
  findByDomain(host: string): Promise<unknown | null>
  findById(tenantId: string): Promise<unknown | null>
}

export interface PageRepository {
  findBySlug(input: {
    tenantId: string
    locale: string
    slug: string
  }): Promise<CmsPage | null>

  listByTenant(input: { tenantId: string; locale?: string }): Promise<CmsPage[]>

  transitionStatus(input: TransitionPageStatusInput): Promise<CmsPage>

  create(input: CreatePageInput): Promise<CmsPage>
}

export interface BlockRepository {
  listByPage(input: { tenantId: string; pageId: string }): Promise<CmsBlock[]>

  replacePageBlocks(input: ReplacePageBlocksInput): Promise<CmsBlock[]>
}

export interface NavigationRepository {
  listByTenant(input: {
    tenantId: string
    locale?: string
    scope?: NavigationScope
  }): Promise<NavigationItem[]>
  create(input: CreateNavigationItemInput): Promise<NavigationItem>
}

export interface MediaRepository {
  listByTenant(input: { tenantId: string }): Promise<MediaAsset[]>
  create(input: CreateMediaAssetInput): Promise<MediaAsset>
  updateMetadata(input: {
    tenantId: string
    mediaId: string
    patch: Partial<CreateMediaAssetInput> & {
      status?: MediaAsset["status"]
    }
  }): Promise<MediaAsset | null>
  archive(input: { tenantId: string; mediaId: string }): Promise<MediaAsset | null>
}

export interface SettingsRepository {
  getByTenant(input: { tenantId: string }): Promise<TenantSettings>
  update(input: UpdateTenantSettingsInput): Promise<TenantSettings>
}

export interface PrivacyScanRepository {
  listByTenant(input: { tenantId: string }): Promise<PrivacyScanJob[]>
  create(input: CreatePrivacyScanInput): Promise<PrivacyScanJob>
  updateApproval(input: UpdatePrivacyScanApprovalInput): Promise<PrivacyScanJob>
}

export interface DatabaseAdapter {
  tenants: TenantRepository
  pages: PageRepository
  blocks: BlockRepository
  navigation: NavigationRepository
  media: MediaRepository
  settings: SettingsRepository
  privacyScans: PrivacyScanRepository
}
