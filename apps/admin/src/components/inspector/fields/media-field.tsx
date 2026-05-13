import type { InspectorFieldDefinition } from "../field-types"
import type { MediaAsset } from "@sovereign-cms/core"
import { MediaPicker } from "@/components/media-picker"
import { AdminField } from "@/components/admin-ui"

type Props = {
  field: InspectorFieldDefinition
  value: unknown
  onChange: (value: unknown) => void
  tenantId: string
  fieldId: string
  describedBy?: string
  invalid?: boolean
  error?: string | null
}

export function MediaField({
  field,
  value,
  onChange,
  tenantId,
  fieldId,
  describedBy,
  invalid,
  error,
}: Props) {
  const selectedAssetId = typeof value === "string" ? value : null

  return (
    <AdminField
      id={fieldId}
      label={field.label}
      description={field.description}
      error={error}
    >
      {() => (
        <div
          className="mt-2"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
        >
          <MediaPicker
            tenantId={tenantId}
            selectedAssetId={selectedAssetId}
            onSelect={(asset: MediaAsset) => {
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
