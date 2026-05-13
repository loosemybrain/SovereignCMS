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

export function SelectField({
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
        <select
          id={fieldProps.id}
          aria-describedby={describedBy ?? fieldProps["aria-describedby"]}
          aria-invalid={invalid || fieldProps["aria-invalid"] || undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded border admin-border admin-surface px-2 py-1 text-xs admin-text admin-focus-ring focus:outline-none"
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </AdminField>
  )
}
