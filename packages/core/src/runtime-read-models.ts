/**
 * Runtime read model contracts (Phase 87).
 * Describes renderer-safe, transient projections from runtime composition — not a projection engine or query layer.
 *
 * Separate from runtime composition boundaries, boundary enforcement, validation, and media contracts.
 */

export type RuntimeReadModelMode = "public" | "admin-preview"

export type RuntimeReadModelArtifact =
  | "block-props"
  | "media"
  | "composition-metadata"
  | "validation"
  | "preview-isolation"
  | "governance"

export type RuntimeReadModelBoundary = {
  mode: RuntimeReadModelMode
  artifacts: RuntimeReadModelArtifact[]
  rendererSafe: true
  transientOnly: true
  persistable: false
}

export type RuntimeBlockReadModel = {
  blockType: string
  mode: RuntimeReadModelMode
  props: Record<string, unknown>
  metadata?: {
    artifacts: RuntimeReadModelArtifact[]
    transient: true
  }
}

export const PUBLIC_RUNTIME_READ_MODEL_BOUNDARY: RuntimeReadModelBoundary = {
  mode: "public",
  artifacts: ["block-props", "media", "composition-metadata", "validation", "governance"],
  rendererSafe: true,
  transientOnly: true,
  persistable: false,
}

export const ADMIN_PREVIEW_RUNTIME_READ_MODEL_BOUNDARY: RuntimeReadModelBoundary = {
  mode: "admin-preview",
  artifacts: [
    "block-props",
    "media",
    "composition-metadata",
    "validation",
    "preview-isolation",
    "governance",
  ],
  rendererSafe: true,
  transientOnly: true,
  persistable: false,
}

const BOUNDARY_BY_MODE: Record<RuntimeReadModelMode, RuntimeReadModelBoundary> = {
  public: PUBLIC_RUNTIME_READ_MODEL_BOUNDARY,
  "admin-preview": ADMIN_PREVIEW_RUNTIME_READ_MODEL_BOUNDARY,
}

export function getRuntimeReadModelBoundary(
  mode: RuntimeReadModelMode,
): RuntimeReadModelBoundary {
  return BOUNDARY_BY_MODE[mode]
}

export function isRuntimeReadModelPersistable(
  _boundary: RuntimeReadModelBoundary,
): false {
  return false
}

export function assertRuntimeReadModelBoundary(boundary: RuntimeReadModelBoundary): void {
  if (boundary.rendererSafe !== true) {
    throw new Error("Runtime read model boundary must be renderer-safe (rendererSafe=true).")
  }
  if (boundary.transientOnly !== true || boundary.persistable !== false) {
    throw new Error(
      "Runtime read model boundary must be transient-only (transientOnly=true, persistable=false).",
    )
  }
}

export function createRuntimeBlockReadModel(input: {
  blockType: string
  mode: RuntimeReadModelMode
  props: Record<string, unknown>
  artifacts?: RuntimeReadModelArtifact[]
}): RuntimeBlockReadModel {
  const model: RuntimeBlockReadModel = {
    blockType: input.blockType,
    mode: input.mode,
    props: { ...input.props },
  }

  if (input.artifacts != null && input.artifacts.length > 0) {
    model.metadata = {
      artifacts: [...input.artifacts],
      transient: true,
    }
  }

  return model
}
