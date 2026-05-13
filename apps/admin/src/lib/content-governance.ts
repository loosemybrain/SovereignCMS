/**
 * Lightweight content governance for blocks.
 * Editor-only, non-blocking warnings about block content quality.
 *
 * This system provides helpful hints to editors without enforcing rules.
 * Warnings do not prevent saving or publishing.
 */

import type { CmsBlock } from "@sovereign-cms/core"

/**
 * A single governance warning for a block.
 */
export type GovernanceWarning = {
  id: string
  severity: "info" | "warning"
  message: string
  fieldPath?: string
}

/**
 * Helper: safely get a string prop from block props.
 */
function getString(props: Record<string, unknown>, key: string, fallback = ""): string {
  const value = props[key]
  return typeof value === "string" ? value : fallback
}

/**
 * Helper: safely get an array from block props.
 */
function getArray(props: Record<string, unknown>, key: string): unknown[] {
  const value = props[key]
  return Array.isArray(value) ? value : []
}

/**
 * Get governance warnings for a block.
 * Non-blocking, editor-only hints about block content.
 */
export function getBlockGovernanceWarnings(block: CmsBlock | null | undefined): GovernanceWarning[] {
  if (!block) {
    return []
  }

  const warnings: GovernanceWarning[] = []
  const props = block.props && typeof block.props === "object" ? (block.props as Record<string, unknown>) : {}

  switch (block.type) {
    case "cta":
      warnings.push(...getCtaWarnings(props))
      break
    case "feature-grid":
      warnings.push(...getFeatureGridWarnings(props))
      break
    case "image-text":
      warnings.push(...getImageTextWarnings(props))
      break
    case "contact-form":
      warnings.push(...getContactFormWarnings(props))
      break
    case "external-embed":
      warnings.push(...getExternalEmbedWarnings(props))
      break
    case "hero":
      warnings.push(...getHeroWarnings(props))
      break
    case "text":
      warnings.push(...getTextWarnings(props))
      break
  }

  return warnings
}

/**
 * CTA block governance warnings.
 */
function getCtaWarnings(props: Record<string, unknown>): GovernanceWarning[] {
  const warnings: GovernanceWarning[] = []
  const headline = getString(props, "headline")
  const primaryLabel = getString(props, "primaryLabel")
  const primaryHref = getString(props, "primaryHref")
  const secondaryLabel = getString(props, "secondaryLabel")
  const secondaryHref = getString(props, "secondaryHref")

  if (!headline) {
    warnings.push({
      id: "cta-no-headline",
      severity: "warning",
      message: "CTA block has no headline. Consider adding one for context.",
      fieldPath: "headline",
    })
  }

  if (primaryLabel && !primaryHref) {
    warnings.push({
      id: "cta-primary-no-href",
      severity: "info",
      message: "Primary button has a label but no URL. Add a link or remove the label.",
      fieldPath: "primaryHref",
    })
  }

  if (primaryHref && !primaryLabel) {
    warnings.push({
      id: "cta-primary-no-label",
      severity: "info",
      message: "Primary button has a URL but no label. Add a label or remove the URL.",
      fieldPath: "primaryLabel",
    })
  }

  if (secondaryLabel && !secondaryHref) {
    warnings.push({
      id: "cta-secondary-no-href",
      severity: "info",
      message: "Secondary button has a label but no URL.",
      fieldPath: "secondaryHref",
    })
  }

  if (secondaryHref && !secondaryLabel) {
    warnings.push({
      id: "cta-secondary-no-label",
      severity: "info",
      message: "Secondary button has a URL but no label.",
      fieldPath: "secondaryLabel",
    })
  }

  return warnings
}

/**
 * Feature Grid block governance warnings.
 */
function getFeatureGridWarnings(props: Record<string, unknown>): GovernanceWarning[] {
  const warnings: GovernanceWarning[] = []
  const headline = getString(props, "headline")
  const items = getArray(props, "items")

  if (!headline) {
    warnings.push({
      id: "grid-no-headline",
      severity: "warning",
      message: "Feature Grid has no headline. Consider adding one.",
      fieldPath: "headline",
    })
  }

  // Check if there are valid items
  const validItems = items.filter((item) => {
    if (typeof item !== "object" || !item) return false
    const itemRecord = item as Record<string, unknown>
    return typeof itemRecord.title === "string" && itemRecord.title.trim().length > 0
  })

  if (validItems.length === 0) {
    warnings.push({
      id: "grid-no-items",
      severity: "warning",
      message: "Feature Grid has no items. Add at least one feature.",
      fieldPath: "items",
    })
  }

  // Check items for empty titles/bodies and duplicate IDs
  const seenIds = new Set<string>()
  items.forEach((item, index) => {
    if (typeof item !== "object" || !item) return

    const itemRecord = item as Record<string, unknown>
    const id = itemRecord.id
    const title = itemRecord.title
    const body = itemRecord.body

    // Check for empty title
    if (typeof title !== "string" || title.trim().length === 0) {
      warnings.push({
        id: `grid-item-${index}-no-title`,
        severity: "info",
        message: `Grid item ${index + 1} has no title.`,
        fieldPath: "items",
      })
    }

    // Check for empty body
    if (body === "" || (typeof body === "string" && body.trim().length === 0)) {
      warnings.push({
        id: `grid-item-${index}-no-body`,
        severity: "info",
        message: `Grid item ${index + 1} has no description.`,
        fieldPath: "items",
      })
    }

    // Check for duplicate IDs
    if (typeof id === "string") {
      if (seenIds.has(id)) {
        warnings.push({
          id: `grid-duplicate-id`,
          severity: "warning",
          message: `Grid has duplicate item ID: "${id}". Each item should have a unique ID.`,
          fieldPath: "items",
        })
      }
      seenIds.add(id)
    }
  })

  return warnings
}

/**
 * Image + Text block governance warnings.
 */
function getImageTextWarnings(props: Record<string, unknown>): GovernanceWarning[] {
  const warnings: GovernanceWarning[] = []
  const headline = getString(props, "headline")
  const imageUrl = getString(props, "imageUrl")
  const imageAlt = getString(props, "imageAlt")
  const ctaLabel = getString(props, "ctaLabel")
  const ctaHref = getString(props, "ctaHref")

  if (!headline) {
    warnings.push({
      id: "imgtext-no-headline",
      severity: "warning",
      message: "Image + Text block has no headline.",
      fieldPath: "headline",
    })
  }

  if (imageUrl && !imageAlt) {
    warnings.push({
      id: "imgtext-no-alt",
      severity: "info",
      message: "Image has no alt text. Add alt text for accessibility.",
      fieldPath: "imageAlt",
    })
  }

  if (ctaLabel && !ctaHref) {
    warnings.push({
      id: "imgtext-cta-no-href",
      severity: "info",
      message: "CTA button has a label but no URL.",
      fieldPath: "ctaHref",
    })
  }

  if (ctaHref && !ctaLabel) {
    warnings.push({
      id: "imgtext-cta-no-label",
      severity: "info",
      message: "CTA button has a URL but no label.",
      fieldPath: "ctaLabel",
    })
  }

  return warnings
}

/**
 * Contact Form block governance warnings.
 */
function getContactFormWarnings(props: Record<string, unknown>): GovernanceWarning[] {
  const warnings: GovernanceWarning[] = []
  const consentLabel = getString(props, "consentLabel")
  const recipientEmail = getString(props, "recipientEmail")

  if (!consentLabel) {
    warnings.push({
      id: "contact-no-consent",
      severity: "info",
      message: "Contact form has no consent text. Users should approve data processing.",
      fieldPath: "consentLabel",
    })
  }

  if (!recipientEmail) {
    warnings.push({
      id: "contact-no-recipient",
      severity: "info",
      message: "Contact form has no recipient email. Will use tenant default if available.",
      fieldPath: "recipientEmail",
    })
  }

  return warnings
}

/**
 * External Embed block governance warnings.
 */
function getExternalEmbedWarnings(props: Record<string, unknown>): GovernanceWarning[] {
  const warnings: GovernanceWarning[] = []
  const embedUrl = getString(props, "embedUrl")
  const provider = getString(props, "provider")

  if (!provider) {
    warnings.push({
      id: "embed-no-provider",
      severity: "warning",
      message: "External Embed has no provider specified.",
      fieldPath: "provider",
    })
  }

  if (!embedUrl) {
    warnings.push({
      id: "embed-no-url",
      severity: "info",
      message: "External Embed has no URL. Add an embed URL.",
      fieldPath: "embedUrl",
    })
  }

  return warnings
}

/**
 * Hero block governance warnings.
 */
function getHeroWarnings(props: Record<string, unknown>): GovernanceWarning[] {
  const warnings: GovernanceWarning[] = []
  const headline = getString(props, "headline")

  if (!headline) {
    warnings.push({
      id: "hero-no-headline",
      severity: "warning",
      message: "Hero block has no headline.",
      fieldPath: "headline",
    })
  }

  return warnings
}

/**
 * Text block governance warnings.
 */
function getTextWarnings(props: Record<string, unknown>): GovernanceWarning[] {
  const warnings: GovernanceWarning[] = []
  const body = getString(props, "body")

  if (!body) {
    warnings.push({
      id: "text-no-body",
      severity: "warning",
      message: "Text block is empty.",
      fieldPath: "body",
    })
  }

  return warnings
}
