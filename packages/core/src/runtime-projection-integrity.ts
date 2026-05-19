/**
 * Runtime projection integrity (Phase 88).
 * Defensive checks for read-model projections — not a projection engine, validator, or query layer.
 *
 * Builds on runtime read models (87) and boundary enforcement (85); does not replace them.
 */

import type { RuntimeBlockReadModel, RuntimeReadModelMode } from "./runtime-read-models"
import { getRuntimeReadModelBoundary } from "./runtime-read-models"

export type RuntimeProjectionIntegrityCode =
  | "read-model-persistence-leakage"
  | "provider-leakage-in-projection"
  | "invalid-read-model-mode"
  | "read-model-mode-mismatch"
  | "artifact-not-allowed"
  | "preview-artifact-in-public-projection"
  | "non-transient-read-model-metadata"

export type RuntimeProjectionIntegritySeverity = "warning" | "error"

export type RuntimeProjectionIntegrityViolation = {
  code: RuntimeProjectionIntegrityCode
  severity: RuntimeProjectionIntegritySeverity
  message: string
}

export type RuntimeProjectionIntegrityResult = {
  valid: boolean
  violations: RuntimeProjectionIntegrityViolation[]
}

const VALID_READ_MODEL_MODES: RuntimeReadModelMode[] = ["public", "admin-preview"]

const READ_MODEL_PERSISTENCE_KEYS = new Set([
  "compositionMetadata",
  "runtimeMetadata",
  "validationResult",
  "previewIsolation",
  "readModelMetadata",
  "runtimeReadModel",
])

const PROJECTION_PROVIDER_LEAKAGE_KEYS = new Set([
  "supabase",
  "bucket",
  "storageProvider",
  "providerClient",
  "signedUrl",
])

export function createRuntimeProjectionIntegrityViolation(input: {
  code: RuntimeProjectionIntegrityCode
  severity: RuntimeProjectionIntegritySeverity
  message: string
}): RuntimeProjectionIntegrityViolation {
  return {
    code: input.code,
    severity: input.severity,
    message: input.message,
  }
}

function integrityResult(
  violations: RuntimeProjectionIntegrityViolation[],
): RuntimeProjectionIntegrityResult {
  return { valid: violations.length === 0, violations }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function findShallowKeyMatch(
  keys: string[],
  candidates: Set<string>,
): string | undefined {
  for (const key of keys) {
    if (candidates.has(key)) {
      return key
    }
    const lower = key.toLowerCase()
    for (const candidate of candidates) {
      if (lower === candidate.toLowerCase()) {
        return key
      }
    }
  }
  return undefined
}

export function detectReadModelPersistenceLeakage(
  props: Record<string, unknown>,
): RuntimeProjectionIntegrityResult {
  const matched = findShallowKeyMatch(Object.keys(props), READ_MODEL_PERSISTENCE_KEYS)

  if (!matched) {
    return integrityResult([])
  }

  return integrityResult([
    createRuntimeProjectionIntegrityViolation({
      code: "read-model-persistence-leakage",
      severity: "warning",
      message: `Read model props contain persistence-oriented key "${matched}"; runtime projections must not be persisted.`,
    }),
  ])
}

export function detectProjectionProviderLeakage(
  input: unknown,
): RuntimeProjectionIntegrityResult {
  if (!isPlainObject(input)) {
    return integrityResult([])
  }

  const matched = findShallowKeyMatch(Object.keys(input), PROJECTION_PROVIDER_LEAKAGE_KEYS)

  if (!matched) {
    return integrityResult([])
  }

  return integrityResult([
    createRuntimeProjectionIntegrityViolation({
      code: "provider-leakage-in-projection",
      severity: "warning",
      message: `Projection contains provider-specific key "${matched}"; read models must stay provider-neutral.`,
    }),
  ])
}

export function enforceRuntimeBlockReadModelIntegrity(
  readModel: RuntimeBlockReadModel,
  options?: { expectedMode?: RuntimeReadModelMode },
): RuntimeProjectionIntegrityResult {
  const violations: RuntimeProjectionIntegrityViolation[] = []

  if (!VALID_READ_MODEL_MODES.includes(readModel.mode)) {
    violations.push(
      createRuntimeProjectionIntegrityViolation({
        code: "invalid-read-model-mode",
        severity: "error",
        message: `Invalid read model mode: ${String(readModel.mode)}.`,
      }),
    )
  } else {
    const boundary = getRuntimeReadModelBoundary(readModel.mode)

    if (readModel.metadata != null && readModel.metadata.transient !== true) {
      violations.push(
        createRuntimeProjectionIntegrityViolation({
          code: "non-transient-read-model-metadata",
          severity: "error",
          message: "Read model metadata must be transient (transient=true).",
        }),
      )
    }

    if (readModel.metadata?.artifacts) {
      for (const artifact of readModel.metadata.artifacts) {
        if (!boundary.artifacts.includes(artifact)) {
          violations.push(
            createRuntimeProjectionIntegrityViolation({
              code: "artifact-not-allowed",
              severity: "error",
              message: `Artifact "${artifact}" is not allowed for read model mode "${readModel.mode}".`,
            }),
          )
        }

        if (readModel.mode === "public" && artifact === "preview-isolation") {
          violations.push(
            createRuntimeProjectionIntegrityViolation({
              code: "preview-artifact-in-public-projection",
              severity: "error",
              message:
                "preview-isolation artifacts are not allowed in public runtime read models.",
            }),
          )
        }
      }
    }
  }

  if (options?.expectedMode != null && readModel.mode !== options.expectedMode) {
    violations.push(
      createRuntimeProjectionIntegrityViolation({
        code: "read-model-mode-mismatch",
        severity: "error",
        message: `Read model mode "${readModel.mode}" does not match expected mode "${options.expectedMode}".`,
      }),
    )
  }

  violations.push(...detectReadModelPersistenceLeakage(readModel.props).violations)
  violations.push(...detectProjectionProviderLeakage(readModel.props).violations)

  if (readModel.metadata != null) {
    violations.push(...detectProjectionProviderLeakage(readModel.metadata).violations)
  }

  return integrityResult(violations)
}

export function assertRuntimeProjectionIntegrity(
  readModel: RuntimeBlockReadModel,
  expectedMode?: RuntimeReadModelMode,
): void {
  const result = enforceRuntimeBlockReadModelIntegrity(readModel, { expectedMode })

  if (result.valid) {
    return
  }

  throw new Error(
    `Runtime projection integrity failed: ${result.violations.map((v) => v.message).join(" ")}`,
  )
}
