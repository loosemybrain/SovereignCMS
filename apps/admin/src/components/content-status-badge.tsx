"use client"

import type { ContentStatus } from "@sovereign-cms/core"
import { isContentStatus } from "@sovereign-cms/core"
import { AdminBadge } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"

type ContentStatusBadgeProps = {
  status: ContentStatus
}

export function ContentStatusBadge({ status }: ContentStatusBadgeProps) {
  const { messages } = useAdminI18n()
  const label = isContentStatus(status) ? messages.contentStatus[status] : status
  const variant: Record<ContentStatus, "warning" | "success" | "muted"> = {
    draft: "warning",
    published: "success",
    archived: "muted",
  }

  return <AdminBadge variant={variant[status]}>{label}</AdminBadge>
}
