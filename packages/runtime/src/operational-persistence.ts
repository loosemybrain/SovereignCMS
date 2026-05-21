import {
  createMediaAdapterFromDatabase,
  createNavigationAdapterFromDatabase,
  createPrivacyScannerAdapterFromDatabase,
  type DatabaseAdapter,
  type MediaPersistenceAdapter,
  type NavigationPersistenceAdapter,
  type PrivacyScannerPersistenceAdapter,
  type SettingsPersistenceAdapter,
} from "@sovereign-cms/db"
import type { RuntimeConfig } from "./config"
import { resolveSettingsPersistenceAdapter as resolveSettingsPersistenceAdapterImpl } from "./settings-adapter-resolution"

/**
 * Resolves tenant-scoped operational persistence adapters (Phase 72+).
 * Settings: Phase 91 Supabase `tenant_settings` when DATABASE_ADAPTER=supabase.
 */
export function resolveNavigationPersistenceAdapter(
  db: DatabaseAdapter,
): NavigationPersistenceAdapter {
  return createNavigationAdapterFromDatabase(db)
}

export function resolveSettingsPersistenceAdapter(
  config: Pick<RuntimeConfig, "databaseAdapter">,
  db: DatabaseAdapter,
): SettingsPersistenceAdapter {
  return resolveSettingsPersistenceAdapterImpl(config, db)
}

export function resolveMediaPersistenceAdapter(db: DatabaseAdapter): MediaPersistenceAdapter {
  return createMediaAdapterFromDatabase(db)
}

export function resolvePrivacyScannerPersistenceAdapter(
  db: DatabaseAdapter,
): PrivacyScannerPersistenceAdapter {
  return createPrivacyScannerAdapterFromDatabase(db)
}
