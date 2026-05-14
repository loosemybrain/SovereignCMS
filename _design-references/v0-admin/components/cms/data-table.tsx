"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export type StatusType = "published" | "draft" | "archived" | "completed" | "pending"

const statusStyles: Record<StatusType, { bg: string; text: string; dot: string }> = {
  published: { 
    bg: "bg-emerald-500/10", 
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500"
  },
  draft: { 
    bg: "bg-amber-500/10", 
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500"
  },
  archived: { 
    bg: "bg-slate-500/10", 
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-500"
  },
  completed: { 
    bg: "bg-emerald-500/10", 
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500"
  },
  pending: { 
    bg: "bg-blue-500/10", 
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500"
  },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status]
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium capitalize px-2.5 py-1 gap-1.5 border-0 transition-all duration-300 hover:scale-105",
        style.bg,
        style.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", style.dot)} />
      {status}
    </Badge>
  )
}

export interface Column<T> {
  key: keyof T | string
  header: string
  className?: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden bg-card shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up",
      className
    )}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-muted/70 to-muted/50 hover:bg-muted/70 border-b">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider h-11 text-muted-foreground",
                  column.className
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <span>{emptyMessage}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={keyExtractor(item)}
                className={cn(
                  "group transition-all duration-300 animate-slide-up",
                  onRowClick && "cursor-pointer"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={String(column.key)} 
                    className={cn(
                      "py-4 transition-colors duration-300 group-hover:bg-muted/30",
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[column.key as string] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
