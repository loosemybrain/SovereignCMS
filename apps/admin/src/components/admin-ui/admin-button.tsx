import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type AdminButtonVariant = "primary" | "secondary" | "danger" | "ghost"

type AdminButtonProps = {
  children: ReactNode
  variant?: AdminButtonVariant
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantClasses: Record<AdminButtonVariant, string> = {
  primary: "admin-accent-bg admin-text border admin-border hover:opacity-90",
  secondary: "admin-surface-muted admin-text border admin-border hover:opacity-90",
  danger: "bg-red-600/20 text-red-300 border border-red-700/60 hover:bg-red-600/30",
  ghost: "bg-transparent admin-text border admin-border hover:admin-surface-muted",
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  disabled,
  ...props
}: AdminButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
        disabled && "cursor-not-allowed opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
