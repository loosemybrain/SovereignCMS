"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { CmsBlock, CmsPage, ContentTransitionAction, SeoMetadata } from "@sovereign-cms/core"
import {
  cloneBlockPropsForNewBlock,
  createDefaultSeoMetadata,
  getAvailableActionsForStatus,
  getPresetForBlockType,
  isSupportedPresetBlockType,
  summarizeGovernanceIssues,
} from "@sovereign-cms/core"
import type { AdminTenantContext } from "@sovereign-cms/tenancy"
import { EditorInspector } from "@/components/editor-inspector"
import { PublishGovernancePanel } from "@/components/admin-ui"
import { getPageGovernanceIssues, type PageGovernanceNavigationItem } from "@/lib/page-governance"
import { getBlockEditorPosition } from "@/lib/editor-block-context"
import { clientEditorPersistence } from "@/lib/client-editor-persistence"
import { clientPageStatusPersistence } from "@/lib/client-page-status-persistence"
import { mergeProps } from "@/lib/merge-props"
import { useEditorState } from "@/lib/editor-state"
import { getAdminBlockDefinition } from "@/block-definitions/registry"
import { moveBlockUp, moveBlockDown, normalizeBlockOrder, deleteBlock } from "@/lib/reorder-blocks"
import { useEditorAnnouncements } from "@/lib/use-editor-announcements"
import { EditorLiveRegion } from "@/components/editor-live-region"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { EditorLivePreview } from "@/components/editor/editor-live-preview"
import type { EditorDeviceMode } from "@/components/editor/editor-device-preview-bar"
import { EditorRightPanel } from "@/components/editor/editor-right-panel"
import type { EditorPanelTab } from "@/components/editor/editor-panel-tabs"
import { BlockPaletteBlocksTab } from "@/components/editor/block-palette-blocks-tab"
import { BlockPalettePresetsTab } from "@/components/editor/block-palette-presets-tab"

type PageEditorClientProps = {
  page: CmsPage
  blocks: CmsBlock[]
  navigationGovernanceItems?: PageGovernanceNavigationItem[]
  tenant: AdminTenantContext
  databaseAdapterLabel: string
}

export function PageEditorClient({
  page,
  blocks,
  navigationGovernanceItems = [],
  tenant,
  databaseAdapterLabel,
}: PageEditorClientProps) {
  const { messages: t } = useAdminI18n()
  const e = t.editor
  const { message, announce } = useEditorAnnouncements()
  const {
    selectedBlockId,
    setSelectedBlockId,
    draftBlocks,
    setDraftBlocks,
    isDirty,
    setIsDirty,
    isSaving,
    setIsSaving,
    lastSavedAt,
    setLastSavedAt,
    lastSavedStatus,
    setLastSavedStatus,
    saveError,
    setSaveError,
  } = useEditorState(blocks)

  const [currentPageStatus, setCurrentPageStatus] = useState(page.status)
  const [isTransitioningStatus, setIsTransitioningStatus] = useState(false)
  const [statusTransitionError, setStatusTransitionError] = useState<string | null>(null)
  const [pageSeo, setPageSeo] = useState<SeoMetadata>(page.seo || createDefaultSeoMetadata())
  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(null)
  const [deviceMode, setDeviceMode] = useState<EditorDeviceMode>("desktop")
  const [panelTab, setPanelTab] = useState<EditorPanelTab>("inspector")

  const rightPanelScrollRef = useRef<HTMLDivElement>(null)
  const inspectorAnchorRef = useRef<HTMLDivElement>(null)
  const previewBlockRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const selectedBlock = draftBlocks.find((b) => b.id === selectedBlockId) ?? null

  const pageGovernanceIssues = useMemo(
    () =>
      getPageGovernanceIssues(draftBlocks, {
        pageTitle: page.title,
        pageSlug: page.slug,
        pageId: page.id,
        pageSeo,
        navigationItems: navigationGovernanceItems,
      }),
    [draftBlocks, page.title, page.slug, page.id, pageSeo, navigationGovernanceItems],
  )
  const pageGovernanceSummary = useMemo(
    () => summarizeGovernanceIssues(pageGovernanceIssues),
    [pageGovernanceIssues],
  )

  const orderedBlocks = [...draftBlocks].sort((a, b) => a.sortOrder - b.sortOrder)

  const registerPreviewBlockRef = useCallback((blockId: string, element: HTMLDivElement | null) => {
    if (element) {
      previewBlockRefs.current.set(blockId, element)
    } else {
      previewBlockRefs.current.delete(blockId)
    }
  }, [])

  const scrollInspectorToBlock = useCallback(() => {
    requestAnimationFrame(() => {
      inspectorAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    })
  }, [])

  const scrollPreviewToBlock = useCallback((blockId: string) => {
    requestAnimationFrame(() => {
      previewBlockRefs.current.get(blockId)?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    })
  }, [])

  const selectBlock = useCallback(
    (blockId: string, options?: { tab?: EditorPanelTab; announceType?: string }) => {
      setSelectedBlockId(blockId)
      setPanelTab(options?.tab ?? "inspector")
      const blockType = options?.announceType ?? draftBlocks.find((b) => b.id === blockId)?.type ?? "block"
      const position = getBlockEditorPosition(blockId, orderedBlocks)
      const positionHint = position
        ? ` (${position.displayIndex}/${position.total})`
        : ""
      announce(`${e.blockSelected}: ${blockType}${positionHint}`)
      scrollPreviewToBlock(blockId)
      scrollInspectorToBlock()
    },
    [
      announce,
      draftBlocks,
      e.blockSelected,
      orderedBlocks,
      scrollInspectorToBlock,
      scrollPreviewToBlock,
      setSelectedBlockId,
    ],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return
      }
      if (!selectedBlockId || orderedBlocks.length === 0) return
      const index = orderedBlocks.findIndex((block) => block.id === selectedBlockId)
      if (index < 0) return
      const nextIndex =
        event.key === "ArrowDown"
          ? Math.min(index + 1, orderedBlocks.length - 1)
          : Math.max(index - 1, 0)
      if (nextIndex === index) return
      event.preventDefault()
      selectBlock(orderedBlocks[nextIndex].id)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [orderedBlocks, selectBlock, selectedBlockId])

  useEffect(() => {
    if (selectedBlockId && panelTab === "inspector") {
      scrollInspectorToBlock()
    }
  }, [selectedBlockId, panelTab, scrollInspectorToBlock])

  const updateBlockProps = (blockId: string, newProps: Record<string, unknown>) => {
    setDraftBlocks(
      draftBlocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              props: mergeProps(b.props, newProps),
              updatedAt: new Date().toISOString(),
            }
          : b,
      ),
    )
    setIsDirty(true)
  }

  const updatePageSeo = (patch: Partial<SeoMetadata>) => {
    setPageSeo((prev) => ({
      ...prev,
      ...patch,
    }))
    setIsDirty(true)
  }

  const addBlock = (blockType: string, presetId?: string) => {
    const definition = getAdminBlockDefinition(blockType)

    if (!definition) {
      console.warn(`[editor] Block type not in registry: ${blockType}`)
      return
    }

    let blockProps = definition.defaultProps
    if (presetId && isSupportedPresetBlockType(blockType)) {
      const preset = getPresetForBlockType(blockType, presetId)
      if (preset) {
        blockProps = preset.props as Record<string, unknown>
      }
    }

    const maxSortOrder = draftBlocks.length > 0 ? Math.max(...draftBlocks.map((b) => b.sortOrder)) : 0
    const nextSortOrder = maxSortOrder + 1

    const newBlock: CmsBlock = {
      id: `local-${crypto.getRandomValues(new Uint8Array(16)).reduce((s, b) => s + b.toString(16).padStart(2, "0"), "")}`,
      tenantId: page.tenantId,
      pageId: page.id,
      type: definition.type,
      sortOrder: nextSortOrder,
      props: cloneBlockPropsForNewBlock(definition.type, blockProps),
      visibility: "visible",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const insertionIndex =
      insertAfterBlockId !== null ? draftBlocks.findIndex((block) => block.id === insertAfterBlockId) : -1

    const nextBlocks =
      insertionIndex >= 0
        ? [...draftBlocks.slice(0, insertionIndex + 1), newBlock, ...draftBlocks.slice(insertionIndex + 1)]
        : [...draftBlocks, newBlock]

    setDraftBlocks(normalizeBlockOrder(nextBlocks))
    setInsertAfterBlockId(null)
    setIsDirty(true)
    setSelectedBlockId(newBlock.id)
    setPanelTab("inspector")
    scrollInspectorToBlock()
    announce(`${e.blockAdded}: ${definition.label}`)
  }

  const handleMoveBlockUp = (blockId: string) => {
    setDraftBlocks(moveBlockUp(draftBlocks, blockId))
    selectBlock(blockId)
    setIsDirty(true)
    announce(e.blockMovedUp)
  }

  const handleMoveBlockDown = (blockId: string) => {
    setDraftBlocks(moveBlockDown(draftBlocks, blockId))
    selectBlock(blockId)
    setIsDirty(true)
    announce(e.blockMovedDown)
  }

  const handleDeleteBlock = (blockId: string) => {
    const newBlocks = deleteBlock(draftBlocks, blockId)
    setDraftBlocks(newBlocks)

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }
    if (insertAfterBlockId === blockId) {
      setInsertAfterBlockId(null)
    }

    setIsDirty(true)
    announce(e.blockRemoved)
  }

  const handleTransitionPageStatus = async (action: ContentTransitionAction) => {
    try {
      setIsTransitioningStatus(true)
      setStatusTransitionError(null)

      const result = await clientPageStatusPersistence.transitionPageStatus({
        tenantId: tenant.tenantId,
        pageId: page.id,
        locale: page.locale,
        action,
      })

      if (result.success) {
        setCurrentPageStatus(result.status)
      }
    } catch (error) {
      console.error("[editor] failed to transition page status", error)
      setStatusTransitionError(e.statusTransitionFailed)
    } finally {
      setIsTransitioningStatus(false)
    }
  }

  const handleSave = async () => {
    if (!page || isSaving) return

    try {
      setSaveError(null)
      setIsSaving(true)

      const blocksToSave = normalizeBlockOrder(orderedBlocks)

      const result = await clientEditorPersistence.savePageDraft({
        tenantId: tenant.tenantId,
        pageId: page.id,
        locale: page.locale,
        blocks: blocksToSave,
        pageSeo,
      })

      if (result.success) {
        setIsDirty(false)
        setLastSavedAt(result.savedAt)
        setLastSavedStatus(result.status)
        announce(e.saved)
      }
    } catch (error) {
      console.error("[editor] failed to save draft", error)
      setSaveError(e.saveFailed)
      announce(e.saveFailed)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <EditorLiveRegion message={message} />
      <div className="admin-editor-workspace admin-editor-workspace-v2 admin-editor-workspace-flat">
        <a href="#inspector-panel" className="admin-skip-to-inspector">
          {e.skipToInspector}
        </a>

        <EditorToolbar
          isDirty={isDirty}
          isSaving={isSaving}
          saveError={saveError}
          lastSavedAt={lastSavedAt}
          lastSavedStatus={lastSavedStatus}
          currentPageStatus={currentPageStatus}
          governanceReady={pageGovernanceSummary.readyToPublish}
          onSave={handleSave}
          statusTransitionError={statusTransitionError}
          isTransitioningStatus={isTransitioningStatus}
          transitionActions={getAvailableActionsForStatus(currentPageStatus)}
          onTransitionAction={handleTransitionPageStatus}
          canSave={!isSaving && isDirty}
        />

        <div className="admin-editor-split">
          <EditorLivePreview
            blocks={orderedBlocks}
            deviceMode={deviceMode}
            onDeviceModeChange={setDeviceMode}
            selectedBlockId={selectedBlockId}
            insertAfterBlockId={insertAfterBlockId}
            onSelectBlock={(blockId) => selectBlock(blockId)}
            onMoveUp={handleMoveBlockUp}
            onMoveDown={handleMoveBlockDown}
            onDelete={handleDeleteBlock}
            onInsertAfter={(blockId) => setInsertAfterBlockId(blockId)}
            registerBlockRef={registerPreviewBlockRef}
          />

          <EditorRightPanel
            activeTab={panelTab}
            onTabChange={setPanelTab}
            scrollRef={rightPanelScrollRef}
            inspector={
              <EditorInspector
                selectedBlock={selectedBlock}
                orderedBlocks={orderedBlocks}
                onUpdateProps={updateBlockProps}
                tenantId={tenant.tenantId}
                pageSeo={pageSeo}
                onUpdatePageSeo={updatePageSeo}
                topAnchorRef={inspectorAnchorRef}
              />
            }
            blocks={
              <BlockPaletteBlocksTab
                onAddBlock={(blockType) => addBlock(blockType)}
                insertAfterBlockId={insertAfterBlockId}
                onClearInsertPosition={() => setInsertAfterBlockId(null)}
              />
            }
            presets={
              <BlockPalettePresetsTab
                onAddBlock={(blockType, presetId) => addBlock(blockType, presetId)}
                insertAfterBlockId={insertAfterBlockId}
              />
            }
            governance={
              <div className="space-y-4">
                <PublishGovernancePanel
                  issues={pageGovernanceIssues}
                  selectedBlockId={selectedBlockId}
                  onFocusBlock={(blockId) => selectBlock(blockId, { tab: "inspector" })}
                />
                <dl className="admin-gov-nested-surface space-y-2 rounded-lg px-3 py-2.5 text-xs admin-text-muted">
                  <div className="flex justify-between gap-2">
                    <dt>{e.contextTenant}</dt>
                    <dd className="truncate font-mono admin-text">{tenant.tenantId}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>{e.contextSource}</dt>
                    <dd className="truncate admin-text">{tenant.source}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>{e.contextDbAdapter}</dt>
                    <dd className="truncate font-mono admin-text">{databaseAdapterLabel}</dd>
                  </div>
                </dl>
              </div>
            }
          />
        </div>
      </div>
    </>
  )
}
