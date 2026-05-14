"use client"

import type { ReactNode } from "react"
import type { CmsBlock } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import { BlockToolbar } from "./block-toolbar"
import { AdminButton } from "@/components/admin-ui"

type EditorBlockCardProps = {
  block: CmsBlock
  isSelected: boolean
  /** When user chose “insert after” on this block — show insertion affordance. */
  isInsertAfterTarget?: boolean
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
  isInsertAfterTarget,
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
        aria-label={`Block ${block.type} an Position ${block.sortOrder} auswählen`}
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
          "admin-editor-block-selectable relative cursor-pointer overflow-hidden p-4",
          isInsertAfterTarget && "admin-insert-target-ring z-[1] border-[color-mix(in_oklab,var(--admin-accent)_65%,var(--admin-border))]",
          isSelected ? "admin-block-card-selected z-[1]" : "admin-surface-block-card",
        )}
      >
        {isSelected ? (
          <span
            className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-linear-to-b from-sky-400 via-indigo-500 to-violet-600 opacity-90"
            aria-hidden
          />
        ) : null}
        <div className="relative space-y-3">
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
          <div className="admin-surface-meta-pill">{block.visibility}</div>
          <div className="mt-1 border-t admin-border pt-3">{children}</div>
          <div className="flex items-center justify-between gap-2 border-t admin-border pt-3">
            <p className="max-w-[58%] truncate font-mono text-[10px] tracking-tight admin-text-muted opacity-60" title={block.id}>
              {block.id}
            </p>
            <AdminButton
              type="button"
              variant="secondary"
              className="shrink-0 px-3 py-1.5 text-xs"
              onClick={(event) => {
                event.stopPropagation()
                onInsertAfter()
              }}
              aria-label={`Neuen Block nach ${block.type} einfügen`}
            >
              Danach einfügen
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  )
}
