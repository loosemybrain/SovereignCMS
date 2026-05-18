"use client"

import { getPresetsForBlockType, isSupportedPresetBlockType } from "@sovereign-cms/core"
import { listAdminBlockDefinitions } from "@/block-definitions/registry"
import { cn } from "@sovereign-cms/ui"
import { adminFeatureCardClassNames } from "@/components/admin-ui"
import { AdminEmptyState } from "@/components/admin-ui"
import { EditorHint } from "@/components/editor/patterns"
import { useAdminI18n } from "@/components/admin-i18n-provider"

type BlockPalettePresetsTabProps = {
  onAddBlock: (blockType: string, presetId: string) => void
  insertAfterBlockId?: string | null
}

export function BlockPalettePresetsTab({ onAddBlock, insertAfterBlockId }: BlockPalettePresetsTabProps) {
  const { messages: t } = useAdminI18n()
  const w = t.editor.workspace
  const o = t.editor.orientation
  const definitions = listAdminBlockDefinitions().filter((def) =>
    isSupportedPresetBlockType(def.type) && getPresetsForBlockType(def.type).length > 0,
  )

  if (definitions.length === 0) {
    return (
      <AdminEmptyState title={o.emptyPresetsTitle} description={o.emptyPresetsDescription} />
    )
  }

  return (
    <div className="space-y-4">
      <EditorHint tone="info">{insertAfterBlockId ? w.insertAfterActive : w.insertAtEnd}</EditorHint>
      {definitions.map((definition) => {
        const presets = getPresetsForBlockType(definition.type)
        return (
          <div key={definition.type}>
            <h3 className="mb-2 text-xs font-semibold admin-text">{definition.label}</h3>
            <ul className="grid grid-cols-1 gap-2" role="list">
              {presets.map((preset) => (
                <li key={preset.id}>
                  <button
                    type="button"
                    onClick={() => onAddBlock(definition.type, preset.id)}
                    className={cn(
                      "w-full text-left",
                      adminFeatureCardClassNames(false),
                      "rounded-lg border admin-border px-3 py-2.5 hover:border-[color-mix(in_oklab,var(--admin-accent)_22%,var(--admin-border))]",
                    )}
                  >
                    <span className="block text-xs font-semibold admin-text">{preset.label}</span>
                    {preset.description ? (
                      <span className="mt-0.5 line-clamp-2 block text-[11px] admin-text-muted">
                        {preset.description}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
