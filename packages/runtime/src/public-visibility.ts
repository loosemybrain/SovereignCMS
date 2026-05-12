import type { ContentStatus, PreviewContext } from "@sovereign-cms/core"

export function isPubliclyVisible(status: ContentStatus, preview: PreviewContext): boolean {
  if (status === "archived") {
    return false
  }

  if (status === "published") {
    return true
  }

  if (status === "draft") {
    return preview.mode === "enabled"
  }

  return false
}
