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
  }
}

