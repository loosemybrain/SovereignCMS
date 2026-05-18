/**
 * Pure helpers for publish governance checks (no I/O, no DOM, no rule engine).
 */

import type { GovernanceCategory, GovernanceSeverity } from "./publish-governance"

const GENERIC_ALT_TERMS = new Set([
  "image",
  "img",
  "bild",
  "foto",
  "photo",
  "picture",
  "placeholder",
  "grafik",
  "graphic",
  "icon",
])

const VAGUE_LINK_LABELS_WARNING = new Set([
  "click here",
  "click",
  "here",
  "hier klicken",
  "hier",
  "link",
  "read more",
  "weiter",
  "go",
  "los",
])

const VAGUE_LINK_LABELS_INFO = new Set(["mehr", "more", "mehr erfahren", "learn more", "details"])

const UNSAFE_URL_PREFIXES = ["javascript:", "vbscript:", "data:", "file:"]

export function trimGovernanceString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

export function isGovernanceEmpty(value: unknown): boolean {
  return trimGovernanceString(value).length === 0
}

/** First non-empty string from prop keys (headline/title). */
export function extractBlockHeadline(props: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = trimGovernanceString(props[key])
    if (value) return value
  }
  return ""
}

export type GovernanceLinkField = {
  field: string
  url: string
  label?: string
}

/** Collect known link-shaped fields from block props. */
export function extractGovernanceLinkFields(
  props: Record<string, unknown>,
  pairs: Array<{ urlKey: string; labelKey?: string; field?: string }>,
): GovernanceLinkField[] {
  const out: GovernanceLinkField[] = []
  for (const pair of pairs) {
    const url = trimGovernanceString(props[pair.urlKey])
    const label = pair.labelKey ? trimGovernanceString(props[pair.labelKey]) : undefined
    if (!url && !label) continue
    out.push({
      field: pair.field ?? pair.urlKey,
      url,
      label,
    })
  }
  return out
}

export function isGenericAltText(alt: string): boolean {
  const normalized = alt.trim().toLowerCase()
  if (!normalized) return false
  if (GENERIC_ALT_TERMS.has(normalized)) return true
  return GENERIC_ALT_TERMS.has(normalized.replace(/[._-]+/g, " "))
}

export function classifyVagueLinkLabel(label: string): GovernanceSeverity | null {
  const normalized = label.trim().toLowerCase()
  if (!normalized) return null
  if (VAGUE_LINK_LABELS_WARNING.has(normalized)) return "info"
  if (VAGUE_LINK_LABELS_INFO.has(normalized)) return "info"
  if (normalized.length <= 2) return "info"
  return null
}

export function isUnsafeUrlScheme(url: string): boolean {
  const lower = url.trim().toLowerCase()
  if (!lower) return false
  return UNSAFE_URL_PREFIXES.some((prefix) => lower.startsWith(prefix))
}

export function isHashOnlyLink(url: string): boolean {
  const t = url.trim()
  return t === "#" || t === "#!"
}

export function isWhitespaceOnlyUrl(url: string): boolean {
  return url.length > 0 && url.trim().length === 0
}

export function isExternalHttpsLink(url: string): boolean {
  return url.trim().toLowerCase().startsWith("https://")
}

/** Heading length guidance (editorial readiness, not SEO engine). */
export function classifyHeadingLength(
  text: string,
  options?: { warnShortBelow?: number; warnLongAbove?: number },
): "ok" | "short" | "long" {
  const len = text.trim().length
  const short = options?.warnShortBelow ?? 3
  const long = options?.warnLongAbove ?? 120
  if (len === 0) return "ok"
  if (len < short) return "short"
  if (len > long) return "long"
  return "ok"
}

export const GOVERNANCE_SEVERITY_ORDER: Record<GovernanceSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
}

export const GOVERNANCE_CATEGORY_ORDER: Record<GovernanceCategory, number> = {
  accessibility: 0,
  editorial: 1,
  content: 2,
  media: 3,
  seo: 4,
  navigation: 5,
}

export function compareGovernanceIssuesForDisplay(
  a: { severity: GovernanceSeverity; category: GovernanceCategory },
  b: { severity: GovernanceSeverity; category: GovernanceCategory },
): number {
  const bySeverity = GOVERNANCE_SEVERITY_ORDER[a.severity] - GOVERNANCE_SEVERITY_ORDER[b.severity]
  if (bySeverity !== 0) return bySeverity
  return GOVERNANCE_CATEGORY_ORDER[a.category] - GOVERNANCE_CATEGORY_ORDER[b.category]
}
