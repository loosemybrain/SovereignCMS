/**
 * Small adapter-level errors without provider-specific payloads.
 */
export class PersistenceAdapterError extends Error {
  readonly code: string

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = "PersistenceAdapterError"
    this.code = code
  }
}

export function normalizeAdapterError(
  operation: string,
  error: unknown,
): PersistenceAdapterError {
  if (error instanceof PersistenceAdapterError) {
    return error
  }

  const message =
    error instanceof Error && error.message.trim().length > 0
      ? error.message
      : "Unknown persistence error"

  return new PersistenceAdapterError("persistence_failed", `${operation} failed: ${message}`, {
    cause: error,
  })
}
