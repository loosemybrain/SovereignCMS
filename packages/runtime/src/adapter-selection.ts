import type { AuthProvider } from "@sovereign-cms/auth"
import { createInMemoryAdapter, type DatabaseAdapter } from "@sovereign-cms/db"
import type { StorageAdapter } from "@sovereign-cms/storage"
import type { RuntimeConfig } from "./config"

function createMemoryStorageAdapter(): StorageAdapter {
  return {
    async upload(input) {
      return {
        key: `${input.tenantId}/${input.key}`,
        contentType: input.contentType,
      }
    },
    async getPublicUrl(input) {
      return `memory://${input.tenantId}/${input.key}`
    },
    async delete() {
      // no-op in memory mode
    },
  }
}

function createNoAuthProvider(): AuthProvider {
  return {
    async getSession() {
      return null
    },
    async signOut() {
      // no-op
    },
  }
}

export function selectDatabaseAdapter(config: RuntimeConfig): DatabaseAdapter {
  switch (config.databaseAdapter) {
    case "memory":
      return createInMemoryAdapter()
    case "supabase":
      throw new Error("Adapter not implemented yet: supabase database")
    case "postgres":
      throw new Error("Adapter not implemented yet: postgres database")
  }
}

export function selectStorageAdapter(config: RuntimeConfig): StorageAdapter {
  switch (config.storageAdapter) {
    case "memory":
      return createMemoryStorageAdapter()
    case "supabase":
      throw new Error("Adapter not implemented yet: supabase storage")
    case "s3":
      throw new Error("Adapter not implemented yet: s3 storage")
  }
}

export function selectAuthProvider(config: RuntimeConfig): AuthProvider {
  switch (config.authAdapter) {
    case "none":
      return createNoAuthProvider()
    case "supabase":
      throw new Error("Adapter not implemented yet: supabase auth")
    case "keycloak":
      throw new Error("Adapter not implemented yet: keycloak auth")
  }
}

