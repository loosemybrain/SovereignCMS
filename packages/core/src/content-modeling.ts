export type FieldGroupDefinition = {
  id: string
  label: string
  description?: string
}

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

export type StructuredInspectorFieldDefinition = {
  key: string
  label: string
  type: string
  groupId?: string
  description?: string
  placeholder?: string
  validations?: ValidationRule[]
}
