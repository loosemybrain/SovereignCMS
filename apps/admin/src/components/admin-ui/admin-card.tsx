import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type AdminCardProps = {
  children: ReactNode
  className?: string
}

export function AdminCard({ children, className }: AdminCardProps) {
  return (
    <div className={cn("rounded-xl border admin-border admin-surface p-5", className)}>
      {children}
    </div>
  )
}

export function AdminCardHeader({ children, className }: AdminCardProps) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

export function AdminCardTitle({ children, className }: AdminCardProps) {
  return <h2 className={cn("text-lg font-semibold admin-text", className)}>{children}</h2>
}

export function AdminCardDescription({ children, className }: AdminCardProps) {
  return <p className={cn("text-sm admin-text-muted mt-1", className)}>{children}</p>
}

export function AdminCardContent({ children, className }: AdminCardProps) {
  return <div className={cn("space-y-3", className)}>{children}</div>
}
