import type { DatabaseAdapter } from "@sovereign-cms/db"
import type { StorageAdapter } from "@sovereign-cms/storage"

export { createSupabaseContentClientPort } from "./content-client"
export { createSupabaseSettingsClientPort } from "./settings-client"

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
    async transitionStatus() {
      throw new Error("Not implemented in placeholder")
    },
    async create() {
      throw new Error("Not implemented in placeholder")
    },
  }
  const blocks = {
    async listByPage() {
      return []
    },
    async replacePageBlocks() {
      return []
    },
  }
  const navigation = {
    async listByTenant() {
      return []
    },
    async create() {
      throw new Error("Not implemented in placeholder")
    },
  }
  const media = {
    async listByTenant() {
      return []
    },
    async create() {
      throw new Error("Not implemented in placeholder")
    },
    async updateMetadata() {
      throw new Error("Not implemented in placeholder")
    },
    async archive() {
      throw new Error("Not implemented in placeholder")
    },
  }
  const settings = {
    async getByTenant() {
      throw new Error("Not implemented in placeholder")
    },
    async update() {
      throw new Error("Not implemented in placeholder")
    },
  }
  const privacyScans = {
    async listByTenant() {
      return []
    },
    async create() {
      throw new Error("Not implemented in placeholder")
    },
    async updateApproval() {
      throw new Error("Not implemented in placeholder")
    },
  }
  return { tenants, pages, blocks, navigation, media, settings, privacyScans }
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