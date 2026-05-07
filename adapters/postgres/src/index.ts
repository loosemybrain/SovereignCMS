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
  }
  const blocks = {
    async listByPage() {
      return []
    },
    async replacePageBlocks() {
      return []
    },
  }
  return { tenants, pages, blocks }
}
