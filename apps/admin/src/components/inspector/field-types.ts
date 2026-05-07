/**
 * Field type definitions for the block property inspector.
 * Defines which UI component renders for each field type.
 */

export type InspectorFieldType = "text" | "textarea"

/**
 * Describes a single editable field in the inspector.
 */
export type InspectorFieldDefinition = {
  /** Property key in block.props */
  key: string
  /** Display label for the field */
  label: string
  /** UI component type */
  type: InspectorFieldType
  /** Placeholder text shown in empty input/textarea */
  placeholder?: string
}
