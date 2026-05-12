/**
 * Safely parse a JSON string.
 * Returns null if parsing fails, otherwise returns the parsed value.
 */
export function parseJsonSafe<T>(jsonString: unknown): T | null {
  if (typeof jsonString !== "string") {
    return null
  }

  try {
    return JSON.parse(jsonString) as T
  } catch {
    return null
  }
}
