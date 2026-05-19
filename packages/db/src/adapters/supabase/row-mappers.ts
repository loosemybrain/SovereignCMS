import type { CmsBlock, CmsPage } from "@sovereign-cms/core"
import { createDefaultSeoMetadata, isContentStatus } from "@sovereign-cms/core"
import type { SupabaseBlockRow, SupabasePageRow } from "./client-port"
import { PersistenceAdapterError } from "../errors"

function mapSeo(value: unknown): CmsPage["seo"] {
  if (!value || typeof value !== "object") {
    return createDefaultSeoMetadata()
  }
  const record = value as Record<string, unknown>
  return {
    seoTitle: typeof record.seoTitle === "string" ? record.seoTitle : "",
    seoDescription: typeof record.seoDescription === "string" ? record.seoDescription : "",
    seoImageAssetId:
      typeof record.seoImageAssetId === "string" || record.seoImageAssetId === null
        ? record.seoImageAssetId
        : null,
    seoImageUrl: typeof record.seoImageUrl === "string" ? record.seoImageUrl : "",
    canonicalUrl: typeof record.canonicalUrl === "string" ? record.canonicalUrl : "",
    robotsIndex: typeof record.robotsIndex === "boolean" ? record.robotsIndex : true,
  }
}

export function mapSupabasePageRow(row: SupabasePageRow): CmsPage {
  if (!isContentStatus(row.status)) {
    throw new PersistenceAdapterError(
      "invalid_row",
      `Invalid page status for page ${row.id}: ${row.status}`,
    )
  }

  return {
    id: row.id,
    tenantId: row.tenant_id,
    locale: row.locale,
    slug: row.slug,
    title: row.title,
    status: row.status,
    seo: mapSeo(row.seo),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function isBlockVisibility(value: string): value is CmsBlock["visibility"] {
  return value === "visible" || value === "hidden" || value === "scheduled"
}

export function mapSupabaseBlockRow(row: SupabaseBlockRow): CmsBlock {
  if (!isBlockVisibility(row.visibility)) {
    throw new PersistenceAdapterError(
      "invalid_row",
      `Invalid block visibility for block ${row.id}: ${row.visibility}`,
    )
  }

  const props =
    row.props && typeof row.props === "object" && !Array.isArray(row.props)
      ? (row.props as Record<string, unknown>)
      : {}

  return {
    id: row.id,
    tenantId: row.tenant_id,
    pageId: row.page_id,
    type: row.type,
    sortOrder: row.sort_order,
    props,
    visibility: row.visibility,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
