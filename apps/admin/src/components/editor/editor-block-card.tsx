"use client"

import type { ReactNode } from "react"
import type { CmsBlock } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import { BlockToolbar } from "./block-toolbar"
import { AdminButton } from "@/components/admin-ui"

type EditorBlockCardProps = {
  block: CmsBlock
  isSelected: boolean
  isFirst: boolean
  isLast: boolean
  children: ReactNode
  onSelect: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onInsertAfter: () => void
}

export function EditorBlockCard({
  block,
  isSelected,
  isFirst,
  isLast,
  children,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  onInsertAfter,
}: EditorBlockCardProps) {
  return (
    <div role="listitem">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-label={`Select block ${block.type} at position ${block.sortOrder}`}
        onClick={(event) => {
          event.stopPropagation()
          onSelect()
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            onSelect()
          }
        }}
        className={cn(
          "cursor-pointer rounded-lg border p-4 transition-all duration-200 admin-focus-ring animate-scale-in",
          isSelected
            ? "border-sky-500 admin-accent-bg ring-1 ring-sky-400/40 shadow-md"
            : "admin-border hover:shadow-md hover:border-[color-mix(in_oklab,var(--admin-accent)_55%,var(--admin-border))]",
        )}
      >
        <div className="space-y-2">
          <BlockToolbar
            blockType={block.type}
            sortOrder={block.sortOrder}
            isFirst={isFirst}
            isLast={isLast}
            isSelected={isSelected}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
          />
          <div className="text-xs px-2 py-1 rounded admin-surface-muted admin-text-muted w-fit">
            {block.visibility}
          </div>
          <div className="pt-2 border-t admin-border mt-2">{children}</div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs admin-text-muted font-mono pt-1">{block.id}</p>
            <AdminButton
              type="button"
              variant="secondary"
              className="px-2 py-1 text-xs"
              onClick={(event) => {
                event.stopPropagation()
                onInsertAfter()
              }}
              aria-label={`Insert block after ${block.type}`}
            >
              Insert after
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  )
}
