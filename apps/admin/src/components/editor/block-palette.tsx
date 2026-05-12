"use client"

import { listAdminBlockDefinitions } from "@/block-definitions/registry"
import { cn } from "@sovereign-cms/ui"
import { AdminButton } from "@/components/admin-ui"
import { EditorHint } from "@/components/editor/patterns"

type BlockPaletteProps = {
  onAddBlock: (blockType: string) => void
  insertAfterBlockId?: string | null
  onClearInsertPosition?: () => void
}

export function BlockPalette({
  onAddBlock,
  insertAfterBlockId,
  onClearInsertPosition,
}: BlockPaletteProps) {
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
    <div className="rounded-lg border admin-border admin-surface overflow-hidden">
      <div className="border-b admin-border px-6 py-4 admin-surface-muted space-y-2">
        <h2 className="text-lg font-semibold admin-text">Add Block</h2>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <EditorHint tone="info">
            {insertAfterBlockId
              ? "New block will be inserted after selected position."
              : "New block will be added at the end."}
            </EditorHint>
          </div>
          {insertAfterBlockId && onClearInsertPosition ? (
            <AdminButton
              type="button"
              variant="ghost"
              className="px-2 py-1 text-xs"
              onClick={onClearInsertPosition}
            >
              Clear insert position
            </AdminButton>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        {Object.entries(byCategory).map(([category, blocks]) => (
          <div key={category} className="mb-4 last:mb-0">
            <h3 className="text-xs font-medium admin-text-muted uppercase tracking-wide mb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {blocks.map((definition) => (
                <button
                  type="button"
                  key={definition.type}
                  onClick={() => onAddBlock(definition.type)}
                  className={cn(
                    "w-full rounded border px-3 py-2 text-sm text-left transition-all duration-200 admin-focus-ring",
                    "admin-border admin-surface admin-text hover:opacity-90 active:scale-95",
                  )}
                >
                  <p className="font-medium">{definition.label}</p>
                  <p className="text-xs admin-text-muted">Type: {definition.type}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
