import type { StorageAdapter } from "@sovereign-cms/storage"

/** S3-compatible (AWS S3, MinIO). */
export function createS3StorageAdapterPlaceholder(): StorageAdapter {
  return {
    async upload() {
      throw new Error("SovereignCMS: S3 adapter not implemented yet (phase 2.2 skeleton).")
    },
    async getPublicUrl() {
      throw new Error("SovereignCMS: S3 adapter not implemented yet (phase 2.2 skeleton).")
    },
    async delete() {
      throw new Error("SovereignCMS: S3 adapter not implemented yet (phase 2.2 skeleton).")
    },
  }
}