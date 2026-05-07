import type { ContentStatus } from "@sovereign-cms/core"
import { getContentStatusLabel } from "@sovereign-cms/core"

type ContentStatusBadgeProps = {
  status: ContentStatus
}

export function ContentStatusBadge({ status }: ContentStatusBadgeProps) {
  const label = getContentStatusLabel(status)

  const statusStyles: Record<ContentStatus, string> = {
    draft: "bg-amber-900/30 text-amber-300 border-amber-700/50",
    published: "bg-emerald-900/30 text-emerald-300 border-emerald-700/50",
    archived: "bg-zinc-800/50 text-zinc-300 border-zinc-700/50",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${statusStyles[status]}`}
    >
      {label}
    </span>
  )
}
