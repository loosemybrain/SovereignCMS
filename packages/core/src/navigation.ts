import type { ContentStatus } from "./content-status"

export type NavigationItemType = "page" | "external"

export type NavigationScope = "main" | "footer"

export type NavigationItem = {
  id: string
  tenantId: string
  locale: string
  scope: NavigationScope
  label: string
  type: NavigationItemType
  pageId?: string
  href?: string
  sortOrder: number
  status: ContentStatus
  createdAt: string
  updatedAt: string
}

export type CreateNavigationItemInput = {
  tenantId: string
  locale: string
  label: string
  type: NavigationItemType
  pageId?: string
  href?: string
  scope?: NavigationScope
}

export type CreateNavigationItemResult = {
  success: boolean
  item: NavigationItem
  createdAt: string
  persisted: boolean
}

export function validateNavigationLabel(label: string): boolean {
  return label.trim().length > 0
}

export function validateExternalHref(href: string): boolean {
  const value = href.trim()
  if (!value) return false
  return value.startsWith("https://") || value.startsWith("http://") || value.startsWith("/")
}
