"use client"

import { listAdminBlockDefinitions } from "@/block-definitions/registry"
import { getPresetsForBlockType } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import { AdminButton, AdminSectionCard, adminFeatureCardClassNames } from "@/components/admin-ui"
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
    <AdminSectionCard
      title="Block hinzufügen"
      description="Presets oder leeren Block wählen — Logik unverändert."
      className="overflow-hidden shadow-sm"
      headerAction={
        insertAfterBlockId && onClearInsertPosition ? (
          <AdminButton
            type="button"
            variant="ghost"
            className="px-2 py-1 text-xs"
            onClick={onClearInsertPosition}
          >
            Position zurücksetzen
          </AdminButton>
        ) : null
      }
    >
      <div className="space-y-2 border-b admin-border pb-4">
        <EditorHint tone="info">
          {insertAfterBlockId
            ? "Der neue Block wird nach der ausgewählten Position eingefügt."
            : "Der neue Block wird am Ende hinzugefügt."}
        </EditorHint>
      </div>

      <div className="pt-4">
        {Object.entries(byCategory).map(([category, blocks]) => (
          <div key={category} className="mb-8 last:mb-0">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide admin-text-muted">
              {category}
            </h3>
            <div className="space-y-5">
              {blocks.map((definition) => {
                const presets = getPresetsForBlockType(definition.type)

                return (
                  <div
                    key={definition.type}
                    className="border-l-2 border-[color-mix(in_oklab,var(--admin-accent)_45%,var(--admin-border))] pl-4"
                  >
                    <p className="mb-2 text-sm font-semibold admin-text">{definition.label}</p>

                    {presets.length > 0 ? (
                      <div className="mb-2 space-y-2">
                        {presets.map((preset) => (
                          <button
                            type="button"
                            key={preset.id}
                            onClick={() => onAddBlock(definition.type, preset.id)}
                            className={cn("w-full admin-text", adminFeatureCardClassNames(false))}
                          >
                            <p className="text-xs font-semibold">{preset.label}</p>
                            {preset.description ? (
                              <p className="mt-0.5 text-xs admin-text-muted">{preset.description}</p>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => onAddBlock(definition.type)}
                      className={cn(
                        "w-full text-xs admin-text-muted",
                        adminFeatureCardClassNames(false),
                        "opacity-90 hover:opacity-100",
                      )}
                    >
                      <span className="font-semibold admin-text">Leerer Block</span>
                      <span className="mt-0.5 block text-[11px] admin-text-muted">
                        Ohne Preset-Startwerte
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </AdminSectionCard>
  )
}
