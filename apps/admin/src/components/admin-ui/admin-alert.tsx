"use client"

import type { ReactNode } from "react"
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"
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

const defaultIcon: Record<AdminAlertVariant, ReactNode> = {
  info: <Info className="h-4 w-4" strokeWidth={2} aria-hidden />,
  warning: <AlertTriangle className="h-4 w-4" strokeWidth={2} aria-hidden />,
  success: <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden />,
  destructive: <XCircle className="h-4 w-4" strokeWidth={2} aria-hidden />,
}

/**
 * Non-blocking contextual message. Uses theme-scoped callout tokens (globals.css).
 */
export function AdminAlert({ variant = "info", title, children, className, icon }: AdminAlertProps) {
  const resolvedIcon = icon ?? defaultIcon[variant]
  const role = variant === "destructive" ? "alert" : "status"

  return (
    <div
      role={role}
      className={cn(
        "admin-alert-shell relative p-3.5 text-sm leading-relaxed",
        variantClass[variant],
        className,
      )}
    >
      <div className="relative flex gap-3">
        <span className="admin-alert-icon-badge mt-0.5 text-(--admin-accent) [&>svg]:shrink-0" aria-hidden>
          {resolvedIcon}
        </span>
        <div className="min-w-0 space-y-1">
          {title ? <p className="font-semibold leading-tight admin-text">{title}</p> : null}
          <div className="opacity-[0.96] admin-text [&_a]:admin-accent">{children}</div>
        </div>
      </div>
    </div>
  )
}
