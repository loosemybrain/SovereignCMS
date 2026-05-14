import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type AdminPageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  meta?: ReactNode
  className?: string
  animate?: boolean
}

export function AdminPageHeader({
  title,
  description,
  actions,
  meta,
  className,
  animate = true,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("space-y-3", animate && "animate-slide-up", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className={cn(
            "text-3xl font-bold admin-text tracking-tight",
            animate && "animate-slide-up"
          )}>
            {title}
          </h1>
          {description && (
            <p className={cn(
              "text-sm admin-text-muted mt-1",
              animate && "animate-slide-up"
            )}>
              {description}
            </p>
          )}
        </div>
        {actions ? (
          <div className={cn(
            "shrink-0",
            animate && "animate-slide-in-right"
          )}>
            {actions}
          </div>
        ) : null}
      </div>
      {meta ? (
        <div className={cn(
          "flex flex-wrap gap-2",
          animate && "stagger-children"
        )}>
          {meta}
        </div>
      ) : null}
    </div>
  )
}
