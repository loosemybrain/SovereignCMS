import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminTopbarProps = {
  title: string
  subtitle?: string
  /** Eyebrow above title (e.g. "View" / "Ansicht"). */
  viewLabel?: string
  /** Real metadata only (e.g. tenant resolution source) — no fake system status. */
  badge?: ReactNode
  actions?: ReactNode
  className?: string
}

/**
 * Sticky top bar: translucent surface + blur (v0-style), title hierarchy, actions.
 */
export function AdminTopbar({ title, subtitle, viewLabel = "View", badge, actions, className }: AdminTopbarProps) {
  return (
    <header
      className={cn(
        "admin-topbar sticky top-0 flex min-h-14 shrink-0 items-center border-b px-5 py-2.5 sm:px-7",
        className,
      )}
    >
      <div className="flex w-full min-w-0 items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] admin-text-muted">{viewLabel}</p>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h2 className="truncate text-base font-semibold tracking-tight admin-text sm:text-[1.0625rem]">
              {title}
            </h2>
            {badge ? <div className="shrink-0 translate-y-px">{badge}</div> : null}
          </div>
          {subtitle ? (
            <p
              className="mt-1 max-w-xl truncate font-mono text-[10px] tracking-tight text-[color-mix(in_oklab,var(--admin-text-muted)_94%,var(--admin-text))] sm:text-[11px]"
              title={subtitle}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="admin-topbar-actions flex shrink-0 items-center rounded-lg border border-transparent px-1 py-0.5 sm:gap-2 sm:px-0 sm:py-0">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  )
}
