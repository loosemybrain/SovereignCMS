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
        "overflow-x-auto rounded-xl border admin-border admin-surface shadow-sm transition-shadow duration-200 hover:shadow-md",
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
      <tr className="border-b admin-border admin-surface-muted bg-[color-mix(in_oklab,var(--admin-surface-muted)_0.5,var(--admin-surface))]">{children}</tr>
    </thead>
  )
}

export function AdminDataTableTh({
  children,
  className,
  sortable = false,
}: {
  children: ReactNode
  className?: string
  sortable?: boolean
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide admin-text-muted",
        sortable && "cursor-pointer select-none hover:admin-text transition-colors",
        className,
      )}
    >
      {children}
    </th>
  )
}

export function AdminDataTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y admin-border">{children}</tbody>
}

export function AdminDataTableRow({
  children,
  className,
  hover = true,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150",
        hover && "admin-row-hover",
        className,
      )}
    >
      {children}
    </tr>
  )
}

export function AdminDataTableCell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <td className={cn("px-4 py-3 admin-text", className)}>
      {children}
    </td>
  )
}
