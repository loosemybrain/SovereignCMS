import type { DatabaseAdapter } from "@sovereign-cms/db"
import type { StorageAdapter } from "@sovereign-cms/storage"

/**
 * Platzhalter: echte Implementierung bindet `@supabase/supabase-js` und
 * mappt Tabellen auf {@link DatabaseAdapter} / {@link StorageAdapter}.
 */
export function createSupabaseDatabaseAdapterPlaceholder(): DatabaseAdapter {
  const tenants = {
    async findByDomain() {
      return null
    },
    async findById() {
      return null
    },
  }
  const pages = {
    async findBySlug() {
      return null
    },
    async listByTenant() {
      return []
    },
  }
  const blocks = {
    async listByPage() {
      return []
    },
  }
  return { tenants, pages, blocks }
}

export function createSupabaseStorageAdapterPlaceholder(): StorageAdapter {
  return {
    async upload() {
      throw new Error(
        "SovereignCMS: Supabase-Storage-Adapter noch nicht implementiert (Phase 2.2 Skelett).",
      )
    },
    async getPublicUrl() {
      throw new Error(
        "SovereignCMS: Supabase-Storage-Adapter noch nicht implementiert (Phase 2.2 Skelett).",
      )
    },
    async delete() {
      throw new Error(
        "SovereignCMS: Supabase-Storage-Adapter noch nicht implementiert (Phase 2.2 Skelett).",
      )
    },
  }
}