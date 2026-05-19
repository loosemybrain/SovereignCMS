"use client"

import { listAdminBlockDefinitions } from "@/block-definitions/registry"
import { getEditorBlockTypeIcon } from "@/lib/editor-block-icons"
import { cn } from "@sovereign-cms/ui"
import { AdminButton } from "@/components/admin-ui"
import { EditorHint } from "@/components/editor/patterns"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { getLocalizedBlockCategory, getLocalizedBlockLabel } from "@/lib/admin-block-i18n"

type BlockPaletteBlocksTabProps = {
  onAddBlock: (blockType: string) => void
  insertAfterBlockId?: string | null
  onClearInsertPosition?: () => void
}

export function BlockPaletteBlocksTab({
  onAddBlock,
  insertAfterBlockId,
  onClearInsertPosition,
}: BlockPaletteBlocksTabProps) {
  const { locale, messages } = useAdminI18n()
  const w = messages.editor.workspace
  const definitions = listAdminBlockDefinitions()

  const byCategory = definitions.reduce(
    (acc, def) => {
      if (!acc[def.category]) {
        acc[def.category] = []
      }
      acc[def.category].push(def)
      return acc
    },
    {} as Record<string, typeof definitions>,
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <EditorHint tone="info">
          {insertAfterBlockId ? w.insertAfterActive : w.insertAtEnd}
        </EditorHint>
        {insertAfterBlockId && onClearInsertPosition ? (
          <AdminButton type="button" variant="ghost" className="px-2 py-1 text-xs" onClick={onClearInsertPosition}>
            {w.clearInsertPosition}
          </AdminButton>
        ) : null}
      </div>

      {Object.entries(byCategory).map(([category, blocks]) => (
        <div key={category}>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] admin-text-muted">
            {getLocalizedBlockCategory(category, locale)}
          </h3>
          <ul className="space-y-1.5" role="list">
            {blocks.map((definition) => {
              const Icon = getEditorBlockTypeIcon(definition.type)
              return (
                <li key={definition.type}>
                  <button
                    type="button"
                    onClick={() => onAddBlock(definition.type)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border admin-border px-3 py-2.5 text-left transition-colors",
                      "hover:border-[color-mix(in_oklab,var(--admin-accent)_28%,var(--admin-border))] admin-gov-nested-surface",
                    )}
                  >
                    <span className="admin-palette-type-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium admin-text">
                        {getLocalizedBlockLabel(definition.type, locale)}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wide admin-text-muted">
                        {definition.type}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
