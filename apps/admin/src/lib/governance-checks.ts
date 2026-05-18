/**
 * Shared governance check builders (admin, pure, no I/O).
 */

import type { CmsBlock, PublishGovernanceIssue } from "@sovereign-cms/core"
import {
  classifyHeadingLength,
  classifyVagueLinkLabel,
  extractGovernanceLinkFields,
  isExternalHttpsLink,
  isGenericAltText,
  isHashOnlyLink,
  isGovernanceEmpty,
  isUnsafeUrlScheme,
  isWhitespaceOnlyUrl,
  normalizeMediaReference,
  trimGovernanceString,
  type NormalizedMediaReference,
} from "@sovereign-cms/core"

type BlockIssueInput = Omit<PublishGovernanceIssue, "scope" | "blockId">

export function governanceProps(block: CmsBlock): Record<string, unknown> {
  return block.props && typeof block.props === "object" ? (block.props as Record<string, unknown>) : {}
}

export function blockIssue(block: CmsBlock, input: BlockIssueInput): PublishGovernanceIssue {
  return { ...input, scope: "block", blockId: block.id }
}

export function pushMediaAltIssues(
  issues: PublishGovernanceIssue[],
  block: CmsBlock,
  input: {
    idPrefix: string
    altField: string
    altValue: string
    normalized: NormalizedMediaReference
  },
): void {
  const alt = input.altValue.trim()
  if (input.normalized.requiresAlt && !alt) {
    issues.push(
      blockIssue(block, {
        id: `${input.idPrefix}-no-alt`,
        severity: "warning",
        category: "accessibility",
        message: "Image or media has no alternative text. Add a short description for screen readers.",
        field: input.altField,
        suggestion: "Describe what the image communicates, not just its file name.",
      }),
    )
    return
  }

  if (alt && isGenericAltText(alt)) {
    issues.push(
      blockIssue(block, {
        id: `${input.idPrefix}-generic-alt`,
        severity: "info",
        category: "accessibility",
        message: "Alt text looks generic. Consider a more specific description.",
        field: input.altField,
      }),
    )
  }
}

export function pushMediaNormalizationIssues(
  issues: PublishGovernanceIssue[],
  block: CmsBlock,
  input: {
    idPrefix: string
    urlField: string
    normalized: NormalizedMediaReference
    altField: string
    altValue: string
  },
): void {
  const { normalized, idPrefix, urlField } = input

  if (normalized.sourceType === "invalid") {
    issues.push(
      blockIssue(block, {
        id: `${idPrefix}-media-invalid`,
        severity: "critical",
        category: "media",
        message: normalized.warning ?? "Media URL is invalid or not allowed for rendering.",
        field: urlField,
        suggestion: "Use a site path (/…) or an HTTPS URL from a trusted host.",
      }),
    )
  }

  if (normalized.sourceType === "external") {
    issues.push(
      blockIssue(block, {
        id: `${idPrefix}-media-external`,
        severity: "info",
        category: "media",
        message: "External HTTPS media. Confirm you trust the host; preview may not load it.",
        field: urlField,
      }),
    )
  }

  if (normalized.sourceType === "placeholder") {
    issues.push(
      blockIssue(block, {
        id: `${idPrefix}-media-placeholder`,
        severity: "info",
        category: "media",
        message:
          normalized.warning ??
          "Media asset is referenced without a renderable URL; verify configuration before publishing.",
        field: urlField,
      }),
    )
  }

  pushMediaAltIssues(issues, block, {
    idPrefix,
    altField: input.altField,
    altValue: input.altValue,
    normalized,
  })
}

export function pushHeadlineLengthHint(
  issues: PublishGovernanceIssue[],
  block: CmsBlock,
  input: { idPrefix: string; field: string; headline: string },
): void {
  const kind = classifyHeadingLength(input.headline)
  if (kind === "short") {
    issues.push(
      blockIssue(block, {
        id: `${input.idPrefix}-headline-short`,
        severity: "info",
        category: "editorial",
        message: "Headline is very short. A clearer phrase may help readers scan the page.",
        field: input.field,
      }),
    )
  } else if (kind === "long") {
    issues.push(
      blockIssue(block, {
        id: `${input.idPrefix}-headline-long`,
        severity: "info",
        category: "editorial",
        message: "Headline is quite long. Consider shortening for readability.",
        field: input.field,
      }),
    )
  }
}

export function pushLinkHygieneIssues(
  issues: PublishGovernanceIssue[],
  block: CmsBlock,
  idPrefix: string,
  props: Record<string, unknown>,
  pairs: Array<{
    urlKey: string
    labelKey?: string
    field?: string
    userFacingCta?: boolean
    labelWithoutUrlSeverity?: "warning" | "info"
  }>,
): void {
  const links = extractGovernanceLinkFields(
    props,
    pairs.map((p) => ({ urlKey: p.urlKey, labelKey: p.labelKey, field: p.field })),
  )

  for (const link of links) {
    const field = link.field
    const url = link.url
    const label = link.label ?? ""
    const pair = pairs.find((p) => (p.field ?? p.urlKey) === field)
    const userFacing = pair?.userFacingCta ?? true

    if (url && isUnsafeUrlScheme(url)) {
      issues.push(
        blockIssue(block, {
          id: `${idPrefix}-${field}-unsafe-url`,
          severity: "critical",
          category: "content",
          message: "Link uses an unsafe URL scheme. Use HTTPS or a site path instead.",
          field,
        }),
      )
      continue
    }

    if (isWhitespaceOnlyUrl(url)) {
      issues.push(
        blockIssue(block, {
          id: `${idPrefix}-${field}-blank-url`,
          severity: "warning",
          category: "content",
          message: "Link URL is only whitespace. Add a valid destination or remove the link.",
          field,
        }),
      )
    }

    if (url && isHashOnlyLink(url)) {
      issues.push(
        blockIssue(block, {
          id: `${idPrefix}-${field}-hash-url`,
          severity: "info",
          category: "editorial",
          message: "Link points to “#” only. Use a meaningful destination when possible.",
          field,
        }),
      )
    }

    if (label && isGovernanceEmpty(url)) {
      issues.push(
        blockIssue(block, {
          id: `${idPrefix}-${field}-label-no-url`,
          severity: pair?.labelWithoutUrlSeverity ?? "warning",
          category: "content",
          message: "Link has visible text but no URL. Add a destination or remove the label.",
          field: pair?.urlKey ?? field,
        }),
      )
    }

    if (url && !isGovernanceEmpty(url) && !isWhitespaceOnlyUrl(url) && isGovernanceEmpty(label)) {
      issues.push(
        blockIssue(block, {
          id: `${idPrefix}-${field}-url-no-label`,
          severity: "warning",
          category: "accessibility",
          message: "Link has a URL but no descriptive label. Add text that explains the destination.",
          field: pair?.labelKey ?? field,
        }),
      )
    }

    if (label) {
      const vague = classifyVagueLinkLabel(label)
      if (vague) {
        issues.push(
          blockIssue(block, {
            id: `${idPrefix}-${field}-vague-label`,
            severity: "info",
            category: "accessibility",
            message: "Link label is vague. Use text that describes the destination (not “click here”).",
            field: pair?.labelKey ?? field,
          }),
        )
      }
    }

    if (userFacing && url && isExternalHttpsLink(url)) {
      issues.push(
        blockIssue(block, {
          id: `${idPrefix}-${field}-external-https`,
          severity: "info",
          category: "content",
          message: "External HTTPS link. Consider whether visitors should leave your site here.",
          field,
        }),
      )
    }
  }
}

export function getString(props: Record<string, unknown>, key: string): string {
  return trimGovernanceString(props[key])
}

export function getArray(props: Record<string, unknown>, key: string): unknown[] {
  const value = props[key]
  return Array.isArray(value) ? value : []
}

export function normalizeBlockMedia(props: Record<string, unknown>, urlKey: string, altKey: string, assetKey: string) {
  return normalizeMediaReference({
    imageUrl: props[urlKey],
    imageAlt: props[altKey],
    assetId: props[assetKey],
  })
}
