/**
 * Validates and normalizes CMS-authored URLs.
 *
 * Safe href URLs:
 * - Internal paths starting with "/"
 * - Hash anchors starting with "#"
 * - https:// URLs
 * - http:// URLs (if project allows them)
 *
 * Unsafe (blocked):
 * - javascript:, data:, vbscript:
 * - empty or whitespace-only
 */
export function isValidHref(href: unknown): boolean {
  if (typeof href !== "string") return false

  const trimmed = href.trim()
  if (!trimmed) return false

  // Block dangerous protocols
  const lowerHref = trimmed.toLowerCase()
  if (
    lowerHref.startsWith("javascript:") ||
    lowerHref.startsWith("data:") ||
    lowerHref.startsWith("vbscript:")
  ) {
    return false
  }

  // Allow internal paths, hash anchors, https, http
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  ) {
    return true
  }

  return false
}

/**
 * Validates and normalizes CMS-authored image URLs.
 *
 * Safe image URLs:
 * - Internal paths starting with "/"
 * - https:// URLs
 *
 * Unsafe (blocked):
 * - javascript:, data:, vbscript:
 * - http:// external URLs (security: admin preview should not load external http)
 * - empty or whitespace-only
 */
export function isValidImageUrl(imageUrl: unknown): boolean {
  if (typeof imageUrl !== "string") return false

  const trimmed = imageUrl.trim()
  if (!trimmed) return false

  // Block dangerous protocols
  const lowerUrl = trimmed.toLowerCase()
  if (
    lowerUrl.startsWith("javascript:") ||
    lowerUrl.startsWith("data:") ||
    lowerUrl.startsWith("vbscript:")
  ) {
    return false
  }

  // Allow internal paths and https only
  if (trimmed.startsWith("/") || trimmed.startsWith("https://")) {
    return true
  }

  // Block external http
  return false
}

/**
 * Checks if an image URL is external (https://).
 * Used to determine if admin preview should load it (no) or show placeholder (yes).
 */
export function isExternalHttpsImageUrl(imageUrl: unknown): boolean {
  if (typeof imageUrl !== "string") return false
  return imageUrl.trim().startsWith("https://")
}
