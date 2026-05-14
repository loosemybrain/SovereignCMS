import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"
import { AdminCard } from "@/components/admin-ui/admin-card"

type AdminEmptyStateProps = {
  title: string
  description?: string
  children?: ReactNode
  icon?: ReactNode
  className?: string
}

export function AdminEmptyState({
  title,
  description,
  children,
  icon,
  className,
}: AdminEmptyStateProps) {
  return (
    <AdminCard className={cn("text-center py-12 animate-scale-in", className)}>
      {icon && (
        <div className="mb-4 flex justify-center">
          <div className="text-4xl opacity-40">{icon}</div>
        </div>
      )}
      <p className="admin-text font-medium text-base">{title}</p>
      {description && (
        <p className="admin-text-muted text-sm mt-2 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {children ? (
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          {children}
        </div>
      ) : null}
    </AdminCard>
  )
}
