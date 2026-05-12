import type { ContentStatus } from "@sovereign-cms/core"

export type PublicNavigationItemViewModel = {
  id: string
  label: string
  type: "page" | "external"
  href: string
  status: ContentStatus
}
