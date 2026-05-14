export type FieldGroupDefinition = {
  id: string
  label: string
  description?: string
}

/** Static inspector section keys (admin block inspector grouping only). */
export type InspectorSectionKey =
  | "content"
  | "media"
  | "actions"
  | "layout"
  | "advanced"

export type ValidationRule =
  | {
      type: "required"
      message?: string
    }
  | {
      type: "minLength"
      value: number
      message?: string
    }
  | {
      type: "maxLength"
      value: number
      message?: string
    }

export type SelectOption = {
  label: string
  value: string
}

export type StructuredInspectorFieldDefinition = {
  key: string
  label: string
  type: string
  groupId?: string
  /** Inspector section; omitted defaults to "content" in admin UI. */
  section?: InspectorSectionKey
  description?: string
  placeholder?: string
  options?: SelectOption[]
  /** For simple-list repeater: minimum number of items */
  minItems?: number
  /** For simple-list repeater: maximum number of items */
  maxItems?: number
  validations?: ValidationRule[]
}
