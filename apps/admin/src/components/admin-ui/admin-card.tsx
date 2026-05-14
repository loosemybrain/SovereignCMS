import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type AdminCardVariant = "default" | "elevated" | "glass"

type AdminCardProps = {
  children: ReactNode
  variant?: AdminCardVariant
  className?: string
  interactive?: boolean
}

const variantClasses: Record<AdminCardVariant, string> = {
  default: "border admin-border admin-surface",
  elevated: "border admin-border admin-surface shadow-lg glow-sm",
  glass: "glass border admin-border/30",
}

export function AdminCard({
  children,
  variant = "default",
  className,
  interactive = false,
}: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-5 transition-all duration-300",
        variantClasses[variant],
        interactive && "card-hover cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AdminCardHeader({ children, className }: AdminCardProps) {
  return <div className={cn("mb-5 flex items-start justify-between", className)}>{children}</div>
}

export function AdminCardTitle({ children, className }: AdminCardProps) {
  return (
    <h2 className={cn("text-base font-semibold admin-text leading-tight", className)}>
      {children}
    </h2>
  )
}

export function AdminCardDescription({ children, className }: AdminCardProps) {
  return <p className={cn("text-sm admin-text-muted mt-1.5", className)}>{children}</p>
}

export function AdminCardContent({ children, className }: AdminCardProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>
}

export function AdminCardFooter({ children, className }: AdminCardProps) {
  return <div className={cn("mt-5 pt-4 border-t admin-border flex items-center justify-end gap-2", className)}>{children}</div>
}
