export type PreviewMode = "disabled" | "enabled"

export type PreviewContext = {
  mode: PreviewMode
}

export function createPreviewContext(input?: {
  preview?: string | string[] | undefined
}): PreviewContext {
  const value = Array.isArray(input?.preview)
    ? input?.preview[0]
    : input?.preview

  return {
    mode: value === "1" || value === "true"
      ? "enabled"
      : "disabled",
  }
}
