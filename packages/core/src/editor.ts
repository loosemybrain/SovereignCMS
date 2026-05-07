import type { CmsBlock, CmsPage, TenantId } from "./cms"

/**
 * Input für das Speichern eines Seiten-Entwurfs (lokale Änderungen).
 * Enthält die aktuellen Block-Daten, wird später in die DB geschrieben.
 */
export type SavePageDraftInput = {
  tenantId: TenantId
  pageId: string
  blocks: CmsBlock[]
}

/**
 * Rückgabe beim erfolgreichen Speichern eines Entwurfs.
 */
export type SavePageDraftResult = {
  success: boolean
  savedAt: string
  updatedBlocks?: CmsBlock[]
}

/**
 * Fehlerfall beim Speichern.
 */
export type SavePageDraftError = {
  success: false
  error: string
}
