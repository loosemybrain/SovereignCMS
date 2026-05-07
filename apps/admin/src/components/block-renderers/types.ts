import type { CmsBlock } from "@sovereign-cms/core"
import type { ComponentType } from "react"

export type AdminBlockRenderer = ComponentType<{
  block: CmsBlock
}>
