import type { AuthProvider } from "@sovereign-cms/auth"
import type { DatabaseAdapter } from "@sovereign-cms/db"
import type { EditorPersistence } from "@sovereign-cms/core"
import type { StorageAdapter } from "@sovereign-cms/storage"
import {
  createDatabaseTenantResolver,
  type TenantResolver,
} from "@sovereign-cms/tenancy"
import {
  selectAuthProvider,
  selectDatabaseAdapter,
  selectStorageAdapter,
} from "./adapter-selection"
import { createEditorPersistence } from "./editor-persistence"
import { createPageStatusPersistence } from "./page-status-persistence"
import { createPageCreationPersistence } from "./page-creation-persistence"
import { createNavigationPersistence } from "./navigation-persistence"
import { createMediaPersistence } from "./media-persistence"
import { createMediaResolver, type MediaResolver } from "./media/media-resolver"
import { createPublicPageResolution } from "./public-page-resolution"
import { createPublicNavigationResolution } from "./public-navigation-resolution"
import { createSettingsPersistence } from "./settings-persistence"
import { createPrivacyScannerPersistence } from "./privacy-scanner-persistence"
import { loadRuntimeConfig, type RuntimeConfig } from "./config"
import { resolveContentPersistenceAdapter } from "./persistence"
import {
  resolveMediaPersistenceAdapter,
  resolveNavigationPersistenceAdapter,
  resolvePrivacyScannerPersistenceAdapter,
  resolveSettingsPersistenceAdapter,
} from "./operational-persistence"
import type { ContentPersistenceAdapter } from "@sovereign-cms/db"

export type SovereignRuntime = {
  config: RuntimeConfig
  content: ContentPersistenceAdapter
  db: DatabaseAdapter
  storage: StorageAdapter
  auth: AuthProvider
  tenantResolver: TenantResolver
  editorPersistence: EditorPersistence
  pageStatusPersistence: ReturnType<typeof createPageStatusPersistence>
  pageCreationPersistence: ReturnType<typeof createPageCreationPersistence>
  navigationPersistence: ReturnType<typeof createNavigationPersistence>
  mediaPersistence: ReturnType<typeof createMediaPersistence>
  mediaResolver: MediaResolver
  publicPageResolution: ReturnType<typeof createPublicPageResolution>
  publicNavigationResolution: ReturnType<typeof createPublicNavigationResolution>
  settingsPersistence: ReturnType<typeof createSettingsPersistence>
  privacyScannerPersistence: ReturnType<typeof createPrivacyScannerPersistence>
}

export function createRuntime(config: Partial<RuntimeConfig> = {}): SovereignRuntime {
  const baseConfig = loadRuntimeConfig()
  const mergedConfig: RuntimeConfig = { ...baseConfig, ...config }

  const db = selectDatabaseAdapter(mergedConfig)
  const content = resolveContentPersistenceAdapter(mergedConfig, db)
  const storage = selectStorageAdapter(mergedConfig)
  const auth = selectAuthProvider(mergedConfig)
  const tenantResolver = createDatabaseTenantResolver(db)
  const editorPersistence = createEditorPersistence({ content })
  const pageStatusPersistence = createPageStatusPersistence({ content })
  const pageCreationPersistence = createPageCreationPersistence({ content })
  const navigation = resolveNavigationPersistenceAdapter(db)
  const settings = resolveSettingsPersistenceAdapter(db)
  const media = resolveMediaPersistenceAdapter(db)
  const privacyScanner = resolvePrivacyScannerPersistenceAdapter(db)
  const navigationPersistence = createNavigationPersistence({ navigation })
  const mediaPersistence = createMediaPersistence({ media })
  const mediaResolver = createMediaResolver({ media })
  const publicPageResolution = createPublicPageResolution({ content })
  const publicNavigationResolution = createPublicNavigationResolution({
    navigation,
    content,
  })
  const settingsPersistence = createSettingsPersistence({ settings })
  const privacyScannerPersistence = createPrivacyScannerPersistence({ privacyScanner })

  return {
    config: mergedConfig,
    content,
    db,
    storage,
    auth,
    tenantResolver,
    editorPersistence,
    pageStatusPersistence,
    pageCreationPersistence,
    navigationPersistence,
    mediaPersistence,
    mediaResolver,
    publicPageResolution,
    publicNavigationResolution,
    settingsPersistence,
    privacyScannerPersistence,
  }
}

