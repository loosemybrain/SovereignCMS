import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminDataTableProps = {
  children: ReactNode
  className?: string
}

/**
 * Presentational table shell: rounded border, horizontal scroll on small viewports.
 */
export function AdminDataTable({ children, className }: AdminDataTableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border admin-border admin-surface shadow-sm",
        className,
      )}
    >
      <table className="w-full min-w-[32rem] text-sm">{children}</table>
    </div>
  )
}

export function AdminDataTableHeadRow({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b admin-border admin-surface-muted">{children}</tr>
    </thead>
  )
}

export function AdminDataTableTh({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide admin-text-muted",
        className,
      )}
    >
      {children}
    </th>
  )
}
