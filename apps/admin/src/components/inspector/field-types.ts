import type { StructuredInspectorFieldDefinition, ValidationRule } from "@sovereign-cms/core"

/**
 * Field type definitions for the block property inspector.
 * Defines which UI component renders for each field type.
 */
export type InspectorFieldType = "text" | "textarea" | "media" | "select" | "simple-list"

/**
 * Single option for a select field.
 */
export type SelectOption = {
  label: string
  value: string
}

/**
 * Simple list item shape for repeater fields.
 * Used by simple-list repeater type.
 */
export type SimpleListItem = {
  id: string
  title: string
  body?: string
}

/**
 * Describes a single editable field in the inspector.
 */
export type InspectorFieldDefinition = Omit<StructuredInspectorFieldDefinition, "type"> & {
  /** UI component type */
  type: InspectorFieldType
  /** Optional: media type filter ("image", "document", "video", "other") */
  mediaType?: "image" | "document" | "video" | "other"
  /** Optional: select field options */
  options?: SelectOption[]
  /** Optional: min items for simple-list */
  minItems?: number
  /** Optional: max items for simple-list */
  maxItems?: number
  /** Optional local validation rules */
  validations?: ValidationRule[]
}
