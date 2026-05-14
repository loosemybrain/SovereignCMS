import type { ReactNode } from "react"
import { AdminBadge } from "./admin-badge"

type StatusVariant = "default" | "success" | "warning" | "danger" | "muted"

/**
 * Semantic status chip; forwards to AdminBadge (design-kit naming).
 */
export function AdminStatusBadge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode
  variant?: StatusVariant
  className?: string
}) {
  return (
    <AdminBadge variant={variant} className={className}>
      {children}
    </AdminBadge>
  )
}
