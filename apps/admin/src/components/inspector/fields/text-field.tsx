import type { InspectorFieldDefinition } from "../field-types"
import { AdminField } from "@/components/admin-ui"

type Props = {
  field: InspectorFieldDefinition
  value: string
  onChange: (value: string) => void
  fieldId: string
  describedBy?: string
  invalid?: boolean
  error?: string | null
}

export function TextField({
  field,
  value,
  onChange,
  fieldId,
  describedBy,
  invalid,
  error,
}: Props) {
  return (
    <AdminField
      id={fieldId}
      label={field.label}
      description={field.description}
      error={error}
    >
      {(fieldProps) => (
        <input
          id={fieldProps.id}
          aria-describedby={describedBy ?? fieldProps["aria-describedby"]}
          aria-invalid={invalid || fieldProps["aria-invalid"] || undefined}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="mt-1 w-full rounded border admin-border admin-surface px-2 py-1 text-xs admin-text placeholder:admin-text-muted admin-focus-ring focus:outline-none"
        />
      )}
    </AdminField>
  )
}
