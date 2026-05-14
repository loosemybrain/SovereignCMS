import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type AdminPageHeaderProps = {
  title: string
  /** Small uppercase meta row above the title (e.g. section label). */
  eyebrow?: ReactNode
  description?: string
  actions?: ReactNode
  meta?: ReactNode
  className?: string
  animate?: boolean
}

export function AdminPageHeader({
  title,
  eyebrow,
  description,
  actions,
  meta,
  className,
  animate = true,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("space-y-4", animate && "animate-slide-up", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          {eyebrow ? (
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] admin-text-muted">{eyebrow}</div>
          ) : null}
          <h1
            className={cn(
              "admin-page-title-gradient text-3xl font-bold tracking-tight sm:text-[2rem] sm:leading-tight",
              animate && "animate-slide-up",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                "max-w-2xl text-sm leading-relaxed admin-text-muted sm:text-[0.9375rem]",
                animate && "animate-slide-up",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div
            className={cn(
              "admin-page-header-actions flex shrink-0 flex-wrap items-center sm:pt-1",
              animate && "animate-slide-in-right",
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
      {meta ? (
        <div className={cn("flex flex-wrap gap-2", animate && "stagger-children")}>{meta}</div>
      ) : null}
    </div>
  )
}
