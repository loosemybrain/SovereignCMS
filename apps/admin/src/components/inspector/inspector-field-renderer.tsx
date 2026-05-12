/**
 * Renders a single inspector field based on field definition and type.
 */

import type { InspectorFieldDefinition } from "./field-types"
import type { MediaAsset } from "@sovereign-cms/core"
import { MediaPicker } from "@/components/media-picker"
import { AdminField } from "@/components/admin-ui"

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
  const stringValue = getStringValue(value)
  const fieldId = id ?? `inspector-field-${field.key}`

  if (field.type === "text") {
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
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="mt-1 w-full rounded border admin-border admin-surface px-2 py-1 text-xs admin-text placeholder:admin-text-muted admin-focus-ring focus:outline-none"
          />
        )}
      </AdminField>
    )
  }

  if (field.type === "textarea") {
    return (
      <AdminField
        id={fieldId}
        label={field.label}
        description={field.description}
        error={error}
      >
        {(fieldProps) => (
          <textarea
            id={fieldProps.id}
            aria-describedby={describedBy ?? fieldProps["aria-describedby"]}
            aria-invalid={invalid || fieldProps["aria-invalid"] || undefined}
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="mt-1 w-full rounded border admin-border admin-surface px-2 py-1 text-xs admin-text placeholder:admin-text-muted admin-focus-ring focus:outline-none"
          />
        )}
      </AdminField>
    )
  }

  if (field.type === "select") {
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
            value={stringValue}
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

  if (field.type === "media") {
    // Media field requires tenantId
    if (!tenantId) {
      return (
        <div className="rounded bg-red-900/20 border border-red-700/50 p-2" role="alert">
          <p className="text-xs text-red-300">Error: tenantId not available for media field</p>
        </div>
      )
    }

    // Extract selected asset ID from value (could be string or null)
    const selectedAssetId = typeof value === "string" ? value : null

    return (
      <AdminField
        id={fieldId}
        label={field.label}
        description={field.description}
        error={error}
      >
        {() => (
          <div className="mt-2">
            <MediaPicker
              tenantId={tenantId}
              selectedAssetId={selectedAssetId}
              onSelect={(asset: MediaAsset) => {
                // Return object patch for media props
                onChange({
                  mediaAssetId: asset.id,
                  mediaUrl: asset.url,
                  mediaAlt: asset.alt ?? asset.title,
                })
              }}
            />
          </div>
        )}
      </AdminField>
    )
  }

  // Fallback for unknown field types
  return <p className="text-xs admin-text-muted">Unknown field type: {field.type}</p>
}
