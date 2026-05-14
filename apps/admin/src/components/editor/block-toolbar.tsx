"use client"

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { AdminButton } from "@/components/admin-ui"
import { cn } from "@sovereign-cms/ui"

type BlockToolbarProps = {
  blockType: string
  sortOrder: number
  isFirst: boolean
  isLast: boolean
  isSelected: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

export function BlockToolbar({
  blockType,
  sortOrder,
  isFirst,
  isLast,
  isSelected,
  onMoveUp,
  onMoveDown,
  onDelete,
}: BlockToolbarProps) {
  return (
    <div className="admin-surface-toolbar flex flex-col gap-3 px-[var(--admin-toolbar-pad-x)] py-[var(--admin-toolbar-pad-y)] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold capitalize tracking-tight admin-text">{blockType}</p>
        <p className="sr-only">
          Position {sortOrder} · {isSelected ? "ausgewählt" : "nicht ausgewählt"}
        </p>
        <p className="mt-0.5 text-[11px] tabular-nums admin-text-muted" aria-hidden>
          Reihenfolge · {sortOrder}
        </p>
        {isSelected ? (
          <p className="mt-0.5 text-[11px] font-medium text-[color-mix(in_oklab,var(--admin-accent)_88%,var(--admin-text))]">
            Ausgewählt
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2">
        <div className="admin-surface-toolbar-well flex gap-0.5 p-0.5">
          <AdminButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            className={cn("h-8 min-w-8 px-0 py-0", isFirst && "opacity-40")}
            aria-label={`Block ${blockType} nach oben`}
          >
            <ChevronUp className="h-4 w-4" aria-hidden />
          </AdminButton>
          <AdminButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            className={cn("h-8 min-w-8 px-0 py-0", isLast && "opacity-40")}
            aria-label={`Block ${blockType} nach unten`}
          >
            <ChevronDown className="h-4 w-4" aria-hidden />
          </AdminButton>
        </div>
        <AdminButton
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="admin-toolbar-destructive-quiet h-8 gap-1.5 px-2.5 text-xs"
          aria-label={`Block ${blockType} löschen`}
        >
          <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Entfernen
        </AdminButton>
      </div>
    </div>
  )
}
