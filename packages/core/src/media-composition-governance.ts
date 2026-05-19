import type { PublishGovernanceIssue } from "./publish-governance"

export type MediaCompositionCounters = {
  unresolvedMediaCount: number
  externalMediaCount: number
  invalidMediaCount: number
}

/** Non-blocking page-level hints from runtime media composition (Phase 77). */
export function mediaCompositionGovernanceIssues(
  counters: MediaCompositionCounters,
): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []

  if (counters.unresolvedMediaCount > 0) {
    issues.push({
      id: "page-media-unresolved",
      severity: "info",
      category: "media",
      scope: "page",
      message: `${counters.unresolvedMediaCount} block media reference(s) could not be resolved for this tenant.`,
      suggestion: "Check asset IDs and tenant scope, or add a safe internal or HTTPS image URL.",
    })
  }

  if (counters.invalidMediaCount > 0) {
    issues.push({
      id: "page-media-invalid",
      severity: "warning",
      category: "media",
      scope: "page",
      message: `${counters.invalidMediaCount} block media URL(s) failed safety validation.`,
      suggestion: "Use internal paths (/…) or HTTPS URLs only.",
    })
  }

  return issues
}
