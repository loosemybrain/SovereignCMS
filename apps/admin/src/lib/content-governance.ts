/**
 * Block-level publish governance — editor-only, non-blocking.
 */

import type { CmsBlock, PublishGovernanceIssue } from "@sovereign-cms/core"
import { deduplicateGovernanceIssues, validateExternalEmbedUrl } from "@sovereign-cms/core"
import {
  blockIssue,
  getArray,
  getString,
  governanceProps,
  normalizeBlockMedia,
  pushHeadlineLengthHint,
  pushLinkHygieneIssues,
  pushMediaNormalizationIssues,
} from "@/lib/governance-checks"

export function getBlockGovernanceIssues(block: CmsBlock | null | undefined): PublishGovernanceIssue[] {
  if (!block) return []

  const props = governanceProps(block)
  const issues: PublishGovernanceIssue[] = []

  switch (block.type) {
    case "cta":
      issues.push(...getCtaIssues(block, props))
      break
    case "feature-grid":
      issues.push(...getFeatureGridIssues(block, props))
      break
    case "image-text":
      issues.push(...getImageTextIssues(block, props))
      break
    case "contact-form":
      issues.push(...getContactFormIssues(block, props))
      break
    case "external-embed":
      issues.push(...getExternalEmbedIssues(block, props))
      break
    case "hero":
      issues.push(...getHeroIssues(block, props))
      break
    case "text":
      issues.push(...getTextIssues(block, props))
      break
  }

  return deduplicateGovernanceIssues(issues)
}

/** @deprecated Use getBlockGovernanceIssues */
export function getBlockGovernanceWarnings(block: CmsBlock | null | undefined) {
  return getBlockGovernanceIssues(block).map((issue) => ({
    id: issue.id,
    severity: issue.severity === "critical" ? ("warning" as const) : issue.severity,
    message: issue.message,
    fieldPath: issue.field,
  }))
}

function getCtaIssues(block: CmsBlock, props: Record<string, unknown>): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []
  const headline = getString(props, "headline")
  const primaryLabel = getString(props, "primaryLabel")
  const secondaryLabel = getString(props, "secondaryLabel")

  if (!headline) {
    issues.push(
      blockIssue(block, {
        id: "cta-no-headline",
        severity: "warning",
        category: "editorial",
        message: "Call-to-action block has no headline. Add context before the buttons.",
        field: "headline",
        suggestion: "A short headline helps visitors understand why they should act.",
      }),
    )
  } else {
    pushHeadlineLengthHint(issues, block, { idPrefix: "cta", field: "headline", headline })
  }

  if (
    primaryLabel &&
    secondaryLabel &&
    primaryLabel.toLowerCase() === secondaryLabel.toLowerCase()
  ) {
    issues.push(
      blockIssue(block, {
        id: "cta-duplicate-labels",
        severity: "info",
        category: "editorial",
        message: "Primary and secondary buttons use the same label. Differentiate them if both are needed.",
      }),
    )
  }

  pushLinkHygieneIssues(issues, block, "cta", props, [
    { urlKey: "primaryHref", labelKey: "primaryLabel", userFacingCta: true, labelWithoutUrlSeverity: "warning" },
    {
      urlKey: "secondaryHref",
      labelKey: "secondaryLabel",
      userFacingCta: true,
      labelWithoutUrlSeverity: "info",
    },
  ])

  return issues
}

function getFeatureGridIssues(block: CmsBlock, props: Record<string, unknown>): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []
  const headline = getString(props, "headline")
  const items = getArray(props, "items")
  const columnsRaw = props.columns
  const columns = typeof columnsRaw === "number" && columnsRaw >= 2 ? columnsRaw : 3

  if (!headline) {
    issues.push(
      blockIssue(block, {
        id: "grid-no-headline",
        severity: "warning",
        category: "editorial",
        message: "Feature grid has no section headline.",
        field: "headline",
      }),
    )
  }

  const validItems = items.filter((item) => {
    if (typeof item !== "object" || !item) return false
    return getString(item as Record<string, unknown>, "title").length > 0
  })

  if (validItems.length === 0) {
    issues.push(
      blockIssue(block, {
        id: "grid-no-items",
        severity: "warning",
        category: "content",
        message: "Feature grid has no complete items. Add at least one titled feature.",
        field: "items",
      }),
    )
  }

  const maxReasonable = columns * 4
  if (validItems.length > maxReasonable) {
    issues.push(
      blockIssue(block, {
        id: "grid-many-items",
        severity: "info",
        category: "editorial",
        message: `Feature grid has many items (${validItems.length}) for ${columns} columns. Consider splitting or reducing.`,
        field: "items",
      }),
    )
  }

  const seenTitles = new Map<string, number>()
  items.forEach((item, index) => {
    if (typeof item !== "object" || !item) return
    const itemRecord = item as Record<string, unknown>
    const title = getString(itemRecord, "title")
    const body = getString(itemRecord, "body")

    if (!title) {
      issues.push(
        blockIssue(block, {
          id: `grid-item-${index}-no-title`,
          severity: "warning",
          category: "content",
          message: `Feature ${index + 1} has no title.`,
          field: "items",
        }),
      )
    } else {
      const key = title.toLowerCase()
      const prev = seenTitles.get(key)
      if (prev !== undefined) {
        issues.push(
          blockIssue(block, {
            id: `grid-item-${index}-dup-title`,
            severity: "info",
            category: "editorial",
            message: `Feature ${index + 1} repeats the title “${title}”.`,
            field: "items",
          }),
        )
      }
      seenTitles.set(key, index)
    }

    if (!body) {
      issues.push(
        blockIssue(block, {
          id: `grid-item-${index}-no-body`,
          severity: "info",
          category: "editorial",
          message: `Feature ${index + 1} has no description.`,
          field: "items",
        }),
      )
    }
  })

  return issues
}

function getImageTextIssues(block: CmsBlock, props: Record<string, unknown>): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []
  const headline = getString(props, "headline")
  const body = getString(props, "body")
  const normalized = normalizeBlockMedia(props, "imageUrl", "imageAlt", "mediaAssetId")

  if (!headline) {
    issues.push(
      blockIssue(block, {
        id: "imgtext-no-headline",
        severity: "warning",
        category: "editorial",
        message: "Image + text block has no headline.",
        field: "headline",
      }),
    )
  }

  if (!body) {
    issues.push(
      blockIssue(block, {
        id: "imgtext-no-body",
        severity: "info",
        category: "editorial",
        message: "Image + text block has no body copy.",
        field: "body",
      }),
    )
  }

  pushMediaNormalizationIssues(issues, block, {
    idPrefix: "imgtext",
    urlField: "imageUrl",
    normalized,
    altField: "imageAlt",
    altValue: getString(props, "imageAlt"),
  })

  pushLinkHygieneIssues(issues, block, "imgtext", props, [
    { urlKey: "ctaHref", labelKey: "ctaLabel", userFacingCta: true },
  ])

  return issues
}

function getContactFormIssues(block: CmsBlock, props: Record<string, unknown>): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []
  const headline = getString(props, "headline")
  const intro = getString(props, "intro")
  const consentLabel = getString(props, "consentLabel")
  const submitLabel = getString(props, "submitLabel")
  const recipientEmail = getString(props, "recipientEmail")

  if (!consentLabel) {
    issues.push(
      blockIssue(block, {
        id: "contact-no-consent",
        severity: "warning",
        category: "accessibility",
        message: "Contact form has no consent text. Visitors should be able to approve data processing.",
        field: "consentLabel",
      }),
    )
  }

  if (!submitLabel) {
    issues.push(
      blockIssue(block, {
        id: "contact-no-submit-label",
        severity: "warning",
        category: "accessibility",
        message: "Contact form has no submit button label.",
        field: "submitLabel",
      }),
    )
  }

  if (!headline && !intro) {
    issues.push(
      blockIssue(block, {
        id: "contact-no-intro",
        severity: "info",
        category: "editorial",
        message: "Contact form has no headline or intro. Consider brief context above the fields.",
        field: "intro",
      }),
    )
  }

  if (!recipientEmail) {
    issues.push(
      blockIssue(block, {
        id: "contact-no-recipient",
        severity: "info",
        category: "editorial",
        message: "No recipient email set; tenant default may apply if configured.",
        field: "recipientEmail",
      }),
    )
  }

  return issues
}

function getExternalEmbedIssues(block: CmsBlock, props: Record<string, unknown>): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []
  const embedUrl = getString(props, "embedUrl")
  const provider = getString(props, "provider") as "google-maps" | "generic" | ""
  const title = getString(props, "title")
  const consentText = getString(props, "consentText")
  const buttonLabel = getString(props, "buttonLabel")

  if (!embedUrl) {
    issues.push(
      blockIssue(block, {
        id: "embed-no-url",
        severity: "critical",
        category: "media",
        message: "External embed has no URL. Add an embed URL before publishing.",
        field: "embedUrl",
      }),
    )
  } else if (isUnsafeEmbedUrl(embedUrl)) {
    issues.push(
      blockIssue(block, {
        id: "embed-unsafe-url",
        severity: "critical",
        category: "media",
        message: "Embed URL uses a blocked or unsafe scheme.",
        field: "embedUrl",
      }),
    )
  } else if (
    provider === "google-maps" ||
    provider === "generic"
  ) {
    if (!validateExternalEmbedUrl({ provider, embedUrl })) {
      issues.push(
        blockIssue(block, {
          id: "embed-url-format",
          severity: "warning",
          category: "content",
          message: "Embed URL does not match the selected provider format.",
          field: "embedUrl",
          suggestion:
            provider === "google-maps"
              ? "Use an HTTPS Google Maps embed URL."
              : "Use an HTTPS URL for generic embeds.",
        }),
      )
    }
  }

  if (!provider) {
    issues.push(
      blockIssue(block, {
        id: "embed-no-provider",
        severity: "warning",
        category: "content",
        message: "External embed has no provider type selected.",
        field: "provider",
      }),
    )
  }

  if (!title) {
    issues.push(
      blockIssue(block, {
        id: "embed-no-title",
        severity: "warning",
        category: "accessibility",
        message: "External embed has no title. Add a short label for context and assistive tech.",
        field: "title",
      }),
    )
  }

  if (!consentText && !buttonLabel) {
    issues.push(
      blockIssue(block, {
        id: "embed-no-consent-copy",
        severity: "warning",
        category: "accessibility",
        message: "External embed has no consent text or button label for loading third-party content.",
        field: "consentText",
      }),
    )
  } else if (!consentText) {
    issues.push(
      blockIssue(block, {
        id: "embed-no-consent",
        severity: "info",
        category: "editorial",
        message: "Consider adding consent text explaining third-party content.",
        field: "consentText",
      }),
    )
  }

  pushLinkHygieneIssues(issues, block, "embed", props, [
    { urlKey: "embedUrl", field: "embedUrl", userFacingCta: false },
  ])

  return issues
}

function isUnsafeEmbedUrl(url: string): boolean {
  const lower = url.trim().toLowerCase()
  return (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("file:")
  )
}

function getHeroIssues(block: CmsBlock, props: Record<string, unknown>): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []
  const headline = getString(props, "headline")

  if (!headline) {
    issues.push(
      blockIssue(block, {
        id: "hero-no-headline",
        severity: "warning",
        category: "editorial",
        message: "Hero block has no headline.",
        field: "headline",
      }),
    )
  } else {
    pushHeadlineLengthHint(issues, block, { idPrefix: "hero", field: "headline", headline })
  }

  const mediaNorm = normalizeBlockMedia(props, "mediaUrl", "mediaAlt", "mediaAssetId")
  pushMediaNormalizationIssues(issues, block, {
    idPrefix: "hero",
    urlField: "mediaUrl",
    normalized: mediaNorm,
    altField: "mediaAlt",
    altValue: getString(props, "mediaAlt"),
  })

  return issues
}

function getTextIssues(block: CmsBlock, props: Record<string, unknown>): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []
  const body = getString(props, "body")

  if (!body) {
    issues.push(
      blockIssue(block, {
        id: "text-no-body",
        severity: "warning",
        category: "content",
        message: "Text block is empty.",
        field: "body",
      }),
    )
  } else if (body.length < 40) {
    issues.push(
      blockIssue(block, {
        id: "text-short-body",
        severity: "info",
        category: "editorial",
        message: "Text block is very short for a content-heavy section.",
        field: "body",
      }),
    )
  }

  return issues
}
