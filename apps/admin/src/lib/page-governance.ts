/**
 * Page-level publish governance aggregation (pure, in-memory).
 */

import type { CmsBlock, PublishGovernanceIssue, SeoMetadata } from "@sovereign-cms/core"
import {
  deduplicateGovernanceIssues,
  extractBlockHeadline,
  trimGovernanceString,
  validateCanonicalUrl,
  validateExternalHref,
  validateNavigationLabel,
  validatePageSlug,
} from "@sovereign-cms/core"
import { getBlockGovernanceIssues } from "@/lib/content-governance"

export type PageGovernanceNavigationItem = {
  id: string
  label: string
  type: "page" | "external"
  pageId?: string
  href?: string
  scope: "main" | "footer"
}

export function getPageGovernanceIssues(
  blocks: CmsBlock[],
  options?: {
    pageTitle?: string
    pageSlug?: string
    pageId?: string
    pageSeo?: SeoMetadata | null
    navigationItems?: PageGovernanceNavigationItem[]
  },
): PublishGovernanceIssue[] {
  const issues: PublishGovernanceIssue[] = []

  for (const block of blocks) {
    issues.push(...getBlockGovernanceIssues(block))
  }

  const title = trimGovernanceString(options?.pageTitle)
  if (!title) {
    issues.push({
      id: "page-no-title",
      severity: "warning",
      category: "seo",
      scope: "page",
      message: "Page has no title. Add a clear title for editors, navigation, and search.",
      field: "title",
      suggestion: "Use the page title field in the inspector.",
    })
  }

  const slug = trimGovernanceString(options?.pageSlug)
  if (slug) {
    if (!validatePageSlug(slug)) {
      issues.push({
        id: "page-slug-invalid",
        severity: "warning",
        category: "seo",
        scope: "page",
        message: "Page slug format looks invalid. Use lowercase letters, numbers, and hyphens only.",
        field: "slug",
      })
    }
    if (slug.includes("//") || slug.startsWith("-") || slug.endsWith("-")) {
      issues.push({
        id: "page-slug-suspicious",
        severity: "info",
        category: "seo",
        scope: "page",
        message: "Page slug may be hard to read or share. Review for double slashes or edge hyphens.",
        field: "slug",
      })
    }
  } else if (options?.pageSlug !== undefined) {
    issues.push({
      id: "page-slug-missing",
      severity: "warning",
      category: "seo",
      scope: "page",
      message: "Page has no slug.",
      field: "slug",
    })
  }

  const seo = options?.pageSeo
  if (seo) {
    const canonical = trimGovernanceString(seo.canonicalUrl)
    if (canonical && !validateCanonicalUrl(canonical)) {
      issues.push({
        id: "page-seo-canonical-invalid",
        severity: "critical",
        category: "seo",
        scope: "page",
        message: "Canonical URL must start with https://, http://, or /.",
        field: "canonicalUrl",
        suggestion: "Use an absolute HTTPS URL or a site-relative path.",
      })
    }

    const seoTitle = trimGovernanceString(seo.seoTitle)
    const seoDescription = trimGovernanceString(seo.seoDescription)

    if (!seoTitle && !seoDescription) {
      issues.push({
        id: "page-seo-empty",
        severity: "info",
        category: "seo",
        scope: "page",
        message: "SEO title and description are both empty.",
        suggestion: "Open page SEO in the inspector when you are ready to refine metadata.",
      })
    } else {
      if (!seoTitle) {
        issues.push({
          id: "page-seo-title-empty",
          severity: "warning",
          category: "seo",
          scope: "page",
          message: "SEO title is empty. Search results and previews work better with a dedicated title.",
          field: "seoTitle",
        })
      }
      if (!seoDescription) {
        issues.push({
          id: "page-seo-description-empty",
          severity: "info",
          category: "seo",
          scope: "page",
          message: "SEO description is empty. A short summary can improve search snippets.",
          field: "seoDescription",
        })
      }
    }
  }

  const heroLikeCount = blocks.filter((block) => {
    if (block.type !== "hero") return false
    const props =
      block.props && typeof block.props === "object" ? (block.props as Record<string, unknown>) : {}
    return extractBlockHeadline(props, ["headline"]).length > 0
  }).length

  if (heroLikeCount > 1) {
    issues.push({
      id: "page-multiple-heroes",
      severity: "info",
      category: "editorial",
      scope: "page",
      message: `This page has ${heroLikeCount} hero blocks with headlines. Multiple heroes can dilute focus.`,
    })
  }

  const navItems = options?.navigationItems
  const pageId = options?.pageId
  if (navItems && navItems.length > 0) {
    for (const item of navItems) {
      const label = trimGovernanceString(item.label)
      if (!validateNavigationLabel(label)) {
        issues.push({
          id: `nav-empty-label-${item.id}`,
          severity: "warning",
          category: "navigation",
          scope: "page",
          message: `Navigation item (${item.scope}) has an empty label.`,
          field: "label",
        })
      }

      if (item.type === "external") {
        const href = trimGovernanceString(item.href)
        if (href && !validateExternalHref(href)) {
          issues.push({
            id: `nav-external-invalid-href-${item.id}`,
            severity: "warning",
            category: "navigation",
            scope: "page",
            message: `External navigation link (${item.scope}) has an invalid href.`,
            field: "href",
          })
        }
      }
    }

    if (pageId) {
      const linked = navItems.some(
        (item) => item.type === "page" && item.pageId === pageId && validateNavigationLabel(item.label),
      )
      if (!linked) {
        issues.push({
          id: "page-not-in-navigation",
          severity: "info",
          category: "navigation",
          scope: "page",
          message: "This page is not linked in main or footer navigation for the current locale.",
          suggestion: "Add a navigation entry if visitors should find this page from the menu.",
        })
      }
    }
  }

  return deduplicateGovernanceIssues(issues)
}
