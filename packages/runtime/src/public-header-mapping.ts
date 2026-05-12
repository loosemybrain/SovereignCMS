import type { SupportedLocale, TenantSettings } from "@sovereign-cms/core"

import type { PublicHeaderViewModel } from "./public-header-view-model"

function normalizePath(path: string): string {
  const t = path.trim()
  if (t === "" || t === "/") {
    return "/"
  }
  return t.replace(/\/+$/, "") || "/"
}

function swapLocaleInPath(currentPath: string, newLocaleCode: string): string {
  const segments = currentPath.split("/").filter(Boolean)
  if (segments.length === 0) {
    return `/${newLocaleCode}`
  }
  segments[0] = newLocaleCode
  return `/${segments.join("/")}`
}

function isNavigationActive(currentPath: string, href: string): boolean {
  if (!href.startsWith("/")) {
    return false
  }
  const c = normalizePath(currentPath)
  const h = normalizePath(href)
  if (h === "/") {
    return c === "/" || c === ""
  }
  return c === h || c.startsWith(`${h}/`)
}

export function mapSettingsToPublicHeaderViewModel(input: {
  settings: TenantSettings
  navigationItems: Array<{
    label: string
    href: string
  }>
  currentPath: string
  currentLocale: string
  supportedLocales: SupportedLocale[]
}): PublicHeaderViewModel {
  const { settings, navigationItems, currentPath, currentLocale, supportedLocales } = input

  const navigationLinks = navigationItems.map((item) => ({
    label: item.label,
    href: item.href,
    active: isNavigationActive(currentPath, item.href),
  }))

  const localeLinks = supportedLocales.map((loc) => ({
    locale: loc.code,
    href: swapLocaleInPath(currentPath, loc.code),
    active: loc.code === currentLocale,
  }))

  return {
    siteName: settings.siteIdentity.siteName,
    tagline: settings.siteIdentity.tagline ?? "",
    logoUrl: settings.siteIdentity.logoUrl,
    navigationLinks,
    localeLinks,
  }
}
