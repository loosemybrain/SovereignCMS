/**
 * Renders a single inspector field based on field definition and type.
 */

import type { InspectorFieldDefinition } from "./field-types"

type Props = {
  field: InspectorFieldDefinition
  value: unknown
  onChange: (value: unknown) => void
}

/**
 * Safely coerce value to string.
 */
function getStringValue(value: unknown): string {
  if (typeof value === "string") return value
  return ""
}

export function InspectorFieldRenderer({ field, value, onChange }: Props) {
  const stringValue = getStringValue(value)

  if (field.type === "text") {
    return (
      <div>
        <label className="block text-xs font-medium text-zinc-300">{field.label}</label>
        <input
          type="text"
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>
    )
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className="block text-xs font-medium text-zinc-300">{field.label}</label>
        <textarea
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>
    )
  }

  // Fallback for unknown field types
  return <p className="text-xs text-zinc-400">Unknown field type: {field.type}</p>
}
