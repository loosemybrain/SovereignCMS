"use client"

import type { ReactNode } from "react"
import type { CmsBlock } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { formatAdminMessage } from "@/lib/admin-i18n"
import { BlockToolbar } from "./block-toolbar"
import { AdminButton } from "@/components/admin-ui"

type EditorBlockCardProps = {
  block: CmsBlock
  isSelected: boolean
  isInsertAfterTarget?: boolean
  isFirst: boolean
  isLast: boolean
  variant?: "preview" | "list"
  registerBlockRef?: (blockId: string, element: HTMLDivElement | null) => void
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
  variant = "list",
  registerBlockRef,
  children,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  onInsertAfter,
}: EditorBlockCardProps) {
  const { messages: t } = useAdminI18n()
  const e = t.editor

  if (variant === "preview") {
    return (
      <div
        role="listitem"
        ref={(element) => registerBlockRef?.(block.id, element)}
        className={cn(
          "admin-editor-preview-block",
          isSelected && "admin-editor-preview-block--active",
        )}
      >
        <div
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
          aria-label={formatAdminMessage(e.blockSelectAria, {
            type: block.type,
            order: String(block.sortOrder),
          })}
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
            "admin-editor-block-selectable admin-editor-block-selectable--preview relative",
            isSelected && "admin-editor-block-selectable--preview-selected admin-editor-block-linked",
            isInsertAfterTarget && "admin-editor-block-selectable--preview-insert-target",
          )}
        >
          {isSelected ? (
            <div className="admin-editor-preview-block-chrome mb-2">
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
            </div>
          ) : null}
          <div className="admin-editor-preview-block-content">{children}</div>
          {isSelected ? (
            <div className="mt-2 flex justify-end">
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                className="px-3 py-1 text-xs"
                onClick={(event) => {
                  event.stopPropagation()
                  onInsertAfter()
                }}
                aria-label={formatAdminMessage(e.blockInsertAfterAria, { type: block.type })}
              >
                {e.insertAfter}
              </AdminButton>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div role="listitem" ref={(element) => registerBlockRef?.(block.id, element)}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-label={formatAdminMessage(e.blockSelectAria, {
          type: block.type,
          order: String(block.sortOrder),
        })}
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
          isInsertAfterTarget &&
            "admin-insert-target-ring z-[1] border-[color-mix(in_oklab,var(--admin-accent)_65%,var(--admin-border))]",
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
            <p
              className="max-w-[58%] truncate font-mono text-[10px] tracking-tight admin-text-muted opacity-60"
              title={block.id}
            >
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
              aria-label={formatAdminMessage(e.blockInsertAfterAria, { type: block.type })}
            >
              {e.insertAfter}
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  )
}
