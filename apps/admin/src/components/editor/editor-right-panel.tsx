"use client"

import type { ReactNode, RefObject } from "react"
import { cn } from "@sovereign-cms/ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { EditorPanelTab } from "@/components/editor/editor-panel-tabs"

type EditorRightPanelProps = {
  activeTab: EditorPanelTab
  onTabChange: (tab: EditorPanelTab) => void
  scrollRef: RefObject<HTMLDivElement | null>
  inspector: ReactNode
  blocks: ReactNode
  presets: ReactNode
  governance: ReactNode
  className?: string
}

const TABS: EditorPanelTab[] = ["inspector", "blocks", "presets", "governance"]

export function EditorRightPanel({
  activeTab,
  onTabChange,
  scrollRef,
  inspector,
  blocks,
  presets,
  governance,
  className,
}: EditorRightPanelProps) {
  const w = useAdminI18n().messages.editor.workspace

  const tabLabels: Record<EditorPanelTab, string> = {
    inspector: w.tabInspector,
    blocks: w.tabBlocks,
    presets: w.tabPresets,
    governance: w.tabGovernance,
  }

  const panelContent: Record<EditorPanelTab, ReactNode> = {
    inspector,
    blocks,
    presets,
    governance,
  }

  return (
    <aside
      id="inspector-panel"
      className={cn("admin-editor-right-panel", className)}
      role="region"
      aria-label={w.rightPanelAria}
    >
      <div
        className="flex shrink-0 gap-0.5 overflow-x-auto border-b admin-border px-2 pt-2"
        role="tablist"
        aria-label={w.panelTabsAria}
      >
        {TABS.map((tab) => {
          const selected = activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`editor-tab-${tab}`}
              aria-selected={selected}
              aria-controls={`editor-tabpanel-${tab}`}
              onClick={() => onTabChange(tab)}
              className={cn(
                "shrink-0 rounded-t-md px-3 py-2 text-xs font-semibold transition-colors",
                selected
                  ? "admin-text border border-b-0 admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_40%,var(--admin-surface))]"
                  : "admin-text-muted hover:admin-text",
              )}
            >
              {tabLabels[tab]}
            </button>
          )
        })}
      </div>

      <div
        ref={scrollRef}
        className="admin-editor-right-panel-scroll relative z-[2] min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[var(--admin-surface)] p-4"
      >
        <div
          id={`editor-tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`editor-tab-${activeTab}`}
        >
          {panelContent[activeTab]}
        </div>
      </div>
    </aside>
  )
}
