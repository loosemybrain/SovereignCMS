"use client"

import { useState } from "react"
import type { CmsBlock, CmsPage, ContentTransitionAction, SeoMetadata } from "@sovereign-cms/core"
import {
  cloneBlockPropsForNewBlock,
  createDefaultSeoMetadata,
  getAvailableActionsForStatus,
  getPresetForBlockType,
  isSupportedPresetBlockType,
} from "@sovereign-cms/core"
import type { AdminTenantContext } from "@sovereign-cms/tenancy"
import { EditorInspector } from "@/components/editor-inspector"
import { renderAdminBlock } from "@/components/admin-block-renderer-registry"
import { AdminEmptyState, AdminButton, AdminSectionCard } from "@/components/admin-ui"
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
import { getEditorTransitionActionLabel } from "@/lib/editor-action-labels"

type PageEditorClientProps = {
  page: CmsPage
  blocks: CmsBlock[]
  tenant: AdminTenantContext
  /** DB adapter id for read-only context (string from server — not full RuntimeConfig). */
  databaseAdapterLabel: string
}

export function PageEditorClient({ page, blocks, tenant, databaseAdapterLabel }: PageEditorClientProps) {
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
    announce(`Block hinzugefügt: ${definition.label}`)
    announce(`Block ausgewählt: ${newBlock.type}`)

    // Mark as dirty
    setIsDirty(true)
  }

  const handleMoveBlockUp = (blockId: string) => {
    setDraftBlocks(moveBlockUp(draftBlocks, blockId))
    setSelectedBlockId(blockId)
    setIsDirty(true)
    announce("Block nach oben verschoben")
  }

  const handleMoveBlockDown = (blockId: string) => {
    setDraftBlocks(moveBlockDown(draftBlocks, blockId))
    setSelectedBlockId(blockId)
    setIsDirty(true)
    announce("Block nach unten verschoben")
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
    announce("Block entfernt")
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
      setStatusTransitionError("Statuswechsel ist fehlgeschlagen")
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
        announce("Änderungen gespeichert")
      }
    } catch (error) {
      console.error("[editor] failed to save draft", error)
      setSaveError("Speichern fehlgeschlagen")
      announce("Speichern fehlgeschlagen")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <EditorLiveRegion message={message} />
      <div className="admin-editor-workspace">
        <a href="#inspector-panel" className="admin-skip-to-inspector">
          Zum Inspector springen
        </a>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8">
          <div className="space-y-6 lg:col-span-2" role="region" aria-label="Seiteninhalt und Blöcke">
            <EditorToolbar
              isDirty={isDirty}
              isSaving={isSaving}
              saveError={saveError}
              lastSavedAt={lastSavedAt}
              lastSavedStatus={lastSavedStatus}
              currentPageStatus={currentPageStatus}
              onSave={handleSave}
              canSave={!isSaving && isDirty}
              footer={
                <>
                  {statusTransitionError ? (
                    <EditorHint tone="danger">Status: {statusTransitionError}</EditorHint>
                  ) : null}
                  <div
                    className={cn(
                      "admin-editor-workflow-foot",
                      statusTransitionError ? "mt-3" : "",
                    )}
                  >
                    <div className="admin-editor-workflow-intro">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] admin-text-muted">
                        Veröffentlichung
                      </p>
                      <p className="mt-1 text-xs leading-snug admin-text-muted">
                        Nächster sichtbarer Schritt für die Seite — nur wenn der aktuelle Status es zulässt.
                      </p>
                    </div>
                    <div className="admin-editor-workflow-actions">
                      {getAvailableActionsForStatus(currentPageStatus).map((action) => (
                        <AdminButton
                          key={action}
                          type="button"
                          variant={
                            action === "publish"
                              ? "primary"
                              : action === "archive"
                                ? "destructive"
                                : "secondary"
                          }
                          size="sm"
                          onClick={() => handleTransitionPageStatus(action)}
                          disabled={isTransitioningStatus}
                          className="min-w-26"
                          aria-label={getEditorTransitionActionLabel(action)}
                        >
                          {isTransitioningStatus ? "…" : getEditorTransitionActionLabel(action)}
                        </AdminButton>
                      ))}
                    </div>
                  </div>
                </>
              }
            />

            <BlockPalette
              onAddBlock={addBlock}
              insertAfterBlockId={insertAfterBlockId}
              onClearInsertPosition={() => setInsertAfterBlockId(null)}
            />

            <EditorSection title={`Blöcke (${orderedBlocks.length})`}>
              <div className="admin-editor-canvas p-4 sm:p-5">
                {orderedBlocks.length === 0 ? (
                  <AdminEmptyState
                    title="Noch keine Blöcke"
                    description="Fügen Sie den ersten Block über die Palette unten ein."
                  />
                ) : (
                  <div className="space-y-3" role="list">
                    {orderedBlocks.map((block, index) => {
                      const isFirst = index === 0
                      const isLast = index === orderedBlocks.length - 1

                      return (
                        <EditorBlockCard
                          key={block.id}
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          isInsertAfterTarget={insertAfterBlockId === block.id}
                          isFirst={isFirst}
                          isLast={isLast}
                          onSelect={() => {
                            setSelectedBlockId(block.id)
                            announce(`Block ausgewählt: ${block.type}`)
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
              </div>
            </EditorSection>
          </div>

          <div id="inspector-panel" className="lg:col-span-1" role="region" aria-label="Inspector">
            <div className="admin-inspector-sticky-col space-y-4 lg:sticky lg:top-6">
              <div className="admin-inspector-shell">
                <div className="admin-section-card-head admin-section-card-glass-head border-b admin-border px-5 py-4">
                  <h2 className="text-base font-semibold tracking-tight admin-text">Inspector</h2>
                  <p className="mt-0.5 text-xs admin-text-muted">Block-Eigenschaften und Seiten-SEO</p>
                </div>
                <div className="admin-inspector-scroll max-h-[min(68vh,46rem)] overflow-y-auto overscroll-y-contain p-4 lg:max-h-[min(72vh,52rem)]">
                  <EditorInspector
                    selectedBlock={selectedBlock}
                    onUpdateProps={updateBlockProps}
                    tenantId={tenant.tenantId}
                    pageSeo={pageSeo}
                    onUpdatePageSeo={updatePageSeo}
                  />
                </div>
              </div>

              <AdminSectionCard
                dense
                variant="default"
                title="Kontext"
                description="Nur-Lese-Hinweise zu dieser Editor-Sitzung."
              >
                <dl className="space-y-2 text-xs admin-text-muted">
                  <div className="flex justify-between gap-2">
                    <dt>Tenant</dt>
                    <dd className="truncate font-mono admin-text">{tenant.tenantId}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Quelle</dt>
                    <dd className="truncate admin-text">{tenant.source}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>DB adapter</dt>
                    <dd className="truncate font-mono admin-text">{databaseAdapterLabel}</dd>
                  </div>
                </dl>
              </AdminSectionCard>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
