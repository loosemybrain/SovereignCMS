import type { InspectorFieldDefinition } from "../field-types"
import { SimpleListRenderer } from "../simple-list-renderer"

type Props = {
  field: InspectorFieldDefinition
  value: unknown
  onChange: (value: unknown) => void
  fieldId: string
  describedBy?: string
  invalid?: boolean
  error?: string | null
}

export function SimpleListField({
  field,
  value,
  onChange,
  fieldId,
  describedBy,
  invalid,
  error,
}: Props) {
  return (
    <SimpleListRenderer
      field={field}
      value={value}
      onChange={onChange}
      id={fieldId}
      describedBy={describedBy}
      invalid={invalid}
      error={error}
    />
  )
}
