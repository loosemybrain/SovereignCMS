import type { ContentStatus } from "@sovereign-cms/core"
import { getContentStatusLabel } from "@sovereign-cms/core"
import { AdminBadge } from "@/components/admin-ui"

type ContentStatusBadgeProps = {
  status: ContentStatus
}

export function ContentStatusBadge({ status }: ContentStatusBadgeProps) {
  const label = getContentStatusLabel(status)
  const variant: Record<ContentStatus, "warning" | "success" | "muted"> = {
    draft: "warning",
    published: "success",
    archived: "muted",
  }

  return (
    <AdminBadge variant={variant[status]}>
      {label}
    </AdminBadge>
  )
}
