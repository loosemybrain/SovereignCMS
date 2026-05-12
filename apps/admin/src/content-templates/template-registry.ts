import type { ContentTemplateDefinition } from "@sovereign-cms/core"
import { basicPageTemplate } from "./basic-page-template"
import { emptyPageTemplate } from "./empty-page-template"
import { landingPageTemplate } from "./landing-page-template"

export const contentTemplates: ContentTemplateDefinition[] = [
  emptyPageTemplate,
  basicPageTemplate,
  landingPageTemplate,
]
