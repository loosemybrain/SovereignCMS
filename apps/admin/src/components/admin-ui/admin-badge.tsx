import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type AdminBadgeVariant = "default" | "success" | "warning" | "danger" | "muted"

type AdminBadgeProps = {
  children: ReactNode
  variant?: AdminBadgeVariant
  className?: string
}

const badgeVariantClasses: Record<AdminBadgeVariant, string> = {
  default: "admin-badge-default",
  success: "admin-badge-success",
  warning: "admin-badge-warning",
  danger: "admin-badge-danger",
  muted: "admin-badge-muted",
}

export function AdminBadge({ children, variant = "default", className }: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border",
        badgeVariantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
