"use client"

import { useMemo } from "react"
import type { GovernanceCategory, GovernanceSeverity, PublishGovernanceIssue } from "@sovereign-cms/core"
import { sortGovernanceIssuesForDisplay, summarizeGovernanceIssues } from "@sovereign-cms/core"
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
import { cn } from "@sovereign-cms/ui"
import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react"
import { AdminEmptyState } from "./admin-empty-state"
import { GovernanceCategoryIcon } from "@/lib/governance-category-icons"
import { useAdminI18n } from "@/components/admin-i18n-provider"

export type PublishGovernancePanelProps = {
  issues: PublishGovernanceIssue[]
  onFocusBlock?: (blockId: string) => void
  selectedBlockId?: string | null
  /** Block type for selected block — enables capability context hints only. */
  selectedBlockType?: string | null
  className?: string
  compact?: boolean
}

function governanceNoteClass(severity: GovernanceSeverity): string {
  if (severity === "critical") return "admin-editorial-governance-note--critical"
  if (severity === "warning") return "admin-editorial-governance-note--warning"
  return "admin-editorial-governance-note--info"
}

function IssueRow({
  issue,
  categoryLabel,
  focusBlockLabel,
  onFocusBlock,
}: {
  issue: PublishGovernanceIssue
  categoryLabel: string
  focusBlockLabel: string
  onFocusBlock?: (blockId: string) => void
}) {
  const canJump = issue.scope === "block" && issue.blockId && onFocusBlock

  return (
    <li className={cn("admin-editorial-governance-note", governanceNoteClass(issue.severity))}>
      <GovernanceCategoryIcon category={issue.category} className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-80" />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-xs leading-relaxed admin-text">
          <span className="sr-only">{categoryLabel}: </span>
          {issue.message}
        </p>
        {issue.suggestion ? (
          <p className="text-[11px] leading-snug admin-text-muted">{issue.suggestion}</p>
        ) : null}
        {canJump ? (
          <button
            type="button"
            onClick={() => onFocusBlock(issue.blockId!)}
            className="inline-flex items-center gap-0.5 text-[11px] font-medium admin-accent underline-offset-2 hover:underline"
          >
            {focusBlockLabel}
            <ChevronRight className="h-3 w-3" aria-hidden />
          </button>
        ) : null}
      </div>
    </li>
  )
}

function IssueList({
  items,
  categoryLabels,
  focusBlockLabel,
  onFocusBlock,
}: {
  items: PublishGovernanceIssue[]
  categoryLabels: Record<GovernanceCategory, string>
  focusBlockLabel: string
  onFocusBlock?: (blockId: string) => void
}) {
  if (items.length === 0) return null
  return (
    <ul className="admin-editorial-governance-list" role="list">
      {items.map((issue) => (
        <IssueRow
          key={issue.id}
          issue={issue}
          categoryLabel={categoryLabels[issue.category]}
          focusBlockLabel={focusBlockLabel}
          onFocusBlock={onFocusBlock}
        />
      ))}
    </ul>
  )
}

/** Unified publish-readiness panel — editorial, non-blocking. */
export function PublishGovernancePanel({
  issues,
  onFocusBlock,
  selectedBlockId = null,
  selectedBlockType = null,
  className,
  compact = false,
}: PublishGovernancePanelProps) {
  const { messages: t } = useAdminI18n()
  const g = t.publishGovernance
  const capabilityHintKey =
    selectedBlockType != null ? getBlockCapabilityHintKey(selectedBlockType) : null
  const capabilityContextHint =
    capabilityHintKey != null ? t.editor.orientation.capabilityHints[capabilityHintKey] : null
  const editorSurfaceHintKey =
    selectedBlockType != null
      ? getEditorSurfaceHintKey(selectedBlockType, {
          excludeKeys:
            capabilityHintKey != null
              ? [capabilityHintToEditorSurfaceKey(capabilityHintKey)]
              : undefined,
        })
      : null
  const editorSurfaceContextHint =
    editorSurfaceHintKey != null
      ? t.editor.orientation.editorSurfaceHints[editorSurfaceHintKey]
      : null
  const governanceHintKey =
    selectedBlockType != null
      ? getGovernanceContractHintKey(selectedBlockType, {
          excludeKeys: buildGovernanceHintExclusions({
            capabilityHintKey,
            editorSurfaceHintKey,
          }),
        })
      : null
  const governanceContractContextHint =
    governanceHintKey != null
      ? t.editor.orientation.governanceContractHints[governanceHintKey]
      : null
  const previewIsolationHintKey =
    selectedBlockType != null
      ? getBlockPreviewIsolationHintKey(selectedBlockType, {
          excludeKeys: buildPreviewIsolationHintExclusions({
            capabilityHintKey,
            editorSurfaceHintKey,
            governanceHintKey,
          }),
        })
      : null
  const previewIsolationContextHint =
    previewIsolationHintKey != null
      ? t.editor.orientation.previewIsolationHints[previewIsolationHintKey]
      : null
  const runtimeValidationHintKey =
    selectedBlockType != null
      ? getBlockRuntimeValidationHintKey(selectedBlockType, {
          excludeKeys: buildRuntimeValidationHintExclusions({
            capabilityHintKey,
            editorSurfaceHintKey,
            governanceHintKey,
            previewIsolationHintKey,
          }),
        })
      : null
  const runtimeValidationContextHint =
    runtimeValidationHintKey != null
      ? t.editor.orientation.runtimeValidationHints[runtimeValidationHintKey]
      : null
  const inspectorCompositionHintKey =
    selectedBlockType != null
      ? getBlockInspectorCompositionHintKey(selectedBlockType, {
          excludeKeys: buildInspectorCompositionHintExclusions({
            capabilityHintKey,
            editorSurfaceHintKey,
            governanceHintKey,
            previewIsolationHintKey,
            runtimeValidationHintKey,
          }),
        })
      : null
  const inspectorCompositionContextHint =
    inspectorCompositionHintKey != null
      ? t.editor.orientation.inspectorCompositionHints[inspectorCompositionHintKey]
      : null

  const sortedIssues = useMemo(() => sortGovernanceIssuesForDisplay(issues), [issues])
  const summary = summarizeGovernanceIssues(sortedIssues)

  const categoryLabels: Record<GovernanceCategory, string> = {
    accessibility: g.categories.accessibility,
    media: g.categories.media,
    content: g.categories.content,
    navigation: g.categories.navigation,
    seo: g.categories.seo,
    editorial: g.categories.editorial,
  }

  const selectedBlockIssues =
    selectedBlockId != null
      ? sortedIssues.filter((issue) => issue.scope === "block" && issue.blockId === selectedBlockId)
      : []
  const pageLevelIssues = sortedIssues.filter((issue) => issue.scope !== "block")
  const otherBlockIssues =
    selectedBlockId != null
      ? sortedIssues.filter((issue) => issue.scope === "block" && issue.blockId && issue.blockId !== selectedBlockId)
      : sortedIssues.filter((issue) => issue.scope === "block")

  const countHint =
    !compact && sortedIssues.length > 0
      ? [
          summary.critical > 0 ? g.criticalCount.replace("{count}", String(summary.critical)) : null,
          summary.warnings > 0 ? g.warningCount.replace("{count}", String(summary.warnings)) : null,
          summary.infos > 0 ? g.infoCount.replace("{count}", String(summary.infos)) : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null

  const headerTitle = summary.readyToPublish
    ? sortedIssues.length === 0
      ? g.readyTitle
      : g.readyWithNotesTitle
    : g.reviewTitle

  return (
    <section className={cn("admin-gov-panel space-y-3", className)} aria-label={g.panelAria}>
      <div
        className={cn(
          "rounded-lg border admin-border px-3 py-3",
          summary.readyToPublish
            ? "bg-[color-mix(in_oklab,var(--admin-success)_6%,var(--admin-surface))]"
            : "admin-gov-nested-surface",
        )}
      >
        <div className="flex min-w-0 items-start gap-2.5">
          <span
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              summary.readyToPublish
                ? "bg-[color-mix(in_oklab,var(--admin-success)_14%,transparent)] text-(--admin-success)"
                : "bg-[color-mix(in_oklab,var(--admin-accent)_10%,transparent)] admin-text-muted",
            )}
          >
            {summary.readyToPublish ? (
              <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden />
            ) : (
              <AlertCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
            )}
          </span>
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-semibold tracking-tight admin-text">{headerTitle}</p>
            <p className="text-xs leading-snug admin-text-muted">{g.nonBlockingHint}</p>
            {summary.readyToPublish && sortedIssues.length > 0 ? (
              <p className="text-xs leading-snug admin-text-muted">{g.noCriticalCalm}</p>
            ) : null}
            {countHint ? <p className="text-[11px] tabular-nums admin-text-muted">{countHint}</p> : null}
          </div>
        </div>
      </div>

      {sortedIssues.length === 0 ? (
        <AdminEmptyState title={g.emptyTitle} description={g.emptyDescription} />
      ) : (
        <div className="space-y-4">
          {selectedBlockIssues.length > 0 ? (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] admin-text-muted">
                {g.selectedBlockSection}
              </p>
              <p className="mb-2 text-xs admin-text-muted">
                {g.selectedBlockSummary.replace("{count}", String(selectedBlockIssues.length))}
              </p>
              {capabilityContextHint ? (
                <p className="mb-2 text-[11px] leading-snug admin-text-muted">{capabilityContextHint}</p>
              ) : null}
              {editorSurfaceContextHint ? (
                <p className="mb-2 text-[11px] leading-snug admin-text-muted">{editorSurfaceContextHint}</p>
              ) : null}
              {governanceContractContextHint ? (
                <p className="mb-2 text-[11px] leading-snug admin-text-muted">
                  {governanceContractContextHint}
                </p>
              ) : null}
              {previewIsolationContextHint ? (
                <p className="mb-2 text-[11px] leading-snug admin-text-muted">
                  {previewIsolationContextHint}
                </p>
              ) : null}
              {runtimeValidationContextHint ? (
                <p className="mb-2 text-[11px] leading-snug admin-text-muted">
                  {runtimeValidationContextHint}
                </p>
              ) : null}
              {inspectorCompositionContextHint ? (
                <p className="mb-2 text-[11px] leading-snug admin-text-muted">
                  {inspectorCompositionContextHint}
                </p>
              ) : null}
              <IssueList
                items={selectedBlockIssues}
                categoryLabels={categoryLabels}
                focusBlockLabel={g.focusBlock}
                onFocusBlock={onFocusBlock}
              />
            </div>
          ) : null}
          {pageLevelIssues.length > 0 ? (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] admin-text-muted">
                {g.pageLevelSection}
              </p>
              <IssueList
                items={pageLevelIssues}
                categoryLabels={categoryLabels}
                focusBlockLabel={g.focusBlock}
                onFocusBlock={onFocusBlock}
              />
            </div>
          ) : null}
          {otherBlockIssues.length > 0 ? (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] admin-text-muted">
                {g.otherBlocksSection}
              </p>
              <IssueList
                items={otherBlockIssues}
                categoryLabels={categoryLabels}
                focusBlockLabel={g.focusBlock}
                onFocusBlock={onFocusBlock}
              />
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
