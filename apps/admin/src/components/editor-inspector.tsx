"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import { InspectorFieldRenderer } from "./inspector/inspector-field-renderer"
import { getInspectorFieldsForBlock } from "./inspector/block-field-registry"

type EditorInspectorProps = {
  selectedBlock: CmsBlock | null
  onUpdateProps?: (blockId: string, newProps: Record<string, unknown>) => void
}

function BlockInfo({ block }: { block: CmsBlock }) {
  return (
    <div className="space-y-1 text-xs text-zinc-400">
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

function PropsEditing({
  block,
  onUpdate,
}: {
  block: CmsBlock
  onUpdate: (newProps: Record<string, unknown>) => void
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
      <p className="text-xs text-zinc-400">
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
          onChange={(value) => {
            onUpdate({
              [field.key]: value,
            })
          }}
        />
      ))}
    </div>
  )
}

export function EditorInspector({ selectedBlock, onUpdateProps }: EditorInspectorProps) {
  if (selectedBlock === null) {
    return <p className="text-zinc-400">No block selected</p>
  }

  return (
    <div className="space-y-4 text-sm">
      <section>
        <h3 className="mb-2 font-medium text-zinc-200">Block Info</h3>
        <BlockInfo block={selectedBlock} />
      </section>

      <section>
        <h3 className="mb-2 font-medium text-zinc-200">Props</h3>
        <PropsEditing
          block={selectedBlock}
          onUpdate={(newProps) => {
            if (onUpdateProps) {
              onUpdateProps(selectedBlock.id, newProps)
            }
          }}
        />
      </section>

      <section className="border-t border-zinc-800 pt-4">
        <h3 className="mb-2 font-medium text-zinc-200">Raw Props Preview</h3>
        <pre className="bg-zinc-950 border border-zinc-800 rounded p-2 text-xs overflow-x-auto text-zinc-400">
          {JSON.stringify(selectedBlock.props, null, 2)}
        </pre>
      </section>
    </div>
  )
}
