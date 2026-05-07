/**
 * Block palette for adding new blocks to a page.
 * Displays available block types with labels and allows adding them to the editor.
 */

"use client"

import { listAdminBlockDefinitions } from "@/block-definitions/registry"
import { cn } from "@sovereign-cms/ui"

type BlockPaletteProps = {
  onAddBlock: (blockType: string) => void
}

/**
 * Renders a palette of available block types that can be added to a page.
 * Uses block definitions from the central registry.
 */
export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const definitions = listAdminBlockDefinitions()

  // Group by category
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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <div className="border-b border-zinc-800 px-6 py-4 bg-zinc-900/50">
        <h2 className="text-lg font-semibold text-zinc-100">Add Block</h2>
      </div>

      <div className="p-4">
        {Object.entries(byCategory).map(([category, blocks]) => (
          <div key={category} className="mb-4 last:mb-0">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {blocks.map((definition) => (
                <button
                  key={definition.type}
                  onClick={() => onAddBlock(definition.type)}
                  className={cn(
                    "w-full rounded border px-3 py-2 text-sm text-left transition-all duration-200",
                    "border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-600 active:scale-95",
                  )}
                >
                  <p className="font-medium">{definition.label}</p>
                  <p className="text-xs text-zinc-500">Type: {definition.type}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
