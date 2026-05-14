import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminConfigGridProps = {
  children: ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

const colClass: Record<NonNullable<AdminConfigGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

export function AdminConfigGrid({ children, className, columns = 2 }: AdminConfigGridProps) {
  return (
    <div className={cn("grid gap-4", colClass[columns], className)}>{children}</div>
  )
}
