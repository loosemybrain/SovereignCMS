import type { ContentStatus } from "./content-status"

export type NavigationItemType = "page" | "external"

export type NavigationItem = {
  id: string
  tenantId: string
  locale: string
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
