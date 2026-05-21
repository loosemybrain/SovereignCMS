/**
 * Runtime exposure discipline (Phase 90).
 * Controls which classified artifacts may appear in which runtime exposure targets/contexts.
 *
 * Not security, access control, policy engine, or middleware — builds on artifact classification (89).
 */

import type { RuntimeArtifactKind } from "./runtime-artifact-classification"
import {
  getRuntimeArtifactClassification,
  isRuntimeArtifactInternalOnly,
} from "./runtime-artifact-classification"

export type RuntimeExposureTarget = "renderer" | "admin-preview" | "internal-runtime"

export type RuntimeExposureContext =
  | "public-runtime"
  | "admin-preview-runtime"
  | "runtime-internal"

export type RuntimeExposureViolationCode =
  | "artifact-not-visible-to-target"
  | "internal-artifact-exposed-to-renderer"
  | "admin-preview-artifact-exposed-to-public"
  | "unknown-exposure-target"
  | "unknown-exposure-context"

export type RuntimeExposureSeverity = "warning" | "error"

export type RuntimeExposureViolation = {
  code: RuntimeExposureViolationCode
  severity: RuntimeExposureSeverity
  message: string
}

export type RuntimeExposureCheckResult = {
  valid: boolean
  violations: RuntimeExposureViolation[]
}

const VALID_EXPOSURE_TARGETS: RuntimeExposureTarget[] = [
  "renderer",
  "admin-preview",
  "internal-runtime",
]

const VALID_EXPOSURE_CONTEXTS: RuntimeExposureContext[] = [
  "public-runtime",
  "admin-preview-runtime",
  "runtime-internal",
]

export type RuntimeArtifactExposureInput = {
  kind: RuntimeArtifactKind
  target: RuntimeExposureTarget
  context: RuntimeExposureContext
}

export function createRuntimeExposureViolation(input: {
  code: RuntimeExposureViolationCode
  severity: RuntimeExposureSeverity
  message: string
}): RuntimeExposureViolation {
  return {
    code: input.code,
    severity: input.severity,
    message: input.message,
  }
}

function exposureResult(violations: RuntimeExposureViolation[]): RuntimeExposureCheckResult {
  return { valid: violations.length === 0, violations }
}

function isKnownExposureTarget(
  target: RuntimeExposureTarget,
): target is RuntimeExposureTarget {
  return VALID_EXPOSURE_TARGETS.includes(target)
}

function isKnownExposureContext(
  context: RuntimeExposureContext,
): context is RuntimeExposureContext {
  return VALID_EXPOSURE_CONTEXTS.includes(context)
}

export function checkRuntimeArtifactExposureForTarget(
  input: RuntimeArtifactExposureInput,
): RuntimeExposureCheckResult {
  const violations: RuntimeExposureViolation[] = []

  if (!isKnownExposureTarget(input.target)) {
    return exposureResult([
      createRuntimeExposureViolation({
        code: "unknown-exposure-target",
        severity: "error",
        message: `Unknown exposure target: ${String(input.target)}.`,
      }),
    ])
  }

  if (!isKnownExposureContext(input.context)) {
    return exposureResult([
      createRuntimeExposureViolation({
        code: "unknown-exposure-context",
        severity: "error",
        message: `Unknown exposure context: ${String(input.context)}.`,
      }),
    ])
  }

  const classification = getRuntimeArtifactClassification(input.kind)
  const visibleToTarget = classification.visibility.includes(input.target)

  if (!visibleToTarget) {
    if (input.target === "renderer" && isRuntimeArtifactInternalOnly(input.kind)) {
      violations.push(
        createRuntimeExposureViolation({
          code: "internal-artifact-exposed-to-renderer",
          severity: "error",
          message: `Artifact "${input.kind}" is internal-runtime only and must not be exposed to renderers.`,
        }),
      )
    } else {
      violations.push(
        createRuntimeExposureViolation({
          code: "artifact-not-visible-to-target",
          severity: "error",
          message: `Artifact "${input.kind}" is not visible to exposure target "${input.target}".`,
        }),
      )
    }
  }

  if (
    input.context === "public-runtime" &&
    classification.boundaryScope === "admin-preview-runtime"
  ) {
    violations.push(
      createRuntimeExposureViolation({
        code: "admin-preview-artifact-exposed-to-public",
        severity: "error",
        message: `Artifact "${input.kind}" is scoped to admin-preview-runtime and must not be exposed in public-runtime context.`,
      }),
    )
  }

  return exposureResult(violations)
}

export function assertRuntimeArtifactExposureAllowed(
  input: RuntimeArtifactExposureInput,
): void {
  const result = checkRuntimeArtifactExposureForTarget(input)

  if (result.valid) {
    return
  }

  throw new Error(
    `Runtime exposure discipline failed: ${result.violations.map((v) => v.message).join(" ")}`,
  )
}

export function isRuntimeArtifactExposureAllowed(
  input: RuntimeArtifactExposureInput,
): boolean {
  return checkRuntimeArtifactExposureForTarget(input).valid
}
