import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminTopbarProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

/**
 * Sticky top bar for main admin column (title + actions). Presentational only.
 */
export function AdminTopbar({ title, subtitle, actions, className }: AdminTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 shrink-0 border-b admin-border admin-surface px-6 py-3 sm:px-8 sm:py-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold tracking-tight admin-text sm:text-lg">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 truncate text-xs admin-text-muted sm:text-sm">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
