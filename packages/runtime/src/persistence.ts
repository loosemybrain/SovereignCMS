import {
  createContentAdapterFromDatabase,
  createSupabaseContentAdapter,
  type ContentPersistenceAdapter,
  type DatabaseAdapter,
  PersistenceAdapterError,
} from "@sovereign-cms/db"
import { createSupabaseContentClientPort } from "@sovereign-cms/adapter-supabase"
import type { DatabaseAdapterKind, RuntimeConfig } from "./config"

function createLazySupabaseContentAdapter(): ContentPersistenceAdapter {
  let adapterPromise: Promise<ContentPersistenceAdapter> | null = null

  const loadAdapter = () => {
    if (!adapterPromise) {
      adapterPromise = createSupabaseContentClientPort().then((port) =>
        createSupabaseContentAdapter(port),
      )
    }
    return adapterPromise
  }

  return {
    listPages: async (params) => (await loadAdapter()).listPages(params),
    getPageById: async (params) => (await loadAdapter()).getPageById(params),
    getPageBySlug: async (params) => (await loadAdapter()).getPageBySlug(params),
    createPage: async (input) => (await loadAdapter()).createPage(input),
    transitionPageStatus: async (input) => (await loadAdapter()).transitionPageStatus(input),
    listBlocks: async (params) => (await loadAdapter()).listBlocks(params),
    saveBlocks: async (params) => (await loadAdapter()).saveBlocks(params),
  }
}

/**
 * Server-side composition root for content persistence.
 * Explicit allowlist — no dynamic discovery.
 */
export function resolveContentPersistenceAdapter(
  config: Pick<RuntimeConfig, "databaseAdapter">,
  db: DatabaseAdapter,
): ContentPersistenceAdapter {
  const kind: DatabaseAdapterKind = config.databaseAdapter

  switch (kind) {
    case "memory":
      return createContentAdapterFromDatabase(db)
    case "supabase":
      return createLazySupabaseContentAdapter()
    case "postgres":
      throw new PersistenceAdapterError(
        "unsupported_adapter",
        "DATABASE_ADAPTER=postgres is not implemented yet. Use memory or supabase for content reads.",
      )
    default: {
      const exhaustive: never = kind
      throw new PersistenceAdapterError(
        "unsupported_adapter",
        `Unsupported DATABASE_ADAPTER: ${String(exhaustive)}`,
      )
    }
  }
}

/**
 * @deprecated Prefer `runtime.content` from `createRuntime()`.
 */
export function getContentPersistenceAdapter(
  config: Pick<RuntimeConfig, "databaseAdapter">,
  db: DatabaseAdapter,
): ContentPersistenceAdapter {
  return resolveContentPersistenceAdapter(config, db)
}
