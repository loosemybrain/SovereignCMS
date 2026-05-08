"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import { InspectorFieldRenderer } from "./inspector/inspector-field-renderer"
import { getInspectorFieldsForBlock } from "./inspector/block-field-registry"

type EditorInspectorProps = {
  selectedBlock: CmsBlock | null
  onUpdateProps?: (blockId: string, newProps: Record<string, unknown>) => void
  tenantId?: string
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

  // Get field definitions from registry
  const fields = getInspectorFieldsForBlock(block.type)

  // No fields registered for this block type
  if (fields.length === 0) {
    return (
      <p className="text-xs admin-text-muted">
        No inspector fields registered for block type &quot;{block.type}&quot;
      </p>
    )
  }

  // Render fields using registry
  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <InspectorFieldRenderer
          key={field.key}
          field={field}
          value={props[field.key]}
          tenantId={tenantId}
          onChange={(value) => {
            onUpdate(buildFieldPatch(field.key, value))
          }}
        />
      ))}
    </div>
  )
}

export function EditorInspector({ selectedBlock, onUpdateProps, tenantId }: EditorInspectorProps) {
  if (selectedBlock === null) {
    return <p className="admin-text-muted">No block selected</p>
  }

  return (
    <div className="space-y-4 text-sm">
      <section>
        <h3 className="mb-2 font-medium admin-text">Block Info</h3>
        <BlockInfo block={selectedBlock} />
      </section>

      <section>
        <h3 className="mb-2 font-medium admin-text">Props</h3>
        <PropsEditing
          block={selectedBlock}
          tenantId={tenantId}
          onUpdate={(newProps) => {
            if (onUpdateProps) {
              onUpdateProps(selectedBlock.id, newProps)
            }
          }}
        />
      </section>

      <section className="border-t admin-border pt-4">
        <h3 className="mb-2 font-medium admin-text">Raw Props Preview</h3>
        <pre className="admin-bg border admin-border rounded p-2 text-xs overflow-x-auto admin-text-muted">
          {JSON.stringify(selectedBlock.props, null, 2)}
        </pre>
      </section>
    </div>
  )
}
