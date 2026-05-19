/**
 * Runtime media composition types (Phase 77, hardened Phase 84).
 * Server/runtime only — not for Client Components.
 */

import type { RuntimeCompositionMetadata } from "@sovereign-cms/core"

/** @deprecated Use RuntimeCompositionMode from @sovereign-cms/core */
export type { RuntimeCompositionMode as MediaCompositionMode } from "@sovereign-cms/core"

export type MediaCompositionResult<T> = {
  value: T
  unresolvedMediaCount: number
  externalMediaCount: number
  invalidMediaCount: number
  /** Transient composition boundary metadata — not persistable. */
  metadata: RuntimeCompositionMetadata
}

export const SOVEREIGN_MEDIA_COMPOSITION_PROP = "_sovereignMediaComposition" as const
