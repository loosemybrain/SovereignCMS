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
  InspectorSection,
} from "@/components/editor/patterns"
import { AdminAlert, AdminSectionCard } from "@/components/admin-ui"
import {
  INSPECTOR_SECTION_LABELS,
  INSPECTOR_SECTION_ORDER,
  bucketInspectorFieldsBySection,
} from "@/components/inspector/inspector-sections"

type EditorInspectorProps = {
  selectedBlock: CmsBlock | null
  onUpdateProps?: (blockId: string, newProps: Record<string, unknown>) => void
  tenantId?: string
  pageSeo?: SeoMetadata | null
  onUpdatePageSeo?: (patch: Partial<SeoMetadata>) => void
}

function BlockInfo({ block }: { block: CmsBlock }) {
  return (
    <dl className="admin-gov-nested-surface grid gap-2 px-3 py-2.5 text-[11px] admin-text-muted">
      <div className="flex justify-between gap-2">
        <dt className="font-medium admin-text">Typ</dt>
        <dd className="truncate font-medium capitalize admin-text">{block.type}</dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="font-medium admin-text">Position</dt>
        <dd className="font-mono tabular-nums admin-text">{block.sortOrder}</dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="font-medium admin-text">Sichtbarkeit</dt>
        <dd className="rounded-md border admin-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide admin-text">
          {block.visibility}
        </dd>
      </div>
      <div className="border-t border-[color-mix(in_oklab,var(--admin-border)_75%,transparent)] pt-2">
        <dt className="sr-only">Block-ID</dt>
        <dd className="break-all font-mono text-[10px] leading-snug opacity-60" title={block.id}>
          {block.id}
        </dd>
      </div>
    </dl>
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

function GovernanceIcon({ severity }: { severity: "info" | "warning" }) {
  if (severity === "warning") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 9v4M12 17h.01M10.3 3.9L2.7 18.1c-.4.7.1 1.6.9 1.6h16.8c.8 0 1.3-.9.9-1.6L13.7 3.9c-.4-.7-1.4-.7-1.8 0z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
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

  // No fields registered for this block type
  if (fields.length === 0) {
    return (
      <p className="text-xs admin-text-muted">
        Für den Blocktyp „{block.type}“ sind keine Inspector-Felder registriert.
      </p>
    )
  }

  const sectionBuckets = bucketInspectorFieldsBySection(fields)

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

  const nonEmptySectionKeys = INSPECTOR_SECTION_ORDER.filter(
    (sectionKey) => sectionBuckets[sectionKey].length > 0,
  )

  return (
    <div className="space-y-3">
      <EditorValidationSummary errors={validationSummary} />

      {nonEmptySectionKeys.map((sectionKey) => {
        const sectionFields = sectionBuckets[sectionKey]
        return (
          <AdminSectionCard
            key={sectionKey}
            title={INSPECTOR_SECTION_LABELS[sectionKey]}
            dense
            variant="default"
          >
            <div className="space-y-2.5">{sectionFields.map(renderField)}</div>
          </AdminSectionCard>
        )
      })}

      {governanceWarnings.length > 0 && (
        <AdminSectionCard
          title="Inhaltshinweise"
          description="Hinweise zum Block-Inhalt (nicht blockierend)"
          variant="default"
          dense
          className="border-[color-mix(in_oklab,var(--admin-accent)_12%,var(--admin-border))]"
        >
          <div className="space-y-2.5">
            {governanceWarnings.map((warning) => (
              <AdminAlert
                key={warning.id}
                variant={warning.severity === "warning" ? "warning" : "info"}
                icon={<GovernanceIcon severity={warning.severity} />}
                className="shadow-sm ring-1 ring-inset ring-[color-mix(in_oklab,var(--admin-border)_50%,transparent)]"
              >
                {warning.message}
              </AdminAlert>
            ))}
          </div>
        </AdminSectionCard>
      )}
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
      <div className="admin-inspector-stack text-sm" aria-label="Inspector panel">
        <InspectorSection title="Kein Block ausgewählt">
          <EditorHint tone="info">
            Wählen Sie einen Block in der Liste, um dessen Eigenschaften zu bearbeiten. Die Seiten-SEO können Sie
            weiter unten anpassen.
          </EditorHint>
        </InspectorSection>
        <InspectorSection title="SEO">
          {onUpdatePageSeo ? (
            <SeoEditorSection seo={pageSeo} onUpdate={onUpdatePageSeo} tenantId={tenantId} />
          ) : (
            <p className="text-xs admin-text-muted">SEO-Bearbeitung ist in dieser Ansicht nicht verfügbar.</p>
          )}
        </InspectorSection>

        {pageSeo && (
          <InspectorSection
            title="Debug: Rohdaten SEO"
            description="Nur zur Kontrolle — keine Eingabe."
            raw
          >
            <pre className="admin-inspector-debug-pre admin-bg overflow-x-auto rounded-md p-3 font-mono admin-text-muted">
              {JSON.stringify(pageSeo, null, 2)}
            </pre>
          </InspectorSection>
        )}
      </div>
    )
  }

  // Block is selected: show block properties
  return (
    <div className="admin-inspector-stack text-sm" aria-label="Inspector panel">
      <InspectorSection title="Block-Info">
        <BlockInfo block={selectedBlock} />
      </InspectorSection>

      <InspectorSection title="Block-Eigenschaften">
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
        title="SEO"
        description="Seitenweite Metadaten — unabhängig vom ausgewählten Block bearbeitbar."
      >
        {onUpdatePageSeo ? (
          <SeoEditorSection seo={pageSeo} onUpdate={onUpdatePageSeo} tenantId={tenantId} />
        ) : (
          <EditorHint tone="info">SEO-Bearbeitung ist in dieser Ansicht nicht verfügbar.</EditorHint>
        )}
      </InspectorSection>

      <InspectorSection
        title="Debug: Rohdaten Block"
        description="Nur zur Kontrolle — keine Eingabe."
        raw
      >
        <pre className="admin-inspector-debug-pre admin-bg overflow-x-auto rounded-md p-3 font-mono admin-text-muted">
          {JSON.stringify(selectedBlock.props, null, 2)}
        </pre>
      </InspectorSection>

      {pageSeo ? (
        <InspectorSection
          title="Debug: Rohdaten SEO"
          description="Nur zur Kontrolle — keine Eingabe."
          raw
        >
          <pre className="admin-inspector-debug-pre admin-bg overflow-x-auto rounded-md p-3 font-mono admin-text-muted">
            {JSON.stringify(pageSeo, null, 2)}
          </pre>
        </InspectorSection>
      ) : null}
    </div>
  )
}
