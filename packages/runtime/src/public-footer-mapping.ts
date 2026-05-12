import type { TenantSettings } from "@sovereign-cms/core"
import type { PublicFooterViewModel } from "./public-footer-view-model"

function normalizeHrefKey(href: string): string {
  const t = href.trim()
  if (t === "") {
    return ""
  }
  const noTrail = t.replace(/\/+$/, "")
  return noTrail.length > 0 ? noTrail : "/"
}

export function mapSettingsToPublicFooterViewModel(input: {
  settings: TenantSettings
  navigationItems: Array<{
    label: string
    href: string
  }>
  locale: string
}): PublicFooterViewModel {
  const { settings, navigationItems, locale } = input
  const contact = settings.contact

  const addressParts = [
    contact.addressLine1,
    contact.addressLine2,
    contact.postalCode,
    contact.city,
    contact.country,
  ]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter((part) => part.length > 0)

  const address = addressParts.join(", ")

  const legalLinks: PublicFooterViewModel["legalLinks"] = []

  const imprint = settings.legal.imprintSlug?.trim()
  if (imprint) {
    legalLinks.push({
      label: "Impressum",
      href: `/${locale}/${imprint}`,
    })
  }

  const privacy = settings.legal.privacySlug?.trim()
  if (privacy) {
    legalLinks.push({
      label: "Datenschutz",
      href: `/${locale}/${privacy}`,
    })
  }

  const cookies = settings.legal.cookieSlug?.trim()
  if (cookies) {
    legalLinks.push({
      label: "Cookies",
      href: `/${locale}/${cookies}`,
    })
  }

  const legalHrefKeys = new Set(legalLinks.map((link) => normalizeHrefKey(link.href)))
  const navDedupedByHref: typeof navigationItems = []
  const seenNavKeys = new Set<string>()
  for (const item of navigationItems) {
    const key = normalizeHrefKey(item.href)
    if (legalHrefKeys.has(key) || seenNavKeys.has(key)) {
      continue
    }
    seenNavKeys.add(key)
    navDedupedByHref.push(item)
  }

  return {
    siteName: settings.siteIdentity.siteName,
    tagline: settings.siteIdentity.tagline ?? "",
    contact: {
      email: contact.email ?? "",
      phone: contact.phone ?? "",
      address,
    },
    legalLinks,
    navigationLinks: navDedupedByHref.map((item) => ({
      label: item.label,
      href: item.href,
    })),
    socialLinks: settings.socialLinks.map((link) => ({ ...link })),
    year: new Date().getFullYear(),
  }
}
