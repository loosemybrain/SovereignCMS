"use client"

import { listAdminBlockDefinitions } from "@/block-definitions/registry"
import { getPresetsForBlockType } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import { AdminButton } from "@/components/admin-ui"
import { EditorHint } from "@/components/editor/patterns"

type BlockPaletteProps = {
  onAddBlock: (blockType: string, presetId?: string) => void
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
        <h2 className="text-lg font-semibold admin-text">Block hinzufügen</h2>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <EditorHint tone="info">
            {insertAfterBlockId
              ? "Der neue Block wird nach der ausgewählten Position eingefügt."
              : "Der neue Block wird am Ende hinzugefügt."}
            </EditorHint>
          </div>
          {insertAfterBlockId && onClearInsertPosition ? (
            <AdminButton
              type="button"
              variant="ghost"
              className="px-2 py-1 text-xs"
              onClick={onClearInsertPosition}
            >
              Position zurücksetzen
            </AdminButton>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        {Object.entries(byCategory).map(([category, blocks]) => (
          <div key={category} className="mb-6 last:mb-0">
            <h3 className="text-xs font-medium admin-text-muted uppercase tracking-wide mb-3">
              {category}
            </h3>
            <div className="space-y-4">
              {blocks.map((definition) => {
                const presets = getPresetsForBlockType(definition.type)

                return (
                  <div key={definition.type} className="border-l-2 admin-border pl-3">
                    <p className="text-sm font-medium admin-text mb-2">{definition.label}</p>

                    {presets.length > 0 ? (
                      <div className="space-y-2 mb-2">
                        {presets.map((preset) => (
                          <button
                            type="button"
                            key={preset.id}
                            onClick={() => onAddBlock(definition.type, preset.id)}
                            className={cn(
                              "w-full rounded border px-3 py-2 text-xs text-left transition-all duration-200 admin-focus-ring",
                              "admin-border admin-surface admin-text hover:opacity-90 active:scale-95",
                            )}
                          >
                            <p className="font-medium text-xs">{preset.name}</p>
                            <p className="text-xs admin-text-muted">{preset.description}</p>
                          </button>
                        ))}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => onAddBlock(definition.type)}
                      className={cn(
                        "w-full rounded border px-3 py-2 text-xs text-left transition-all duration-200 admin-focus-ring",
                        "admin-border admin-surface admin-text-muted hover:opacity-90 active:scale-95 opacity-75",
                      )}
                    >
                      <p className="text-xs font-medium">Leerer Block</p>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
