"use client"

import { useState } from "react"
import type { CmsBlock, CmsPage, ContentTransitionAction, SeoMetadata } from "@sovereign-cms/core"
import {
  cloneBlockPropsForNewBlock,
  createDefaultSeoMetadata,
  getAvailableActionsForStatus,
  getPresetForBlockType,
  getTransitionActionLabel,
  isSupportedPresetBlockType,
} from "@sovereign-cms/core"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import type { AdminTenantContext } from "@sovereign-cms/tenancy"
import { EditorInspector } from "@/components/editor-inspector"
import { renderAdminBlock } from "@/components/admin-block-renderer-registry"
import { AdminCard, AdminEmptyState } from "@/components/admin-ui"
import { clientEditorPersistence } from "@/lib/client-editor-persistence"
import { clientPageStatusPersistence } from "@/lib/client-page-status-persistence"
import { mergeProps } from "@/lib/merge-props"
import { useEditorState } from "@/lib/editor-state"
import { BlockPalette } from "@/components/editor/block-palette"
import { getAdminBlockDefinition } from "@/block-definitions/registry"
import { moveBlockUp, moveBlockDown, normalizeBlockOrder, deleteBlock } from "@/lib/reorder-blocks"
import { cn } from "@sovereign-cms/ui"
import { useEditorAnnouncements } from "@/lib/use-editor-announcements"
import { EditorLiveRegion } from "@/components/editor-live-region"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { EditorBlockCard } from "@/components/editor/editor-block-card"
import { EditorHint, EditorSection } from "@/components/editor/patterns"

type PageEditorClientProps = {
  page: CmsPage
  blocks: CmsBlock[]
  tenant: AdminTenantContext
  runtimeConfig: RuntimeConfig
}

export function PageEditorClient({ page, blocks, tenant, runtimeConfig }: PageEditorClientProps) {
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

  // Page status transition state
  const [currentPageStatus, setCurrentPageStatus] = useState(page.status)
  const [isTransitioningStatus, setIsTransitioningStatus] = useState(false)
  const [statusTransitionError, setStatusTransitionError] = useState<string | null>(null)

  // Page SEO metadata state (separate from block state)
  const [pageSeo, setPageSeo] = useState<SeoMetadata>(page.seo || createDefaultSeoMetadata())
  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(null)

  const selectedBlock = draftBlocks.find((b) => b.id === selectedBlockId) ?? null

  // Maintain sorted order for rendering
  const orderedBlocks = [...draftBlocks].sort((a, b) => a.sortOrder - b.sortOrder)

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

    // Determine props: use preset if provided, otherwise use definition defaults
    let blockProps = definition.defaultProps
    if (presetId && isSupportedPresetBlockType(blockType)) {
      const preset = getPresetForBlockType(blockType, presetId)
      if (preset) {
        blockProps = preset.props as Record<string, unknown>
      }
    }

    // Calculate next sort order based on max existing
    const maxSortOrder = draftBlocks.length > 0 ? Math.max(...draftBlocks.map((b) => b.sortOrder)) : 0
    const nextSortOrder = maxSortOrder + 1

    // Create new block with definition defaults or preset props (cloned safely)
    const newBlock: CmsBlock = {
      id: `local-${crypto.getRandomValues(new Uint8Array(16)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')}`,
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
        ? [
            ...draftBlocks.slice(0, insertionIndex + 1),
            newBlock,
            ...draftBlocks.slice(insertionIndex + 1),
          ]
        : [...draftBlocks, newBlock]

    setDraftBlocks(normalizeBlockOrder(nextBlocks))

    // Select new block for immediate editing
    setSelectedBlockId(newBlock.id)
    setInsertAfterBlockId(null)
    announce(`Block added: ${definition.label}`)
    announce(`Block selected: ${newBlock.type}`)

    // Mark as dirty
    setIsDirty(true)
  }

  const handleMoveBlockUp = (blockId: string) => {
    setDraftBlocks(moveBlockUp(draftBlocks, blockId))
    setSelectedBlockId(blockId)
    setIsDirty(true)
    announce("Block moved up")
  }

  const handleMoveBlockDown = (blockId: string) => {
    setDraftBlocks(moveBlockDown(draftBlocks, blockId))
    setSelectedBlockId(blockId)
    setIsDirty(true)
    announce("Block moved down")
  }

  const handleDeleteBlock = (blockId: string) => {
    const newBlocks = deleteBlock(draftBlocks, blockId)
    setDraftBlocks(newBlocks)

    // Clear selection if deleted block was selected
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }
    if (insertAfterBlockId === blockId) {
      setInsertAfterBlockId(null)
    }

    setIsDirty(true)
    announce("Block deleted")
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
      setStatusTransitionError("Status transition failed")
    } finally {
      setIsTransitioningStatus(false)
    }
  }

  const handleSave = async () => {
    if (!page || isSaving) return

    try {
      setSaveError(null)
      setIsSaving(true)

      // Send ordered blocks to save with normalized sortOrder
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
        announce("Changes saved")
      }
    } catch (error) {
      console.error("[editor] failed to save draft", error)
      setSaveError("Save failed")
      announce("Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <EditorLiveRegion message={message} />
      {/* Blocks / Preview Area */}
      <div className="lg:col-span-2 space-y-6" role="region" aria-label="Page blocks preview">
        <EditorToolbar
          isDirty={isDirty}
          isSaving={isSaving}
          saveError={saveError}
          lastSavedAt={lastSavedAt}
          lastSavedStatus={lastSavedStatus}
          currentPageStatus={currentPageStatus}
          onSave={handleSave}
          canSave={!isSaving && isDirty}
        />

        <EditorSection title="Page Status Actions">
          <AdminCard className="p-4 space-y-3">
            {statusTransitionError ? (
              <EditorHint tone="danger">Status transition error: {statusTransitionError}</EditorHint>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {getAvailableActionsForStatus(currentPageStatus).map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleTransitionPageStatus(action)}
                  disabled={isTransitioningStatus}
                  className={cn(
                    "rounded px-3 py-1 text-xs font-medium transition-all duration-200 admin-focus-ring",
                    isTransitioningStatus
                      ? "cursor-not-allowed admin-surface-muted admin-text-muted"
                      : action === "publish"
                        ? "bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95"
                        : action === "archive"
                          ? "bg-orange-700 text-white hover:bg-orange-800 active:scale-95"
                          : "bg-amber-700 text-white hover:bg-amber-800 active:scale-95",
                  )}
                >
                  {isTransitioningStatus ? "..." : getTransitionActionLabel(action)}
                </button>
              ))}
            </div>
          </AdminCard>
        </EditorSection>

        {/* Block Palette */}
        <BlockPalette
          onAddBlock={addBlock}
          insertAfterBlockId={insertAfterBlockId}
          onClearInsertPosition={() => setInsertAfterBlockId(null)}
        />

        <EditorSection title={`Blocks (${orderedBlocks.length})`}>
          <AdminCard className="p-4 space-y-2">
            {orderedBlocks.length === 0 ? (
              <AdminEmptyState
                title="No blocks yet"
                description="Add your first block from the block palette."
              />
            ) : (
              <div className="space-y-2" role="list">
                {orderedBlocks.map((block, index) => {
                  const isFirst = index === 0
                  const isLast = index === orderedBlocks.length - 1

                  return (
                    <EditorBlockCard
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      isFirst={isFirst}
                      isLast={isLast}
                      onSelect={() => {
                        setSelectedBlockId(block.id)
                        announce(`Block selected: ${block.type}`)
                      }}
                      onMoveUp={() => !isFirst && handleMoveBlockUp(block.id)}
                      onMoveDown={() => !isLast && handleMoveBlockDown(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                      onInsertAfter={() => setInsertAfterBlockId(block.id)}
                    >
                      {renderAdminBlock(block)}
                    </EditorBlockCard>
                  )
                })}
              </div>
            )}
          </AdminCard>
        </EditorSection>
      </div>

      {/* Sticky Inspector */}
      <div className="lg:col-span-1" role="region" aria-label="Inspector">
        <div className="sticky top-8 space-y-4">
          {/* Inspector */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="border-b admin-border px-6 py-4 admin-surface-muted">
              <h2 className="text-lg font-semibold admin-text">Inspector</h2>
            </div>
            <div className="p-4">
              <EditorInspector
                selectedBlock={selectedBlock}
                onUpdateProps={updateBlockProps}
                tenantId={tenant.tenantId}
                pageSeo={pageSeo}
                onUpdatePageSeo={updatePageSeo}
              />
            </div>
          </AdminCard>

          {/* Info Card */}
          <AdminCard className="p-4 text-xs space-y-2">
            <p className="font-medium admin-text">Meta</p>
            <div className="space-y-1 admin-text-muted">
              <p><span className="admin-text-muted">Tenant:</span> {tenant.tenantId}</p>
              <p><span className="admin-text-muted">Source:</span> {tenant.source}</p>
              <p><span className="admin-text-muted">DB:</span> {runtimeConfig.databaseAdapter}</p>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  )
}
