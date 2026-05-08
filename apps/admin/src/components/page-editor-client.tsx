"use client"

import { useState } from "react"
import type { CmsBlock, CmsPage, ContentTransitionAction } from "@sovereign-cms/core"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import type { AdminTenantContext } from "@sovereign-cms/tenancy"
import { EditorInspector } from "@/components/editor-inspector"
import { renderAdminBlock } from "@/components/admin-block-renderer-registry"
import { AdminButton, AdminCard } from "@/components/admin-ui"
import { clientEditorPersistence } from "@/lib/client-editor-persistence"
import { clientPageStatusPersistence } from "@/lib/client-page-status-persistence"
import { mergeProps } from "@/lib/merge-props"
import { useEditorState } from "@/lib/editor-state"
import { BlockPalette } from "@/components/block-palette"
import { getAdminBlockDefinition } from "@/block-definitions/registry"
import { moveBlockUp, moveBlockDown, cloneDefaultProps, normalizeBlockOrder, deleteBlock } from "@/lib/reorder-blocks"
import { getAvailableActionsForStatus, getTransitionActionLabel } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"

type PageEditorClientProps = {
  page: CmsPage
  blocks: CmsBlock[]
  tenant: AdminTenantContext
  runtimeConfig: RuntimeConfig
}

export function PageEditorClient({ page, blocks, tenant, runtimeConfig }: PageEditorClientProps) {
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

  const addBlock = (blockType: string) => {
    const definition = getAdminBlockDefinition(blockType)

    if (!definition) {
      console.warn(`[editor] Block type not in registry: ${blockType}`)
      return
    }

    // Calculate next sort order based on max existing
    const maxSortOrder = draftBlocks.length > 0 ? Math.max(...draftBlocks.map((b) => b.sortOrder)) : 0
    const nextSortOrder = maxSortOrder + 1

    // Create new block with definition defaults (cloned safely)
    const newBlock: CmsBlock = {
      id: `local-${crypto.getRandomValues(new Uint8Array(16)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')}`,
      tenantId: page.tenantId,
      pageId: page.id,
      type: definition.type,
      sortOrder: nextSortOrder,
      props: cloneDefaultProps(definition.defaultProps),
      visibility: "visible",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to draft blocks
    setDraftBlocks([...draftBlocks, newBlock])

    // Select new block for immediate editing
    setSelectedBlockId(newBlock.id)

    // Mark as dirty
    setIsDirty(true)
  }

  const handleMoveBlockUp = (blockId: string) => {
    setDraftBlocks(moveBlockUp(draftBlocks, blockId))
    setSelectedBlockId(blockId)
    setIsDirty(true)
  }

  const handleMoveBlockDown = (blockId: string) => {
    setDraftBlocks(moveBlockDown(draftBlocks, blockId))
    setSelectedBlockId(blockId)
    setIsDirty(true)
  }

  const handleDeleteBlock = (blockId: string) => {
    const newBlocks = deleteBlock(draftBlocks, blockId)
    setDraftBlocks(newBlocks)

    // Clear selection if deleted block was selected
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }

    setIsDirty(true)
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
      })

      if (result.success) {
        setIsDirty(false)
        setLastSavedAt(result.savedAt)
        setLastSavedStatus(result.status)
      }
    } catch (error) {
      console.error("[editor] failed to save draft", error)
      setSaveError("Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Blocks / Preview Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Save Controls */}
        <AdminCard className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm space-y-1">
              {isSaving && <p className="text-blue-400 font-medium">Saving...</p>}
              {saveError && <p className="text-red-400 font-medium">{saveError}</p>}
              {isDirty && !isSaving && <p className="text-amber-400 font-medium">Unsaved changes</p>}
              {lastSavedAt && !isDirty && (
                <div className="space-y-1">
                  <p className="text-emerald-400 text-xs">
                    Last saved: {new Date(lastSavedAt).toLocaleTimeString()}
                  </p>
                  {lastSavedStatus && (
                    <p className="admin-text-muted text-xs">
                      Status: <span className="capitalize font-medium">{lastSavedStatus}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
            <AdminButton
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              variant="primary"
              className={cn(isSaving || !isDirty ? "admin-text-muted" : "")}
            >
              {isSaving ? "Saving..." : "Save"}
            </AdminButton>
          </div>

          {/* Page Status Transitions */}
          {statusTransitionError && (
            <p className="text-red-400 text-xs">{statusTransitionError}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {getAvailableActionsForStatus(currentPageStatus).map((action) => (
              <button
                key={action}
                onClick={() => handleTransitionPageStatus(action)}
                disabled={isTransitioningStatus}
                className={cn(
                  "rounded px-3 py-1 text-xs font-medium transition-all duration-200",
                  isTransitioningStatus
                    ? "cursor-not-allowed admin-surface-muted admin-text-muted"
                    : action === "publish"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                      : action === "archive"
                        ? "bg-orange-600 text-white hover:bg-orange-700 active:scale-95"
                        : "bg-amber-600 text-white hover:bg-amber-700 active:scale-95",
                )}
              >
                {isTransitioningStatus ? "..." : getTransitionActionLabel(action)}
              </button>
            ))}
          </div>
        </AdminCard>

        {/* Block Palette */}
        <BlockPalette onAddBlock={addBlock} />

        {/* Blocks List */}
        <AdminCard className="p-0 overflow-hidden">
          <div className="border-b admin-border px-6 py-4 admin-surface-muted">
            <h2 className="text-lg font-semibold admin-text">
              Blocks <span className="admin-text-muted text-sm font-normal">({orderedBlocks.length})</span>
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {orderedBlocks.length === 0 ? (
              <p className="text-sm admin-text-muted py-8 text-center">No blocks for this page</p>
            ) : (
              <div className="space-y-2">
                {orderedBlocks.map((block, index) => {
                  const isFirst = index === 0
                  const isLast = index === orderedBlocks.length - 1

                  return (
                    <div
                      key={block.id}
                      onClick={(event) => {
                        event.stopPropagation()
                        setSelectedBlockId(block.id)
                      }}
                      className={cn(
                        "cursor-pointer rounded-lg border p-4 transition-all duration-200",
                        selectedBlockId === block.id
                          ? "border-blue-600 bg-blue-950/20 ring-1 ring-blue-600/30"
                          : "admin-border hover:bg-zinc-900/40",
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-mono text-xs admin-text-muted">Position: {block.sortOrder}</p>
                            <p className="text-sm font-medium admin-text capitalize">{block.type}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!isFirst) handleMoveBlockUp(block.id)
                              }}
                              disabled={isFirst}
                              className={cn(
                                "p-1.5 rounded text-xs transition-colors",
                                isFirst
                                  ? "cursor-not-allowed admin-text-muted admin-surface"
                                  : "admin-text-muted hover:bg-zinc-800",
                              )}
                              title="Move up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!isLast) handleMoveBlockDown(block.id)
                              }}
                              disabled={isLast}
                              className={cn(
                                "p-1.5 rounded text-xs transition-colors",
                                isLast
                                  ? "cursor-not-allowed admin-text-muted admin-surface"
                                  : "admin-text-muted hover:bg-zinc-800",
                              )}
                              title="Move down"
                            >
                              ↓
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteBlock(block.id)
                              }}
                              className="p-1.5 rounded text-xs transition-colors text-red-400 hover:text-red-300 hover:bg-red-950/30"
                              title="Delete block"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded admin-surface-muted admin-text-muted w-fit">
                          {block.visibility}
                        </div>
                        <div className="pt-2 border-t admin-border mt-2">{renderAdminBlock(block)}</div>
                        <p className="text-xs admin-text-muted font-mono pt-1">{block.id}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      {/* Sticky Inspector */}
      <div className="lg:col-span-1">
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
