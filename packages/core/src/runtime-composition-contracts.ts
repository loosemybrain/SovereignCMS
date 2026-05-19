/**
 * Runtime composition boundaries (Phase 84).
 * Declares transient-only composition semantics per mode — not an orchestrator or engine.
 *
 * Separate from media contracts, governance, preview isolation, and runtime validation.
 */

export type RuntimeCompositionMode = "public" | "admin-preview"

export type RuntimeCompositionConcern =
  | "media"
  | "external-media"
  | "preview-isolation"
  | "governance"
  | "runtime-validation"

export type RuntimeCompositionArtifactKind =
  | "composed-props"
  | "composition-metadata"
  | "validation-result"
  | "preview-isolation"

export type RuntimeCompositionBoundary = {
  mode: RuntimeCompositionMode
  concerns: RuntimeCompositionConcern[]
  artifactKinds: RuntimeCompositionArtifactKind[]
  transientOnly: true
  persistable: false
}

export type RuntimeCompositionMetadata = {
  mode: RuntimeCompositionMode
  concerns: RuntimeCompositionConcern[]
  transient: true
}

export const PUBLIC_RUNTIME_COMPOSITION_BOUNDARY: RuntimeCompositionBoundary = {
  mode: "public",
  concerns: ["media", "external-media", "governance", "runtime-validation"],
  artifactKinds: ["composed-props", "composition-metadata", "validation-result"],
  transientOnly: true,
  persistable: false,
}

export const ADMIN_PREVIEW_RUNTIME_COMPOSITION_BOUNDARY: RuntimeCompositionBoundary = {
  mode: "admin-preview",
  concerns: [
    "media",
    "external-media",
    "preview-isolation",
    "governance",
    "runtime-validation",
  ],
  artifactKinds: [
    "composed-props",
    "composition-metadata",
    "validation-result",
    "preview-isolation",
  ],
  transientOnly: true,
  persistable: false,
}

const BOUNDARY_BY_MODE: Record<RuntimeCompositionMode, RuntimeCompositionBoundary> = {
  public: PUBLIC_RUNTIME_COMPOSITION_BOUNDARY,
  "admin-preview": ADMIN_PREVIEW_RUNTIME_COMPOSITION_BOUNDARY,
}

export function getRuntimeCompositionBoundary(
  mode: RuntimeCompositionMode,
): RuntimeCompositionBoundary {
  return BOUNDARY_BY_MODE[mode]
}

export function isRuntimeCompositionPersistable(
  _boundary: RuntimeCompositionBoundary,
): false {
  return false
}

export function assertRuntimeCompositionTransient(boundary: RuntimeCompositionBoundary): void {
  if (boundary.transientOnly !== true || boundary.persistable !== false) {
    throw new Error(
      "Runtime composition boundary must be transient-only (transientOnly=true, persistable=false).",
    )
  }
}

export function createRuntimeCompositionMetadata(
  mode: RuntimeCompositionMode,
): RuntimeCompositionMetadata {
  const boundary = getRuntimeCompositionBoundary(mode)
  return {
    mode: boundary.mode,
    concerns: [...boundary.concerns],
    transient: true,
  }
}
