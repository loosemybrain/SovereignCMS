import {
  createMediaAdapterFromDatabase,
  createNavigationAdapterFromDatabase,
  createPrivacyScannerAdapterFromDatabase,
  createSettingsAdapterFromDatabase,
  type DatabaseAdapter,
  type MediaPersistenceAdapter,
  type NavigationPersistenceAdapter,
  type PrivacyScannerPersistenceAdapter,
  type SettingsPersistenceAdapter,
} from "@sovereign-cms/db"

/**
 * Resolves tenant-scoped operational persistence adapters (Phase 72).
 * Memory mode wraps DatabaseAdapter repositories; Supabase operational writes remain future work.
 */
export function resolveNavigationPersistenceAdapter(
  db: DatabaseAdapter,
): NavigationPersistenceAdapter {
  return createNavigationAdapterFromDatabase(db)
}

export function resolveSettingsPersistenceAdapter(
  db: DatabaseAdapter,
): SettingsPersistenceAdapter {
  return createSettingsAdapterFromDatabase(db)
}

export function resolveMediaPersistenceAdapter(db: DatabaseAdapter): MediaPersistenceAdapter {
  return createMediaAdapterFromDatabase(db)
}

export function resolvePrivacyScannerPersistenceAdapter(
  db: DatabaseAdapter,
): PrivacyScannerPersistenceAdapter {
  return createPrivacyScannerAdapterFromDatabase(db)
}
