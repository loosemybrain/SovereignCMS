import type { CmsBlock, CmsPage, Locale, TenantId } from "./cms"
import type { ContentStatus } from "./content-status"
import type { SeoMetadata } from "./seo"

/**
 * Input für das Speichern eines Seiten-Entwurfs (lokale Änderungen).
 * Enthält alle Kontextinformationen für die Persistierung.
 * Kann optionale SEO-Metadaten beinhalten (Page-Level, nicht Block-Level).
 */
export type SavePageDraftInput = {
  tenantId: TenantId
  pageId: string
  locale: Locale
  blocks: CmsBlock[]
  pageSeo?: SeoMetadata
}

/**
 * Rückgabe beim erfolgreichen Speichern eines Entwurfs.
 * persisted: false bedeutet, dass Änderungen lokal/temporär sind (Mock/InMemory).
 * status: Content Status (normalerweise "draft" für Draft-Saves).
 */
export type SavePageDraftResult = {
  success: boolean
  savedAt: string
  persisted: boolean
  status: ContentStatus
  updatedBlocks?: CmsBlock[]
}

/**
 * Fehlerfall beim Speichern.
 */
export type SavePageDraftError = {
  success: false
  error: string
}
