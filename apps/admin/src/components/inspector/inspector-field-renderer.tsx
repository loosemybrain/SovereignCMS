/**
 * Renders a single inspector field based on field definition and type.
 * Delegates to specific field component based on field type.
 */

import type { InspectorFieldDefinition } from "./field-types"
import { TextField } from "./fields/text-field"
import { TextareaField } from "./fields/textarea-field"
import { SelectField } from "./fields/select-field"
import { MediaField } from "./fields/media-field"
import { SimpleListField } from "./fields/simple-list-field"

type Props = {
  field: InspectorFieldDefinition
  value: unknown
  onChange: (value: unknown) => void
  tenantId?: string
  id?: string
  describedBy?: string
  invalid?: boolean
  error?: string | null
}

/**
 * Safely coerce value to string.
 */
function getStringValue(value: unknown): string {
  if (typeof value === "string") return value
  return ""
}

export function InspectorFieldRenderer({
  field,
  value,
  onChange,
  tenantId,
  id,
  describedBy,
  invalid,
  error,
}: Props) {
  const fieldId = id ?? `inspector-field-${field.key}`
  const stringValue = getStringValue(value)

  switch (field.type) {
    case "text":
      return (
        <TextField
          field={field}
          value={stringValue}
          onChange={onChange}
          fieldId={fieldId}
          describedBy={describedBy}
          invalid={invalid}
          error={error}
        />
      )

    case "textarea":
      return (
        <TextareaField
          field={field}
          value={stringValue}
          onChange={onChange}
          fieldId={fieldId}
          describedBy={describedBy}
          invalid={invalid}
          error={error}
        />
      )

    case "select":
      return (
        <SelectField
          field={field}
          value={stringValue}
          onChange={onChange}
          fieldId={fieldId}
          describedBy={describedBy}
          invalid={invalid}
          error={error}
        />
      )

    case "simple-list":
      return (
        <SimpleListField
          field={field}
          value={value}
          onChange={onChange}
          fieldId={fieldId}
          describedBy={describedBy}
          invalid={invalid}
          error={error}
        />
      )

    case "media":
      if (!tenantId) {
        return (
          <div className="rounded bg-red-900/20 border border-red-700/50 p-2" role="alert">
            <p className="text-xs text-red-300">Error: tenantId not available for media field</p>
          </div>
        )
      }

      return (
        <MediaField
          field={field}
          value={value}
          onChange={onChange}
          tenantId={tenantId}
          fieldId={fieldId}
          describedBy={describedBy}
          invalid={invalid}
          error={error}
        />
      )

    default:
      return <p className="text-xs admin-text-muted">Unknown field type: {field.type}</p>
  }
}
