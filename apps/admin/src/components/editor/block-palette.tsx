"use client"

import type { LucideIcon } from "lucide-react"
import {
  Box,
  Type,
  Globe,
  Image as ImageIcon,
  LayoutGrid,
  Layers,
  Mail,
  Megaphone,
  Sparkles,
} from "lucide-react"
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

const blockTypeIcon: Record<string, LucideIcon> = {
  hero: Sparkles,
  text: Type,
  "contact-form": Mail,
  "external-embed": Globe,
  cta: Megaphone,
  "feature-grid": LayoutGrid,
  "image-text": ImageIcon,
}

function iconForType(type: string): LucideIcon {
  return blockTypeIcon[type] ?? Box
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
      description="Karten pro Blocktyp — Presets und leerer Block, gleiche Logik wie zuvor."
      variant="glass"
      className="overflow-hidden shadow-md"
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
      <div className="space-y-3 border-b admin-border pb-4">
        <EditorHint tone="info">
          {insertAfterBlockId
            ? "Der neue Block wird nach der markierten Karte eingefügt (Einfügemarke aktiv)."
            : "Der neue Block wird am Ende der Seite eingefügt."}
        </EditorHint>
      </div>

      <div className="pt-5">
        {Object.entries(byCategory).map(([category, blocks]) => (
          <div key={category} className="mb-10 last:mb-0">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-[color-mix(in_oklab,var(--admin-accent)_70%,transparent)]" />
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] admin-text-muted">{category}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {blocks.map((definition) => {
                const presets = getPresetsForBlockType(definition.type)
                const Icon = iconForType(definition.type)

                return (
                  <div
                    key={definition.type}
                    className="flex flex-col overflow-hidden rounded-2xl border admin-border admin-surface shadow-sm transition-[border-color,box-shadow] duration-200 ease-out hover:border-[color-mix(in_oklab,var(--admin-accent)_28%,var(--admin-border))] hover:shadow-md motion-reduce:transition-none"
                  >
                    <div className="flex items-center gap-3 border-b admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_40%,var(--admin-surface))] px-4 py-3">
                      <div className="admin-palette-type-icon h-11 w-11 shrink-0 rounded-xl [&>svg]:h-5 [&>svg]:w-5">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold admin-text">{definition.label}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wide text-[color-mix(in_oklab,var(--admin-text-muted)_95%,transparent)]">
                          {definition.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-3.5 p-4">
                      {presets.length > 0 ? (
                        <div>
                          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] admin-text-muted">
                            Presets
                          </p>
                          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {presets.map((preset) => (
                              <button
                                type="button"
                                key={preset.id}
                                onClick={() => onAddBlock(definition.type, preset.id)}
                                className={cn(
                                  "min-h-[4.25rem] w-full text-left transition-[border-color,box-shadow] duration-200 ease-out",
                                  adminFeatureCardClassNames(false),
                                  "rounded-xl border-2 bg-[color-mix(in_oklab,var(--admin-surface-muted)_32%,var(--admin-surface))] py-2.5 hover:border-[color-mix(in_oklab,var(--admin-accent)_22%,var(--admin-border))] motion-reduce:transition-none",
                                )}
                              >
                                <span className="block text-xs font-semibold">{preset.label}</span>
                                {preset.description ? (
                                  <span className="mt-0.5 line-clamp-2 block text-[11px] admin-text-muted">
                                    {preset.description}
                                  </span>
                                ) : null}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onAddBlock(definition.type)}
                        className={adminFeatureCardClassNames(
                          false,
                          "mt-auto w-full rounded-xl border-2 border-dashed text-left text-xs admin-text-muted opacity-95 transition-[border-color,opacity] duration-200 ease-out hover:opacity-100 motion-reduce:transition-none",
                        )}
                      >
                        <span className="flex items-center gap-2 font-semibold admin-text">
                          <Layers className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                          Leerer Block
                        </span>
                        <span className="mt-1 block text-[11px] admin-text-muted">Ohne Preset-Startwerte</span>
                      </button>
                    </div>
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
