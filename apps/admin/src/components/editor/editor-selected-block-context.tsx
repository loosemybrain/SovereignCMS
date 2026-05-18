"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { formatAdminMessage } from "@/lib/admin-i18n"
import { getBlockEditorExcerpt, getBlockTypeLabel } from "@/lib/editor-block-context"
import { EditorBlockTypeIcon } from "@/lib/editor-block-icons"

type EditorSelectedBlockContextProps = {
  block: CmsBlock
  displayIndex: number
  total: number
  className?: string
  variant?: "header" | "chip"
}

export function EditorSelectedBlockContext({
  block,
  displayIndex,
  total,
  className,
  variant = "header",
}: EditorSelectedBlockContextProps) {
  const o = useAdminI18n().messages.editor.orientation
  const typeLabel = getBlockTypeLabel(block)
  const excerpt = getBlockEditorExcerpt(block)
  const positionLabel = formatAdminMessage(o.blockPosition, {
    current: String(displayIndex),
    total: String(total),
  })

  const isChip = variant === "chip"

  return (
    <header
      className={cn(
        "admin-editor-selected-context",
        isChip ? "admin-editor-selected-context--chip" : "admin-editor-selected-context--header",
        className,
      )}
      aria-label={o.contextHeaderAria}
    >
      <span className="admin-editor-selected-context-accent" aria-hidden />
      <span className="admin-editor-selected-context-icon" aria-hidden>
        <EditorBlockTypeIcon blockType={block.type} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-xs font-semibold tracking-tight admin-text">{typeLabel}</span>
          <span className="text-[10px] font-medium tabular-nums admin-text-muted">{positionLabel}</span>
        </span>
        {excerpt ? (
          <p className={cn("mt-0.5 truncate admin-text-muted", isChip ? "text-[10px]" : "text-xs")}>
            {excerpt}
          </p>
        ) : (
          <p className={cn("mt-0.5 admin-text-muted", isChip ? "text-[10px]" : "text-xs")}>
            {o.noExcerpt}
          </p>
        )}
      </span>
    </header>
  )
}
