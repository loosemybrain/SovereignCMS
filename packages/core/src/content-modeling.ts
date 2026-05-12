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

export type SelectOption = {
  label: string
  value: string
}

export type StructuredInspectorFieldDefinition = {
  key: string
  label: string
  type: string
  groupId?: string
  description?: string
  placeholder?: string
  options?: SelectOption[]
  validations?: ValidationRule[]
}
