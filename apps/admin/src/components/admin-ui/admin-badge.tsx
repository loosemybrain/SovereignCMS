import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type AdminBadgeVariant = "default" | "success" | "warning" | "danger" | "muted"

type AdminBadgeProps = {
  children: ReactNode
  variant?: AdminBadgeVariant
  className?: string
}

const badgeVariantClasses: Record<AdminBadgeVariant, string> = {
  default: "admin-accent-bg admin-text border admin-border",
  success: "bg-emerald-900/30 text-emerald-300 border-emerald-700/50",
  warning: "bg-amber-900/30 text-amber-300 border-amber-700/50",
  danger: "bg-red-900/30 text-red-300 border-red-700/50",
  muted: "admin-surface-muted admin-text-muted border admin-border",
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
