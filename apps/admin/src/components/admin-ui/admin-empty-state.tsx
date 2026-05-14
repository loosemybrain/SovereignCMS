import type { ReactNode } from "react"
import { Inbox } from "lucide-react"
import { cn } from "@sovereign-cms/ui"

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
  const showIcon = icon ?? (
    <Inbox className="h-7 w-7 text-[color-mix(in_oklab,var(--admin-accent)_55%,var(--admin-text-muted))]" strokeWidth={1.75} aria-hidden />
  )

  return (
    <div
      role="status"
      className={cn("admin-surface-empty py-12 text-center", className)}
    >
      <div className="mb-5 flex justify-center">
        <div
          className="admin-palette-type-icon mx-auto h-14 w-14 rounded-2xl [&>svg]:h-7 [&>svg]:w-7"
          aria-hidden
        >
          {showIcon}
        </div>
      </div>
      <p className="text-base font-semibold tracking-tight admin-text">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed admin-text-muted">{description}</p>
      )}
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  )
}
