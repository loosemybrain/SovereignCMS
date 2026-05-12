import type { ContentTemplateDefinition } from "@sovereign-cms/core"

const templateNow = "2026-05-09T00:00:00.000Z"

export const landingPageTemplate: ContentTemplateDefinition = {
  id: "landing-page-template",
  label: "Landing Page",
  description: "Hero plus two structured text sections for features and CTA.",
  category: "Marketing",
  blocks: [
    {
      id: "template-landing-hero",
      tenantId: "template",
      pageId: "template-page",
      type: "hero",
      sortOrder: 1,
      props: {
        headline: "Launch your next campaign",
        subline: "A structured starter for focused landing pages.",
        mediaAssetId: null,
        mediaUrl: "",
        mediaAlt: "",
      },
      visibility: "visible",
      createdAt: templateNow,
      updatedAt: templateNow,
    },
    {
      id: "template-landing-features",
      tenantId: "template",
      pageId: "template-page",
      type: "text",
      sortOrder: 2,
      props: {
        body: "Feature section: summarize your key value propositions in concise bullets.",
      },
      visibility: "visible",
      createdAt: templateNow,
      updatedAt: templateNow,
    },
    {
      id: "template-landing-cta",
      tenantId: "template",
      pageId: "template-page",
      type: "text",
      sortOrder: 3,
      props: {
        body: "Call to action: guide visitors to the next step with one clear action.",
      },
      visibility: "visible",
      createdAt: templateNow,
      updatedAt: templateNow,
    },
  ],
}
