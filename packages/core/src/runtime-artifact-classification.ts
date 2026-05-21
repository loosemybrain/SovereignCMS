/**
 * Runtime artifact classification (Phase 89).
 * Static semantics for artifact lifetime, visibility, and boundary scope — not a registry or engine.
 *
 * Separate from composition boundaries, read models, projection integrity, and boundary enforcement.
 */

export type RuntimeArtifactKind =
  | "block-props"
  | "media"
  | "composition-metadata"
  | "validation-result"
  | "preview-isolation"
  | "governance-metadata"
  | "boundary-enforcement-result"
  | "projection-integrity-result"

export type RuntimeArtifactLifetime = "request" | "composition"

export type RuntimeArtifactVisibility =
  | "renderer"
  | "admin-preview"
  | "internal-runtime"

export type RuntimeArtifactBoundaryScope =
  | "public-runtime"
  | "admin-preview-runtime"
  | "runtime-internal"

export type RuntimeArtifactClassification = {
  kind: RuntimeArtifactKind
  lifetime: RuntimeArtifactLifetime
  visibility: RuntimeArtifactVisibility[]
  boundaryScope: RuntimeArtifactBoundaryScope
  transientOnly: true
  persistable: false
  description?: string
}

export const RUNTIME_ARTIFACT_CLASSIFICATIONS: Record<
  RuntimeArtifactKind,
  RuntimeArtifactClassification
> = {
  "block-props": {
    kind: "block-props",
    lifetime: "composition",
    visibility: ["renderer", "admin-preview"],
    boundaryScope: "public-runtime",
    transientOnly: true,
    persistable: false,
    description: "Composed block props passed to renderers after runtime composition",
  },
  media: {
    kind: "media",
    lifetime: "composition",
    visibility: ["renderer", "admin-preview"],
    boundaryScope: "public-runtime",
    transientOnly: true,
    persistable: false,
    description: "Resolved or fallback media fields on composed props",
  },
  "composition-metadata": {
    kind: "composition-metadata",
    lifetime: "composition",
    visibility: ["internal-runtime"],
    boundaryScope: "runtime-internal",
    transientOnly: true,
    persistable: false,
    description: "Transient composition boundary metadata on results",
  },
  "validation-result": {
    kind: "validation-result",
    lifetime: "composition",
    visibility: ["admin-preview", "internal-runtime"],
    boundaryScope: "admin-preview-runtime",
    transientOnly: true,
    persistable: false,
    description: "Static runtime validation semantics for editor/preview context",
  },
  "preview-isolation": {
    kind: "preview-isolation",
    lifetime: "composition",
    visibility: ["admin-preview", "internal-runtime"],
    boundaryScope: "admin-preview-runtime",
    transientOnly: true,
    persistable: false,
    description: "Preview isolation markers and modes",
  },
  "governance-metadata": {
    kind: "governance-metadata",
    lifetime: "composition",
    visibility: ["admin-preview", "internal-runtime"],
    boundaryScope: "admin-preview-runtime",
    transientOnly: true,
    persistable: false,
    description: "Editorial governance hints — not publish enforcement",
  },
  "boundary-enforcement-result": {
    kind: "boundary-enforcement-result",
    lifetime: "request",
    visibility: ["internal-runtime"],
    boundaryScope: "runtime-internal",
    transientOnly: true,
    persistable: false,
    description: "Defensive boundary enforcement outcomes",
  },
  "projection-integrity-result": {
    kind: "projection-integrity-result",
    lifetime: "composition",
    visibility: ["internal-runtime"],
    boundaryScope: "runtime-internal",
    transientOnly: true,
    persistable: false,
    description: "Read model projection integrity check outcomes",
  },
}

export type RuntimeArtifactExposureCheckResult = {
  valid: boolean
  violations: string[]
}

export function getRuntimeArtifactClassification(
  kind: RuntimeArtifactKind,
): RuntimeArtifactClassification {
  return RUNTIME_ARTIFACT_CLASSIFICATIONS[kind]
}

export function getRuntimeArtifactVisibility(
  kind: RuntimeArtifactKind,
): RuntimeArtifactVisibility[] {
  return [...RUNTIME_ARTIFACT_CLASSIFICATIONS[kind].visibility]
}

export function isRuntimeArtifactPersistable(_kind: RuntimeArtifactKind): false {
  return false
}

export function isRuntimeArtifactRendererVisible(kind: RuntimeArtifactKind): boolean {
  return RUNTIME_ARTIFACT_CLASSIFICATIONS[kind].visibility.includes("renderer")
}

export function isRuntimeArtifactAdminPreviewVisible(kind: RuntimeArtifactKind): boolean {
  return RUNTIME_ARTIFACT_CLASSIFICATIONS[kind].visibility.includes("admin-preview")
}

export function isRuntimeArtifactInternalOnly(kind: RuntimeArtifactKind): boolean {
  const visibility = RUNTIME_ARTIFACT_CLASSIFICATIONS[kind].visibility
  return visibility.length === 1 && visibility[0] === "internal-runtime"
}

export function assertRuntimeArtifactTransient(kind: RuntimeArtifactKind): void {
  const classification = RUNTIME_ARTIFACT_CLASSIFICATIONS[kind]
  if (classification.transientOnly !== true || classification.persistable !== false) {
    throw new Error(
      `Runtime artifact "${kind}" must be transient-only (transientOnly=true, persistable=false).`,
    )
  }
}

export function checkRuntimeArtifactExposure(
  kind: RuntimeArtifactKind,
  targetVisibility: RuntimeArtifactVisibility,
): RuntimeArtifactExposureCheckResult {
  const allowed = RUNTIME_ARTIFACT_CLASSIFICATIONS[kind].visibility.includes(targetVisibility)

  if (allowed) {
    return { valid: true, violations: [] }
  }

  return {
    valid: false,
    violations: [
      `Artifact "${kind}" is not exposed to visibility "${targetVisibility}".`,
    ],
  }
}
