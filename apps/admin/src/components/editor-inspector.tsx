"use client"

import { useState } from "react"
import type { CmsBlock } from "@sovereign-cms/core"
import { InspectorFieldRenderer } from "./inspector/inspector-field-renderer"
import { SeoEditorSection } from "@/components/seo-editor-section"
import type { SeoMetadata } from "@sovereign-cms/core"
import { getAdminBlockDefinition } from "@/block-definitions/registry"
import { validateFieldValue } from "@/lib/field-validation"
import { getBlockGovernanceWarnings } from "@/lib/content-governance"
import {
  EditorHint,
  EditorValidationSummary,
  FieldGroupPanel,
  InspectorSection,
} from "@/components/editor/patterns"

type EditorInspectorProps = {
  selectedBlock: CmsBlock | null
  onUpdateProps?: (blockId: string, newProps: Record<string, unknown>) => void
  tenantId?: string
  pageSeo?: SeoMetadata | null
  onUpdatePageSeo?: (patch: Partial<SeoMetadata>) => void
}

function BlockInfo({ block }: { block: CmsBlock }) {
  return (
    <div className="space-y-1 text-xs admin-text-muted">
      <p>
        <span className="font-medium">Type:</span> {block.type}
      </p>
      <p>
        <span className="font-medium">ID:</span> {block.id}
      </p>
      <p>
        <span className="font-medium">Sort:</span> {block.sortOrder}
      </p>
      <p>
        <span className="font-medium">Visibility:</span> {block.visibility}
      </p>
    </div>
  )
}

/**
 * Build field patch from field value.
 * For media fields that return object patches, merge them.
 * For regular fields, wrap value under field key.
 */
function buildFieldPatch(fieldKey: string, value: unknown): Record<string, unknown> {
  // Media fields return object patches (e.g., { mediaAssetId, mediaUrl, mediaAlt })
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as Record<string, unknown>
  }

  // Regular fields wrap value under field key
  return {
    [fieldKey]: value,
  }
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
  // Safely read props
  const props =
    block &&
    typeof block.props === "object" &&
    block.props !== null
      ? (block.props as Record<string, unknown>)
      : {}

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const definition = getAdminBlockDefinition(block.type)
  const fields = definition?.inspectorFields ?? []
  const fieldGroups = definition?.fieldGroups ?? []

  // No fields registered for this block type
  if (fields.length === 0) {
    return (
      <p className="text-xs admin-text-muted">
        No inspector fields registered for block type &quot;{block.type}&quot;
      </p>
    )
  }

  const groupedFields = fieldGroups.map((group) => ({
    ...group,
    fields: fields.filter((field) => field.groupId === group.id),
  }))
  const ungroupedFields = fields.filter(
    (field) => field.groupId === undefined || !fieldGroups.some((group) => group.id === field.groupId),
  )

  const getFieldError = (fieldKey: string, value: unknown, fieldValidations: typeof fields[number]["validations"]) => {
    if (!touchedFields[fieldKey]) {
      return null
    }
    const result = validateFieldValue(value, fieldValidations)
    return result.valid ? null : result.errors[0] ?? "Invalid value."
  }

  const renderField = (field: (typeof fields)[number]) => {
    const error = getFieldError(field.key, props[field.key], field.validations)
    const fieldId = `block-${toSafeDomId(block.id)}-field-${toSafeDomId(field.key)}`
    return (
      <InspectorFieldRenderer
        key={field.key}
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
    )
  }

  const validationSummary = fields
    .map((field) => {
      const result = validateFieldValue(props[field.key], field.validations)
      if (result.valid) {
        return null
      }
      return {
        fieldLabel: field.label,
        fieldId: `block-${toSafeDomId(block.id)}-field-${toSafeDomId(field.key)}`,
        messages: result.errors,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const governanceWarnings = getBlockGovernanceWarnings(block)

  return (
    <div className="space-y-2">
      <EditorValidationSummary errors={validationSummary} />

      {governanceWarnings.length > 0 && (
        <InspectorSection title="Content Hinweise" description="Helpful hints about block content" raw>
          <div className="space-y-1">
            {governanceWarnings.map((warning) => (
              <div
                key={warning.id}
                className={`rounded border-l-4 p-2 text-xs ${
                  warning.severity === "warning"
                    ? "border-l-amber-500 bg-amber-50 text-amber-900"
                    : "border-l-blue-500 bg-blue-50 text-blue-900"
                }`}
              >
                <p>{warning.message}</p>
              </div>
            ))}
          </div>
        </InspectorSection>
      )}
      {groupedFields.map((group) =>
        group.fields.length > 0 ? (
          <FieldGroupPanel
            key={group.id}
            title={group.label}
            description={group.description}
          >
            <div className="space-y-2">{group.fields.map(renderField)}</div>
          </FieldGroupPanel>
        ) : null,
      )}

      {ungroupedFields.length > 0 ? (
        <FieldGroupPanel title="Other Fields">
          <div className="space-y-2">{ungroupedFields.map(renderField)}</div>
        </FieldGroupPanel>
      ) : null}
    </div>
  )
}

export function EditorInspector({
  selectedBlock,
  onUpdateProps,
  tenantId,
  pageSeo,
  onUpdatePageSeo,
}: EditorInspectorProps) {
  // If no block is selected, show page SEO editor
  if (selectedBlock === null) {
    return (
      <div className="space-y-4 text-sm" aria-label="Inspector panel">
        <InspectorSection title="No block selected">
          <EditorHint tone="info">
            Select a block from the list to edit its properties. You can still edit page SEO below.
          </EditorHint>
        </InspectorSection>
        <InspectorSection title="SEO Metadata">
          {onUpdatePageSeo ? (
            <SeoEditorSection seo={pageSeo} onUpdate={onUpdatePageSeo} tenantId={tenantId} />
          ) : (
            <p className="text-xs admin-text-muted">SEO editing is not available in this view.</p>
          )}
        </InspectorSection>

        {pageSeo && (
          <InspectorSection
            title="Debug Preview: Raw SEO"
            description="Debug preview for current SEO metadata."
            raw
          >
            <pre className="admin-bg border admin-border rounded p-2 text-xs overflow-x-auto admin-text-muted">
              {JSON.stringify(pageSeo, null, 2)}
            </pre>
          </InspectorSection>
        )}
      </div>
    )
  }

  // Block is selected: show block properties
  return (
    <div className="space-y-4 text-sm" aria-label="Inspector panel">
      <InspectorSection title="Block Info">
        <BlockInfo block={selectedBlock} />
      </InspectorSection>

      <InspectorSection title="Content Fields / Field Groups">
        <PropsEditing
          block={selectedBlock}
          tenantId={tenantId}
          onUpdate={(newProps) => {
            if (onUpdateProps) {
              onUpdateProps(selectedBlock.id, newProps)
            }
          }}
        />
      </InspectorSection>

      <InspectorSection
        title="SEO Metadata"
        description="Page-level SEO metadata can be edited independently of the selected block."
      >
        {onUpdatePageSeo ? (
          <SeoEditorSection seo={pageSeo} onUpdate={onUpdatePageSeo} tenantId={tenantId} />
        ) : (
          <EditorHint tone="info">SEO editing is not available in this view.</EditorHint>
        )}
      </InspectorSection>

      <InspectorSection
        title="Debug Preview: Raw Props"
        description="Debug preview for current block props."
        raw
      >
        <pre className="admin-bg border admin-border rounded p-2 text-xs overflow-x-auto admin-text-muted">
          {JSON.stringify(selectedBlock.props, null, 2)}
        </pre>
      </InspectorSection>

      {pageSeo ? (
        <InspectorSection
          title="Debug Preview: Raw SEO"
          description="Debug preview for current SEO metadata."
          raw
        >
          <pre className="admin-bg border admin-border rounded p-2 text-xs overflow-x-auto admin-text-muted">
            {JSON.stringify(pageSeo, null, 2)}
          </pre>
        </InspectorSection>
      ) : null}
    </div>
  )
}
