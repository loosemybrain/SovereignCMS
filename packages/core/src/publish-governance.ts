/**
 * Publish governance semantics — types and pure helpers only.
 * Editorial, non-blocking readiness signals (no workflow engine).
 */

import { compareGovernanceIssuesForDisplay } from "./governance-helpers"

export type GovernanceSeverity = "info" | "warning" | "critical"

export type GovernanceCategory =
  | "accessibility"
  | "media"
  | "content"
  | "navigation"
  | "seo"
  | "editorial"

export type GovernanceScope = "page" | "block" | "field"

export type PublishGovernanceIssue = {
  id: string
  severity: GovernanceSeverity
  category: GovernanceCategory
  scope: GovernanceScope
  message: string
  blockId?: string
  field?: string
  suggestion?: string
}

export type PublishGovernanceSummary = {
  total: number
  critical: number
  warnings: number
  infos: number
  readyToPublish: boolean
}

/** Aggregate counts; ready when no critical issues remain. */
export function summarizeGovernanceIssues(issues: PublishGovernanceIssue[]): PublishGovernanceSummary {
  let critical = 0
  let warnings = 0
  let infos = 0

  for (const issue of issues) {
    if (issue.severity === "critical") {
      critical += 1
    } else if (issue.severity === "warning") {
      warnings += 1
    } else {
      infos += 1
    }
  }

  return {
    total: issues.length,
    critical,
    warnings,
    infos,
    readyToPublish: critical === 0,
  }
}

/** Stable display order: critical first, then category. */
export function sortGovernanceIssuesForDisplay(
  issues: PublishGovernanceIssue[],
): PublishGovernanceIssue[] {
  return [...issues].sort(compareGovernanceIssuesForDisplay)
}

/** Drop duplicate issue ids (first wins). */
export function deduplicateGovernanceIssues(issues: PublishGovernanceIssue[]): PublishGovernanceIssue[] {
  const seen = new Set<string>()
  const out: PublishGovernanceIssue[] = []

  for (const issue of issues) {
    if (seen.has(issue.id)) {
      continue
    }
    seen.add(issue.id)
    out.push(issue)
  }

  return out
}
