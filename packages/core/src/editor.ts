import type { CmsBlock, CmsPage, Locale, TenantId } from "./cms"

/**
 * Input für das Speichern eines Seiten-Entwurfs (lokale Änderungen).
 * Enthält alle Kontextinformationen für die Persistierung.
 */
export type SavePageDraftInput = {
  tenantId: TenantId
  pageId: string
  locale: Locale
  blocks: CmsBlock[]
}

/**
 * Rückgabe beim erfolgreichen Speichern eines Entwurfs.
 * persisted: false bedeutet, dass Änderungen lokal/temporär sind (Mock/InMemory).
 */
export type SavePageDraftResult = {
  success: boolean
  savedAt: string
  persisted: boolean
  updatedBlocks?: CmsBlock[]
}

/**
 * Fehlerfall beim Speichern.
 */
export type SavePageDraftError = {
  success: false
  error: string
}
