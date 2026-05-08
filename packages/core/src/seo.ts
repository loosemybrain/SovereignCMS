/**
 * SEO and metadata definitions for pages.
 * Structured metadata for search engines and social sharing.
 */

export type SeoMetadata = {
  seoTitle?: string
  seoDescription?: string
  seoImageAssetId?: string | null
  seoImageUrl?: string
  canonicalUrl?: string
  robotsIndex?: boolean
}

/**
 * Create default/empty SEO metadata.
 * Used when creating new pages or when no SEO data is set.
 */
export function createDefaultSeoMetadata(): SeoMetadata {
  return {
    seoTitle: "",
    seoDescription: "",
    seoImageAssetId: null,
    seoImageUrl: "",
    canonicalUrl: "",
    robotsIndex: true,
  }
}

/**
 * Validate canonical URL format.
 * Accepts empty (returns true), https://, http://, or / relative paths.
 */
export function validateCanonicalUrl(value: string): boolean {
  const url = value.trim()

  // Empty is valid (optional field)
  if (!url) {
    return true
  }

  return (
    url.startsWith("https://") ||
    url.startsWith("http://") ||
    url.startsWith("/")
  )
}

/**
 * Validate SEO title length.
 * Recommended: 30-60 characters for search results.
 */
export function validateSeoTitle(value: string): boolean {
  const trimmed = value.trim()
  return trimmed.length === 0 || trimmed.length <= 200
}

/**
 * Validate SEO description length.
 * Recommended: 100-160 characters for search results.
 */
export function validateSeoDescription(value: string): boolean {
  const trimmed = value.trim()
  return trimmed.length === 0 || trimmed.length <= 500
}
