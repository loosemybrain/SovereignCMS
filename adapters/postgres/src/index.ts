import type { DatabaseAdapter } from "@sovereign-cms/db"

/** Portable Postgres-Variante (Gov/Self-Hosted): SQL + Pool — hier nur Kontrakt-Skelett. */
export function createPostgresDatabaseAdapterPlaceholder(): DatabaseAdapter {
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
