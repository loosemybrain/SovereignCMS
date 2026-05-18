"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import { renderAdminBlock } from "@/components/admin-block-renderer-registry"
import { AdminEmptyState } from "@/components/admin-ui"
import { EditorBlockCard } from "@/components/editor/editor-block-card"
import {
  EditorDevicePreviewBar,
  editorPreviewFrameClass,
  type EditorDeviceMode,
} from "@/components/editor/editor-device-preview-bar"
import { useAdminI18n } from "@/components/admin-i18n-provider"

type EditorLivePreviewProps = {
  blocks: CmsBlock[]
  deviceMode: EditorDeviceMode
  onDeviceModeChange: (mode: EditorDeviceMode) => void
  selectedBlockId: string | null
  insertAfterBlockId: string | null
  onSelectBlock: (blockId: string) => void
  onMoveUp: (blockId: string) => void
  onMoveDown: (blockId: string) => void
  onDelete: (blockId: string) => void
  onInsertAfter: (blockId: string) => void
  registerBlockRef?: (blockId: string, element: HTMLDivElement | null) => void
}

export function EditorLivePreview({
  blocks,
  deviceMode,
  onDeviceModeChange,
  selectedBlockId,
  insertAfterBlockId,
  onSelectBlock,
  onMoveUp,
  onMoveDown,
  onDelete,
  onInsertAfter,
  registerBlockRef,
}: EditorLivePreviewProps) {
  const e = useAdminI18n().messages.editor

  return (
    <section className="admin-editor-preview-column" aria-label={e.regionBlocks}>
      <div className="admin-editor-preview-stage">
        <EditorDevicePreviewBar mode={deviceMode} onModeChange={onDeviceModeChange} />
        <div className="admin-editor-preview-scroll">
          <div className={editorPreviewFrameClass(deviceMode)}>
            <div className="admin-editor-preview-canvas">
              {blocks.length === 0 ? (
                <AdminEmptyState title={e.emptyBlocksTitle} description={e.emptyBlocksDescription} />
              ) : (
                <div className="admin-editor-preview-blocks" role="list">
                  {blocks.map((block, index) => {
                    const isFirst = index === 0
                    const isLast = index === blocks.length - 1
                    return (
                      <EditorBlockCard
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        isInsertAfterTarget={insertAfterBlockId === block.id}
                        isFirst={isFirst}
                        isLast={isLast}
                        variant="preview"
                        registerBlockRef={registerBlockRef}
                        onSelect={() => onSelectBlock(block.id)}
                        onMoveUp={() => !isFirst && onMoveUp(block.id)}
                        onMoveDown={() => !isLast && onMoveDown(block.id)}
                        onDelete={() => onDelete(block.id)}
                        onInsertAfter={() => onInsertAfter(block.id)}
                      >
                        {renderAdminBlock(block)}
                      </EditorBlockCard>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
