import type { CmsBlock } from "./cms"

export type ContentTemplateDefinition = {
  id: string
  label: string
  description?: string
  category?: string
  blocks: CmsBlock[]
}
