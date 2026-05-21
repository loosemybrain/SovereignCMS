export type {
  PageRecord,
  ReplacePageBlocksInput,
  DatabaseAdapter,
  TenantRepository,
  PageRepository,
  BlockRepository,
  NavigationRepository,
  MediaRepository,
  SettingsRepository,
  PrivacyScanRepository,
} from "./contracts"
export type {
  ContentPersistenceAdapter,
  SettingsPersistenceAdapter,
  NavigationPersistenceAdapter,
  FooterPersistenceAdapter,
  MediaPersistenceAdapter,
  PrivacyScannerPersistenceAdapter,
  TenantPersistenceAdapter,
  TenantAccessPersistenceAdapter,
  SovereignPersistenceAdapters,
} from "./adapters/types"
export type {
  SupabaseBlockRow,
  SupabaseContentClientPort,
  SupabasePageRow,
  SupabaseQueryError,
  SupabaseQueryResult,
} from "./adapters/supabase/client-port"
export type {
  SupabaseSettingsClientPort,
  SupabaseTenantSettingsRow,
  SupabaseSettingsQueryError,
  SupabaseSettingsQueryResult,
} from "./adapters/supabase/settings-client-port"
export { PersistenceAdapterError, normalizeAdapterError } from "./adapters/errors"
export { createContentAdapterFromDatabase } from "./adapters/memory-content-adapter"
export { createNavigationAdapterFromDatabase } from "./adapters/memory-navigation-adapter"
export { createSettingsAdapterFromDatabase } from "./adapters/memory-settings-adapter"
export { createMediaAdapterFromDatabase } from "./adapters/memory-media-adapter"
export { createPrivacyScannerAdapterFromDatabase } from "./adapters/memory-privacy-scanner-adapter"
export { createSupabaseContentAdapter } from "./adapters/supabase/content-adapter"
export { createSupabaseSettingsAdapter } from "./adapters/supabase/settings-adapter"
export { createInMemoryAdapter } from "./in-memory-adapter"
