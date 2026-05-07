/**
 * Content State Model
 *
 * Defines the lifecycle states for page content.
 * This is distinct from block-level visibility.
 *
 * States:
 * - draft: Page is being edited, not visible publicly
 * - published: Page is live and visible
 * - archived: Page is removed from public view but retained
 */

export type ContentStatus = "draft" | "published" | "archived"

export const CONTENT_STATUSES: ContentStatus[] = ["draft", "published", "archived"]

/**
 * Type guard for ContentStatus
 */
export function isContentStatus(value: unknown): value is ContentStatus {
  return (
    typeof value === "string" &&
    (value === "draft" || value === "published" || value === "archived")
  )
}

/**
 * Get human-readable label for status
 */
export function getContentStatusLabel(status: ContentStatus): string {
  const labels: Record<ContentStatus, string> = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
  }
  return labels[status]
}
