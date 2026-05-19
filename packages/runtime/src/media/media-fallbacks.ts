/**
 * Plain-data media fallback descriptors (Phase 77).
 * Renderers choose how to present these — no React, no remote placeholder URLs.
 */

export type MediaCompositionFallbackKind =
  | "unresolved"
  | "invalid"
  | "external-preview-placeholder"

export type MediaCompositionFallback = {
  kind: MediaCompositionFallbackKind
  message: string
  /** Original external URL for admin preview copy only — never used as img src. */
  externalUrl?: string
}

export function createUnresolvedMediaFallback(): MediaCompositionFallback {
  return {
    kind: "unresolved",
    message: "Media reference could not be resolved for this tenant.",
  }
}

export function createInvalidMediaFallback(reason?: string): MediaCompositionFallback {
  return {
    kind: "invalid",
    message: reason?.trim() || "Media URL is not allowed for safe rendering.",
  }
}

export function createExternalPreviewPlaceholder(externalUrl?: string): MediaCompositionFallback {
  return {
    kind: "external-preview-placeholder",
    message: "External media is not loaded in admin preview.",
    ...(externalUrl?.trim() ? { externalUrl: externalUrl.trim() } : {}),
  }
}
