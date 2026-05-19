"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { formatAdminMessage } from "@/lib/admin-i18n"
import {
  capabilityHintToEditorSurfaceKey,
  getEditorSurfaceHintKey,
} from "@/lib/block-editor-surface-hints"
import { getBlockCapabilityHintKey } from "@/lib/block-capability-hints"
import {
  buildGovernanceHintExclusions,
  getGovernanceContractHintKey,
} from "@/lib/block-governance-hints"
import {
  buildPreviewIsolationHintExclusions,
  getBlockPreviewIsolationHintKey,
} from "@/lib/block-preview-isolation-hints"
import {
  buildInspectorCompositionHintExclusions,
  getBlockInspectorCompositionHintKey,
} from "@/lib/block-inspector-composition-hints"
import {
  buildRuntimeValidationHintExclusions,
  getBlockRuntimeValidationHintKey,
} from "@/lib/block-runtime-validation-hints"
import { getBlockEditorExcerpt, getBlockTypeLabel } from "@/lib/editor-block-context"
import { EditorBlockTypeIcon } from "@/lib/editor-block-icons"

type EditorSelectedBlockContextProps = {
  block: CmsBlock
  displayIndex: number
  total: number
  className?: string
  variant?: "header" | "chip"
}

export function EditorSelectedBlockContext({
  block,
  displayIndex,
  total,
  className,
  variant = "header",
}: EditorSelectedBlockContextProps) {
  const { locale, messages } = useAdminI18n()
  const o = messages.editor.orientation
  const capabilityHints = o.capabilityHints
  const editorSurfaceHints = o.editorSurfaceHints
  const governanceContractHints = o.governanceContractHints
  const previewIsolationHints = o.previewIsolationHints
  const runtimeValidationHints = o.runtimeValidationHints
  const inspectorCompositionHints = o.inspectorCompositionHints
  const typeLabel = getBlockTypeLabel(block, locale)
  const excerpt = getBlockEditorExcerpt(block)
  const capabilityHintKey = getBlockCapabilityHintKey(block.type)
  const capabilityHint =
    capabilityHintKey != null ? capabilityHints[capabilityHintKey] : null
  const editorSurfaceHintKey = getEditorSurfaceHintKey(block.type, {
    excludeKeys:
      capabilityHintKey != null
        ? [capabilityHintToEditorSurfaceKey(capabilityHintKey)]
        : undefined,
  })
  const editorSurfaceHint =
    editorSurfaceHintKey != null ? editorSurfaceHints[editorSurfaceHintKey] : null
  const governanceHintKey = getGovernanceContractHintKey(block.type, {
    excludeKeys: buildGovernanceHintExclusions({
      capabilityHintKey,
      editorSurfaceHintKey,
    }),
  })
  const governanceContractHint =
    governanceHintKey != null ? governanceContractHints[governanceHintKey] : null
  const previewIsolationHintKey = getBlockPreviewIsolationHintKey(block.type, {
    excludeKeys: buildPreviewIsolationHintExclusions({
      capabilityHintKey,
      editorSurfaceHintKey,
      governanceHintKey,
    }),
  })
  const previewIsolationHint =
    previewIsolationHintKey != null ? previewIsolationHints[previewIsolationHintKey] : null
  const runtimeValidationHintKey = getBlockRuntimeValidationHintKey(block.type, {
    excludeKeys: buildRuntimeValidationHintExclusions({
      capabilityHintKey,
      editorSurfaceHintKey,
      governanceHintKey,
      previewIsolationHintKey,
    }),
  })
  const runtimeValidationHint =
    runtimeValidationHintKey != null
      ? runtimeValidationHints[runtimeValidationHintKey]
      : null
  const inspectorCompositionHintKey = getBlockInspectorCompositionHintKey(block.type, {
    excludeKeys: buildInspectorCompositionHintExclusions({
      capabilityHintKey,
      editorSurfaceHintKey,
      governanceHintKey,
      previewIsolationHintKey,
      runtimeValidationHintKey,
    }),
  })
  const inspectorCompositionHint =
    inspectorCompositionHintKey != null
      ? inspectorCompositionHints[inspectorCompositionHintKey]
      : null
  const positionLabel = formatAdminMessage(o.blockPosition, {
    current: String(displayIndex),
    total: String(total),
  })

  const isChip = variant === "chip"

  return (
    <header
      className={cn(
        "admin-editor-selected-context",
        isChip ? "admin-editor-selected-context--chip" : "admin-editor-selected-context--header",
        className,
      )}
      aria-label={o.contextHeaderAria}
    >
      <span className="admin-editor-selected-context-accent" aria-hidden />
      <span className="admin-editor-selected-context-icon" aria-hidden>
        <EditorBlockTypeIcon blockType={block.type} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-xs font-semibold tracking-tight admin-text">{typeLabel}</span>
          <span className="text-[10px] font-medium tabular-nums admin-text-muted">{positionLabel}</span>
        </span>
        {excerpt ? (
          <p className={cn("mt-0.5 truncate admin-text-muted", isChip ? "text-[10px]" : "text-xs")}>
            {excerpt}
          </p>
        ) : (
          <p className={cn("mt-0.5 admin-text-muted", isChip ? "text-[10px]" : "text-xs")}>
            {o.noExcerpt}
          </p>
        )}
        {capabilityHint ? (
          <p
            className={cn(
              "mt-1 leading-snug text-[color-mix(in_oklab,var(--admin-accent)_70%,var(--admin-text-muted))]",
              isChip ? "text-[10px]" : "text-[11px]",
            )}
          >
            {capabilityHint}
          </p>
        ) : null}
        {editorSurfaceHint ? (
          <p
            className={cn(
              "mt-0.5 leading-snug admin-text-muted",
              isChip ? "text-[10px]" : "text-[11px]",
            )}
          >
            {editorSurfaceHint}
          </p>
        ) : null}
        {governanceContractHint ? (
          <p
            className={cn(
              "mt-0.5 leading-snug admin-text-muted",
              isChip ? "text-[10px]" : "text-[11px]",
            )}
          >
            {governanceContractHint}
          </p>
        ) : null}
        {previewIsolationHint ? (
          <p
            className={cn(
              "mt-0.5 leading-snug text-[color-mix(in_oklab,var(--admin-accent)_55%,var(--admin-text-muted))]",
              isChip ? "text-[10px]" : "text-[11px]",
            )}
          >
            {previewIsolationHint}
          </p>
        ) : null}
        {runtimeValidationHint ? (
          <p
            className={cn(
              "mt-0.5 leading-snug text-[color-mix(in_oklab,var(--admin-warning)_65%,var(--admin-text-muted))]",
              isChip ? "text-[10px]" : "text-[11px]",
            )}
          >
            {runtimeValidationHint}
          </p>
        ) : null}
        {inspectorCompositionHint ? (
          <p
            className={cn(
              "mt-0.5 leading-snug admin-text-muted",
              isChip ? "text-[10px]" : "text-[11px]",
            )}
          >
            {inspectorCompositionHint}
          </p>
        ) : null}
      </span>
    </header>
  )
}
