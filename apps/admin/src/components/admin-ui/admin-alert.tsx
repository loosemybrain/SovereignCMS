import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminAlertVariant = "info" | "warning" | "success" | "destructive"

export type AdminAlertProps = {
  variant?: AdminAlertVariant
  title?: string
  children: ReactNode
  className?: string
  /** Decorative icon (e.g. inline SVG). Keep small; use aria-hidden on icons. */
  icon?: ReactNode
}

const variantClass: Record<AdminAlertVariant, string> = {
  info: "admin-callout-info",
  warning: "admin-callout-warning",
  success: "admin-callout-success",
  destructive: "admin-callout-error",
}

/**
 * Non-blocking contextual message. Uses theme-scoped callout tokens (globals.css).
 */
export function AdminAlert({ variant = "info", title, children, className, icon }: AdminAlertProps) {
  return (
    <div
      role="status"
      className={cn("border p-3.5 text-sm leading-relaxed", variantClass[variant], className)}
    >
      <div className="flex gap-3">
        {icon ? (
          <span className="mt-0.5 shrink-0 [&>svg]:h-4 [&>svg]:w-4" aria-hidden>
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 space-y-1">
          {title ? <p className="font-semibold leading-tight">{title}</p> : null}
          <div className="opacity-95">{children}</div>
        </div>
      </div>
    </div>
  )
}
