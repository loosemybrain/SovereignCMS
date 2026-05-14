import type { ReactNode } from "react"
import { useId } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminSectionCardProps = {
  title: string
  description?: string
  headerAction?: ReactNode
  children: ReactNode
  className?: string
  /** When true, body has slightly tighter padding (e.g. dense inspector fields). */
  dense?: boolean
}

/**
 * Section surface with header strip — visual hierarchy for inspector and settings-style layouts.
 */
export function AdminSectionCard({
  title,
  description,
  headerAction,
  children,
  className,
  dense,
}: AdminSectionCardProps) {
  const titleId = useId()
  return (
    <div
      role="region"
      aria-labelledby={titleId}
      className={cn(
        "overflow-hidden rounded-xl border admin-border admin-surface shadow-sm transition-shadow duration-200 motion-reduce:transition-none motion-reduce:hover:shadow-sm",
        "hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b admin-border px-4 py-3 admin-surface-muted">
        <div className="min-w-0 space-y-0.5">
          <h3 id={titleId} className="text-sm font-semibold tracking-tight admin-text">
            {title}
          </h3>
          {description ? (
            <p className="text-xs leading-relaxed admin-text-muted">{description}</p>
          ) : null}
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>
      <div className={cn(dense ? "p-3" : "p-4")}>{children}</div>
    </div>
  )
}
