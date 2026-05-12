import type { ContentTemplateDefinition } from "@sovereign-cms/core"

const templateNow = "2026-05-09T00:00:00.000Z"

export const basicPageTemplate: ContentTemplateDefinition = {
  id: "basic-page-template",
  label: "Basic Page",
  description: "Simple starter with a hero and one text section.",
  category: "Starter",
  blocks: [
    {
      id: "template-basic-hero",
      tenantId: "template",
      pageId: "template-page",
      type: "hero",
      sortOrder: 1,
      props: {
        headline: "Welcome to your new page",
        subline: "Use this starter to quickly publish structured content.",
        mediaAssetId: null,
        mediaUrl: "",
        mediaAlt: "",
      },
      visibility: "visible",
      createdAt: templateNow,
      updatedAt: templateNow,
    },
    {
      id: "template-basic-text",
      tenantId: "template",
      pageId: "template-page",
      type: "text",
      sortOrder: 2,
      props: {
        body: "Replace this text with your introduction or core message.",
      },
      visibility: "visible",
      createdAt: templateNow,
      updatedAt: templateNow,
    },
  ],
}
