import type { ValidationRule } from "@sovereign-cms/core"

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

export function validateFieldValue(value: unknown, rules?: ValidationRule[]): ValidationResult {
  if (!rules || rules.length === 0) {
    return { valid: true, errors: [] }
  }

  const stringValue = typeof value === "string" ? value : ""
  const trimmedValue = stringValue.trim()
  const errors: string[] = []

  for (const rule of rules) {
    if (rule.type === "required" && trimmedValue.length === 0) {
      errors.push(rule.message ?? "This field is required.")
      continue
    }

    if (rule.type === "minLength" && trimmedValue.length < rule.value) {
      errors.push(rule.message ?? `Minimum length is ${rule.value} characters.`)
      continue
    }

    if (rule.type === "maxLength" && trimmedValue.length > rule.value) {
      errors.push(rule.message ?? `Maximum length is ${rule.value} characters.`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
