import type { ReactNode } from "react"
import { useId } from "react"
import { cn } from "@sovereign-cms/ui"

/** Limited surface weights — see docs/architecture/admin-surface-system-phase-57.md */
export type AdminSectionCardVariant = "default" | "elevated" | "muted" | "accent" | "inset" | "glass"

export type AdminSectionCardProps = {
  title: string
  description?: string
  /** Optional leading icon or mark in the header strip (decorative). */
  headerIcon?: ReactNode
  headerAction?: ReactNode
  children: ReactNode
  className?: string
  /** When true, body has slightly tighter padding (e.g. dense inspector fields). */
  dense?: boolean
  /** Visual weight — `glass` uses a frosted header strip; body matches `muted`. */
  variant?: AdminSectionCardVariant
}

const variantRoot: Record<AdminSectionCardVariant, string> = {
  default: "admin-surface-section admin-surface-section--default admin-surface-interactive",
  elevated: "admin-surface-section admin-surface-interactive admin-section-card-elevated",
  muted: "admin-surface-section admin-surface-section--muted admin-surface-interactive",
  accent: "admin-surface-section admin-surface-section--accent admin-surface-interactive",
  inset: "admin-surface-section admin-surface-section--inset admin-surface-interactive",
  glass: "admin-surface-section admin-surface-section--muted admin-surface-interactive",
}

/**
 * Section surface with header strip — visual hierarchy for inspector and settings-style layouts.
 */
export function AdminSectionCard({
  title,
  description,
  headerIcon,
  headerAction,
  children,
  className,
  dense,
  variant = "default",
}: AdminSectionCardProps) {
  const titleId = useId()
  return (
    <div
      role="region"
      aria-labelledby={titleId}
      className={cn(variantRoot[variant], className)}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-3 border-b admin-border px-4 py-3 admin-section-card-head",
          variant === "glass" && "admin-section-card-glass-head",
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {headerIcon ? (
            <span className="mt-0.5 shrink-0 text-(--admin-accent) opacity-90 [&>svg]:h-5 [&>svg]:w-5" aria-hidden>
              {headerIcon}
            </span>
          ) : null}
          <div className="min-w-0 space-y-0.5">
            <h3 id={titleId} className="text-sm font-bold tracking-tight admin-text">
              {title}
            </h3>
            {description ? (
              <p className="text-xs leading-relaxed admin-text-muted">{description}</p>
            ) : null}
          </div>
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>
      <div
        className={cn(
          dense ? "admin-surface-section-body-dense" : "admin-surface-section-body",
        )}
      >
        {children}
      </div>
    </div>
  )
}
