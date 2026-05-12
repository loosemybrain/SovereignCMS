import type { ContentTemplateDefinition } from "@sovereign-cms/core"

export const emptyPageTemplate: ContentTemplateDefinition = {
  id: "empty-page-template",
  label: "Empty Page",
  description: "Start with an empty page and add blocks manually.",
  category: "Starter",
  blocks: [],
}
