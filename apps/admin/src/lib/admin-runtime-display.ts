/**
 * Serializable adapter labels for admin chrome (safe across the server → client boundary).
 * Never pass full `RuntimeConfig` into Client Components — derive this shape on the server only.
 */
export type AdminRuntimeAdapterLabels = {
  databaseAdapter: string
  storageAdapter: string
  authAdapter: string
}

export function pickAdminRuntimeAdapterLabels(config: {
  databaseAdapter: string
  storageAdapter: string
  authAdapter: string
}): AdminRuntimeAdapterLabels {
  return {
    databaseAdapter: String(config.databaseAdapter),
    storageAdapter: String(config.storageAdapter),
    authAdapter: String(config.authAdapter),
  }
}
