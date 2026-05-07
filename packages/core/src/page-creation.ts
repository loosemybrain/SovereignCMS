import type { CmsPage } from "./cms"

export type CreatePageInput = {
  tenantId: string
  locale: string
  slug: string
  title: string
}

export type CreatePageResult = {
  success: boolean
  page: CmsPage
  createdAt: string
  persisted: boolean
}

/**
 * Normalize page slug: trim, remove leading/trailing slashes, lowercase, replace spaces
 */
export function normalizePageSlug(slug: string): string {
  return slug
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
}

/**
 * Validate page slug format
 * - Must not be empty
 * - Must not contain ".."
 * - Must not start with "/"
 * - Must not end with "/"
 * - Must contain only lowercase letters, numbers, hyphens, and forward slashes
 */
export function validatePageSlug(slug: string): boolean {
  if (!slug) {
    return false
  }

  if (slug.includes("..")) {
    return false
  }

  if (slug.startsWith("/")) {
    return false
  }

  if (slug.endsWith("/")) {
    return false
  }

  return /^[a-z0-9][a-z0-9\-\/]*$/.test(slug)
}

/**
 * Validate page title
 * - Must not be empty or only whitespace
 */
export function validatePageTitle(title: string): boolean {
  return title.trim().length > 0
}
