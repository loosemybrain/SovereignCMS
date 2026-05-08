import type { ReactNode } from "react"
import { AdminCard } from "@/components/admin-ui/admin-card"

type AdminEmptyStateProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function AdminEmptyState({ title, description, children }: AdminEmptyStateProps) {
  return (
    <AdminCard className="text-center">
      <p className="admin-text font-medium">{title}</p>
      {description && <p className="admin-text-muted text-sm mt-2">{description}</p>}
      {children ? <div className="mt-4">{children}</div> : null}
    </AdminCard>
  )
}
