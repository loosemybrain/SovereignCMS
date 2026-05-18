"use client"

import { useState, type RefObject } from "react"
import type { CmsBlock } from "@sovereign-cms/core"
import { InspectorFieldRenderer } from "./inspector/inspector-field-renderer"
import { SeoEditorSection } from "@/components/seo-editor-section"
import type { SeoMetadata } from "@sovereign-cms/core"
import { getAdminBlockDefinition } from "@/block-definitions/registry"
import { validateFieldValue } from "@/lib/field-validation"
import { getBlockGovernanceIssues } from "@/lib/content-governance"
import { GovernanceCategoryIcon } from "@/lib/governance-category-icons"
import type { GovernanceSeverity } from "@sovereign-cms/core"
import { EditorValidationSummary, InspectorSection } from "@/components/editor/patterns"
import { AdminEmptyState, AdminSectionCard } from "@/components/admin-ui"
import { EditorSelectedBlockContext } from "@/components/editor/editor-selected-block-context"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { getBlockEditorPosition } from "@/lib/editor-block-context"
import {
  getInspectorSectionLabels,
  INSPECTOR_SECTION_ORDER,
  bucketInspectorFieldsBySection,
} from "@/components/inspector/inspector-sections"
import { cn } from "@sovereign-cms/ui"

type EditorInspectorProps = {
  selectedBlock: CmsBlock | null
  orderedBlocks: CmsBlock[]
  onUpdateProps?: (blockId: string, newProps: Record<string, unknown>) => void
  tenantId?: string
  pageSeo?: SeoMetadata | null
  onUpdatePageSeo?: (patch: Partial<SeoMetadata>) => void
  topAnchorRef?: RefObject<HTMLDivElement | null>
}

function buildFieldPatch(fieldKey: string, value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return { [fieldKey]: value }
}

function governanceNoteClass(severity: GovernanceSeverity): string {
  if (severity === "critical") return "admin-editorial-governance-note--critical"
  if (severity === "warning") return "admin-editorial-governance-note--warning"
  return "admin-editorial-governance-note--info"
}

function toSafeDomId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, "-")
}

function PropsEditing({
  block,
  onUpdate,
  tenantId,
}: {
  block: CmsBlock
  onUpdate: (newProps: Record<string, unknown>) => void
  tenantId?: string
}) {
  const { locale, messages: t } = useAdminI18n()
  const ins = t.inspector
  const sectionLabels = getInspectorSectionLabels(locale)
  const props =
    block && typeof block.props === "object" && block.props !== null
      ? (block.props as Record<string, unknown>)
      : {}

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const definition = getAdminBlockDefinition(block.type)
  const fields = definition?.inspectorFields ?? []

  if (fields.length === 0) {
    return (
      <p className="text-xs leading-relaxed admin-text-muted">
        {ins.noFieldsForType} „{block.type}“.
      </p>
    )
  }

  const sectionBuckets = bucketInspectorFieldsBySection(fields)

  const getFieldError = (fieldKey: string, value: unknown, fieldValidations: (typeof fields)[number]["validations"]) => {
    if (!touchedFields[fieldKey]) return null
    const result = validateFieldValue(value, fieldValidations)
    return result.valid ? null : (result.errors[0] ?? "Invalid value.")
  }

  const renderField = (field: (typeof fields)[number]) => {
    const error = getFieldError(field.key, props[field.key], field.validations)
    const fieldId = `block-${toSafeDomId(block.id)}-field-${toSafeDomId(field.key)}`
    return (
      <div key={field.key} className="admin-inspector-field">
        <InspectorFieldRenderer
          id={fieldId}
          field={field}
          value={props[field.key]}
          tenantId={tenantId}
          invalid={Boolean(error)}
          error={error}
          onChange={(value) => {
            setTouchedFields((prev) => ({ ...prev, [field.key]: true }))
            onUpdate(buildFieldPatch(field.key, value))
          }}
        />
      </div>
    )
  }

  const validationSummary = fields
    .map((field) => {
      const result = validateFieldValue(props[field.key], field.validations)
      if (result.valid) return null
      return {
        fieldLabel: field.label,
        fieldId: `block-${toSafeDomId(block.id)}-field-${toSafeDomId(field.key)}`,
        messages: result.errors,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const governanceIssues = getBlockGovernanceIssues(block)
  const nonEmptySectionKeys = INSPECTOR_SECTION_ORDER.filter((sectionKey) => sectionBuckets[sectionKey].length > 0)

  return (
    <div className="admin-inspector-props space-y-4">
      <EditorValidationSummary errors={validationSummary} />

      {nonEmptySectionKeys.map((sectionKey) => {
        const sectionFields = sectionBuckets[sectionKey]
        return (
          <AdminSectionCard
            key={sectionKey}
            title={sectionLabels[sectionKey]}
            dense
            variant="default"
            className="admin-inspector-props-section"
          >
            <div className="admin-inspector-field-stack">{sectionFields.map(renderField)}</div>
          </AdminSectionCard>
        )
      })}

      {governanceIssues.length > 0 ? (
        <AdminSectionCard
          title={ins.governanceTitle}
          description={ins.governanceDescription}
          variant="default"
          dense
          className="admin-inspector-props-section admin-inspector-governance-section"
        >
          <ul className="admin-editorial-governance-list" role="list">
            {governanceIssues.map((issue) => (
              <li
                key={issue.id}
                className={cn("admin-editorial-governance-note", governanceNoteClass(issue.severity))}
              >
                <GovernanceCategoryIcon category={issue.category} className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-80" />
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs leading-relaxed admin-text">{issue.message}</p>
                  {issue.suggestion ? (
                    <p className="text-[11px] leading-snug admin-text-muted">{issue.suggestion}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </AdminSectionCard>
      ) : null}
    </div>
  )
}

export function EditorInspector({
  selectedBlock,
  orderedBlocks,
  onUpdateProps,
  tenantId,
  pageSeo,
  onUpdatePageSeo,
  topAnchorRef,
}: EditorInspectorProps) {
  const { messages: t } = useAdminI18n()
  const ins = t.inspector
  const o = t.editor.orientation

  if (selectedBlock === null) {
    return (
      <div className="admin-inspector-stack text-sm" aria-label="Inspector panel">
        <div ref={topAnchorRef} className="h-px w-full shrink-0 scroll-mt-4" tabIndex={-1} aria-hidden />
        <AdminEmptyState
          title={o.emptyInspectorTitle}
          description={o.emptyInspectorDescription}
          className="admin-inspector-empty-state"
        />
        <InspectorSection title={ins.seo}>
          {onUpdatePageSeo ? (
            <SeoEditorSection seo={pageSeo} onUpdate={onUpdatePageSeo} tenantId={tenantId} />
          ) : (
            <p className="text-xs admin-text-muted">{ins.seoUnavailable}</p>
          )}
        </InspectorSection>
        {pageSeo ? (
          <InspectorSection title={ins.debugSeo} description={ins.debugHint} raw>
            <pre className="admin-inspector-debug-pre admin-bg overflow-x-auto rounded-md p-3 font-mono admin-text-muted">
              {JSON.stringify(pageSeo, null, 2)}
            </pre>
          </InspectorSection>
        ) : null}
      </div>
    )
  }

  const position = getBlockEditorPosition(selectedBlock.id, orderedBlocks)

  return (
    <div className="admin-inspector-stack text-sm" aria-label="Inspector panel">
      <div ref={topAnchorRef} className="h-px w-full shrink-0 scroll-mt-4" tabIndex={-1} aria-hidden />
      {position ? (
        <EditorSelectedBlockContext
          block={selectedBlock}
          displayIndex={position.displayIndex}
          total={position.total}
          className="admin-editor-inspector-context-sticky"
        />
      ) : null}

      <div className="admin-inspector-active-region">
        <PropsEditing
          key={selectedBlock.id}
          block={selectedBlock}
          tenantId={tenantId}
          onUpdate={(newProps) => {
            onUpdateProps?.(selectedBlock.id, newProps)
          }}
        />
      </div>

      <InspectorSection title={ins.seo} description={ins.seoPageDescription}>
        {onUpdatePageSeo ? (
          <SeoEditorSection seo={pageSeo} onUpdate={onUpdatePageSeo} tenantId={tenantId} />
        ) : (
          <p className="text-xs admin-text-muted">{ins.seoUnavailable}</p>
        )}
      </InspectorSection>

      <InspectorSection title={ins.debugBlock} description={ins.debugHint} raw>
        <pre className="admin-inspector-debug-pre admin-bg overflow-x-auto rounded-md p-3 font-mono admin-text-muted">
          {JSON.stringify(selectedBlock.props, null, 2)}
        </pre>
      </InspectorSection>

      {pageSeo ? (
        <InspectorSection title={ins.debugSeo} description={ins.debugHint} raw>
          <pre className="admin-inspector-debug-pre admin-bg overflow-x-auto rounded-md p-3 font-mono admin-text-muted">
            {JSON.stringify(pageSeo, null, 2)}
          </pre>
        </InspectorSection>
      ) : null}
    </div>
  )
}
