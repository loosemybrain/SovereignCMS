/**
 * Recursively merge new props into old props.
 * New props take precedence.
 * Handles nested plain objects, replaces arrays.
 */

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function mergeProps(
  oldProps: unknown,
  newProps: unknown,
): Record<string, unknown> {
  const oldRecord = oldProps && isPlainRecord(oldProps) ? oldProps : {}
  const newRecord = newProps && isPlainRecord(newProps) ? newProps : {}

  const result = { ...oldRecord }

  for (const key of Object.keys(newRecord)) {
    const oldValue = oldRecord[key]
    const newValue = newRecord[key]

    if (isPlainRecord(oldValue) && isPlainRecord(newValue)) {
      // Recursively merge nested objects
      result[key] = mergeProps(oldValue, newValue)
    } else {
      // Replace with new value
      result[key] = newValue
    }
  }

  return result
}
