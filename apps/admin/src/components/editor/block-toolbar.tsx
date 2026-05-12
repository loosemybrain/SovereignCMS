"use client"

import { AdminButton } from "@/components/admin-ui"

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
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="font-mono text-xs admin-text-muted">Position: {sortOrder}</p>
        <p className="text-sm font-medium admin-text capitalize">{blockType}</p>
        {isSelected ? <p className="text-xs admin-accent">Selected block</p> : null}
      </div>
      <div className="flex gap-1">
        <AdminButton
          type="button"
          variant="ghost"
          onClick={onMoveUp}
          disabled={isFirst}
          className="px-2 py-1 text-xs"
          aria-label={`Move block ${blockType} up`}
        >
          ↑
        </AdminButton>
        <AdminButton
          type="button"
          variant="ghost"
          onClick={onMoveDown}
          disabled={isLast}
          className="px-2 py-1 text-xs"
          aria-label={`Move block ${blockType} down`}
        >
          ↓
        </AdminButton>
        <AdminButton
          type="button"
          variant="danger"
          onClick={onDelete}
          className="px-2 py-1 text-xs"
          aria-label={`Delete block ${blockType}`}
        >
          ✕
        </AdminButton>
      </div>
    </div>
  )
}
