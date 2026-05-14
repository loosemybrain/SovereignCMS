import type { ReactNode, TdHTMLAttributes } from "react"
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
        "admin-surface-table-wrap admin-gov-table-scroll overflow-x-auto admin-surface-interactive",
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
      <tr className="border-b admin-border bg-transparent">{children}</tr>
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
        "admin-surface-table-th text-left text-[11px] font-bold uppercase tracking-[0.12em] admin-text-muted",
        sortable &&
          "cursor-pointer select-none transition-[color,background-color] duration-200 ease-out hover:bg-[color-mix(in_oklab,var(--admin-surface-muted)_100%,var(--admin-surface))] hover:admin-text motion-reduce:transition-none",
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
        "transition-[background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
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
  ...props
}: {
  children: ReactNode
  className?: string
} & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("admin-surface-table-td align-middle admin-text", className)} {...props}>
      {children}
    </td>
  )
}
