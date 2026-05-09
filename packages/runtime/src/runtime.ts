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
import { createPublicPageResolution } from "./public-page-resolution"
import { createPublicNavigationResolution } from "./public-navigation-resolution"
import { loadRuntimeConfig, type RuntimeConfig } from "./config"

export type SovereignRuntime = {
  config: RuntimeConfig
  db: DatabaseAdapter
  storage: StorageAdapter
  auth: AuthProvider
  tenantResolver: TenantResolver
  editorPersistence: EditorPersistence
  pageStatusPersistence: ReturnType<typeof createPageStatusPersistence>
  pageCreationPersistence: ReturnType<typeof createPageCreationPersistence>
  navigationPersistence: ReturnType<typeof createNavigationPersistence>
  mediaPersistence: ReturnType<typeof createMediaPersistence>
  publicPageResolution: ReturnType<typeof createPublicPageResolution>
  publicNavigationResolution: ReturnType<typeof createPublicNavigationResolution>
}

export function createRuntime(config: Partial<RuntimeConfig> = {}): SovereignRuntime {
  const baseConfig = loadRuntimeConfig()
  const mergedConfig: RuntimeConfig = { ...baseConfig, ...config }

  const db = selectDatabaseAdapter(mergedConfig)
  const storage = selectStorageAdapter(mergedConfig)
  const auth = selectAuthProvider(mergedConfig)
  const tenantResolver = createDatabaseTenantResolver(db)
  const editorPersistence = createEditorPersistence({ db })
  const pageStatusPersistence = createPageStatusPersistence({ db })
  const pageCreationPersistence = createPageCreationPersistence({ db })
  const navigationPersistence = createNavigationPersistence({ db })
  const mediaPersistence = createMediaPersistence({ db })
  const publicPageResolution = createPublicPageResolution({ db })
  const publicNavigationResolution = createPublicNavigationResolution({ db })

  return {
    config: mergedConfig,
    db,
    storage,
    auth,
    tenantResolver,
    editorPersistence,
    pageStatusPersistence,
    pageCreationPersistence,
    navigationPersistence,
    mediaPersistence,
    publicPageResolution,
    publicNavigationResolution,
  }
}

