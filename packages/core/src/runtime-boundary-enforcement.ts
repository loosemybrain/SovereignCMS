/**
 * Runtime boundary enforcement (Phase 85).
 * Defensive checks for composition boundaries — not a policy engine, orchestrator, or security framework.
 */

import type {
  RuntimeCompositionBoundary,
  RuntimeCompositionMode,
} from "./runtime-composition-contracts"

export type RuntimeBoundaryViolationCode =
  | "runtime-artifact-persistence-attempt"
  | "provider-leakage-detected"
  | "invalid-composition-boundary"
  | "preview-boundary-used-in-public-runtime"
  | "public-boundary-used-in-preview-runtime"

export type RuntimeBoundaryEnforcementSeverity = "warning" | "error"

export type RuntimeBoundaryViolation = {
  code: RuntimeBoundaryViolationCode
  severity: RuntimeBoundaryEnforcementSeverity
  message: string
}

export type RuntimeBoundaryEnforcementResult = {
  valid: boolean
  violations: RuntimeBoundaryViolation[]
}

const VALID_COMPOSITION_MODES: RuntimeCompositionMode[] = ["public", "admin-preview"]

const RUNTIME_ARTIFACT_PERSISTENCE_KEYS = new Set([
  "compositionMetadata",
  "runtimeMetadata",
  "validationResult",
  "previewIsolation",
])

const PROVIDER_LEAKAGE_KEYS = new Set([
  "supabase",
  "bucket",
  "storageProvider",
  "providerClient",
  "signedUrl",
])

export function createRuntimeBoundaryViolation(input: {
  code: RuntimeBoundaryViolationCode
  severity: RuntimeBoundaryEnforcementSeverity
  message: string
}): RuntimeBoundaryViolation {
  return {
    code: input.code,
    severity: input.severity,
    message: input.message,
  }
}

function enforcementResult(
  violations: RuntimeBoundaryViolation[],
): RuntimeBoundaryEnforcementResult {
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

export function enforceRuntimeCompositionBoundary(
  boundary: RuntimeCompositionBoundary,
): RuntimeBoundaryEnforcementResult {
  const violations: RuntimeBoundaryViolation[] = []

  if (boundary.transientOnly !== true) {
    violations.push(
      createRuntimeBoundaryViolation({
        code: "runtime-artifact-persistence-attempt",
        severity: "error",
        message: "Runtime composition boundary must have transientOnly=true.",
      }),
    )
  }

  if (boundary.persistable !== false) {
    violations.push(
      createRuntimeBoundaryViolation({
        code: "runtime-artifact-persistence-attempt",
        severity: "error",
        message: "Runtime composition boundary must have persistable=false.",
      }),
    )
  }

  if (!VALID_COMPOSITION_MODES.includes(boundary.mode)) {
    violations.push(
      createRuntimeBoundaryViolation({
        code: "invalid-composition-boundary",
        severity: "error",
        message: `Invalid composition boundary mode: ${String(boundary.mode)}.`,
      }),
    )
  }

  return enforcementResult(violations)
}

export function enforceRuntimeCompositionModeMatch(
  boundary: RuntimeCompositionBoundary,
  expectedMode: RuntimeCompositionMode,
): RuntimeBoundaryEnforcementResult {
  if (boundary.mode === expectedMode) {
    return enforcementResult([])
  }

  const code: RuntimeBoundaryViolationCode =
    boundary.mode === "admin-preview" && expectedMode === "public"
      ? "preview-boundary-used-in-public-runtime"
      : boundary.mode === "public" && expectedMode === "admin-preview"
        ? "public-boundary-used-in-preview-runtime"
        : "invalid-composition-boundary"

  return enforcementResult([
    createRuntimeBoundaryViolation({
      code,
      severity: "error",
      message: `Composition boundary mode "${boundary.mode}" does not match expected runtime "${expectedMode}".`,
    }),
  ])
}

export function assertRuntimeBoundaryValid(
  boundary: RuntimeCompositionBoundary,
  expectedMode?: RuntimeCompositionMode,
): void {
  const violations: RuntimeBoundaryViolation[] = [
    ...enforceRuntimeCompositionBoundary(boundary).violations,
  ]

  if (expectedMode !== undefined) {
    violations.push(...enforceRuntimeCompositionModeMatch(boundary, expectedMode).violations)
  }

  if (violations.length === 0) {
    return
  }

  throw new Error(
    `Runtime boundary enforcement failed: ${violations.map((v) => v.message).join(" ")}`,
  )
}

export function detectRuntimeArtifactPersistenceAttempt(
  input: unknown,
): RuntimeBoundaryEnforcementResult {
  if (!isPlainObject(input)) {
    return enforcementResult([])
  }

  const matched = findShallowKeyMatch(
    Object.keys(input),
    RUNTIME_ARTIFACT_PERSISTENCE_KEYS,
  )

  if (!matched) {
    return enforcementResult([])
  }

  return enforcementResult([
    createRuntimeBoundaryViolation({
      code: "runtime-artifact-persistence-attempt",
      severity: "warning",
      message: `Object contains runtime artifact key "${matched}"; runtime metadata must not be persisted.`,
    }),
  ])
}

export function detectProviderLeakage(input: unknown): RuntimeBoundaryEnforcementResult {
  if (!isPlainObject(input)) {
    return enforcementResult([])
  }

  const matched = findShallowKeyMatch(Object.keys(input), PROVIDER_LEAKAGE_KEYS)

  if (!matched) {
    return enforcementResult([])
  }

  return enforcementResult([
    createRuntimeBoundaryViolation({
      code: "provider-leakage-detected",
      severity: "warning",
      message: `Object contains provider-specific key "${matched}"; composition metadata must remain provider-neutral.`,
    }),
  ])
}
