import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type EditorPanelProps = {
  children: ReactNode
  className?: string
  variant?: "default" | "muted" | "accent" | "danger"
}

const variantClasses: Record<NonNullable<EditorPanelProps["variant"]>, string> = {
  default: "admin-surface border admin-border shadow-sm",
  muted: "admin-surface-muted/70 border admin-border",
  accent: "admin-accent-bg border border-sky-400/40 shadow-sm",
  danger: "bg-red-50 border border-red-300",
}

export function EditorPanel({ children, className, variant = "default" }: EditorPanelProps) {
  return <div className={cn("rounded-lg p-3", variantClasses[variant], className)}>{children}</div>
}
