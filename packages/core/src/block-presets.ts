/**
 * Curated block presets for content creation.
 * Static TypeScript definitions of pre-configured block props.
 *
 * Presets are resolved only in the admin block-creation flow; public rendering
 * does not resolve presets. Applied props are cloned — preset constants are never mutated.
 */

import type {
  HeroBlockProps,
  TextBlockProps,
  CtaBlockProps,
  FeatureGridBlockProps,
  ImageTextBlockProps,
} from "./blocks"

/** Block types that ship with static presets in `BLOCK_PRESETS`. */
export type SupportedPresetBlockType =
  | "hero"
  | "text"
  | "cta"
  | "feature-grid"
  | "image-text"

export type BlockPreset<TProps extends object = Record<string, unknown>> = {
  id: string
  blockType: SupportedPresetBlockType
  label: string
  description?: string
  props: TProps
}

export const BLOCK_PRESETS: Record<SupportedPresetBlockType, BlockPreset[]> = {
  hero: [
    {
      id: "hero-simple",
      blockType: "hero",
      label: "Simple Headline",
      description: "Minimal hero with headline and subline, no background image.",
      props: {
        headline: "Welcome to our site",
        subline: "Add your tagline or description here",
        mediaAssetId: null,
        mediaUrl: "",
        mediaAlt: "",
      } satisfies HeroBlockProps,
    },
    {
      id: "hero-with-image",
      blockType: "hero",
      label: "Hero with Background",
      description: "Hero section with background image, headline, and subline.",
      props: {
        headline: "Amazing experiences await",
        subline: "Discover what we offer",
        mediaAssetId: null,
        mediaUrl: "",
        mediaAlt: "Hero background image",
      } satisfies HeroBlockProps,
    },
    {
      id: "hero-minimal",
      blockType: "hero",
      label: "Minimal Headline",
      description: "Small, focused hero with short headline only.",
      props: {
        headline: "Hello",
        subline: "",
        mediaAssetId: null,
        mediaUrl: "",
        mediaAlt: "",
      } satisfies HeroBlockProps,
    },
  ],

  text: [
    {
      id: "text-paragraph",
      blockType: "text",
      label: "Single Paragraph",
      description: "Single paragraph of text content.",
      props: {
        body: "This is a paragraph of text content. Add your text here to share information with your audience.",
      } satisfies TextBlockProps,
    },
    {
      id: "text-multiline",
      blockType: "text",
      label: "Multiple Paragraphs",
      description: "Multiple paragraphs with formatting support.",
      props: {
        body: "This is the first paragraph. Add rich content here.\n\nThis is the second paragraph. You can continue with more text.",
      } satisfies TextBlockProps,
    },
    {
      id: "text-snippet",
      blockType: "text",
      label: "Text Snippet",
      description: "Brief text snippet for quick messaging.",
      props: {
        body: "Quick message or callout text goes here.",
      } satisfies TextBlockProps,
    },
  ],

  cta: [
    {
      id: "cta-single-button",
      blockType: "cta",
      label: "Single Button",
      description: "Call-to-action with one primary button.",
      props: {
        eyebrow: "Next Step",
        headline: "Ready to get started?",
        body: "Click the button below to learn more.",
        primaryLabel: "Get Started",
        primaryHref: "/contact",
        secondaryLabel: "",
        secondaryHref: "",
        align: "center",
      } satisfies CtaBlockProps,
    },
    {
      id: "cta-dual-buttons",
      blockType: "cta",
      label: "Dual Buttons",
      description: "Call-to-action with primary and secondary buttons.",
      props: {
        eyebrow: "Take Action",
        headline: "Choose your path",
        body: "Click below to explore your options.",
        primaryLabel: "Primary Action",
        primaryHref: "/primary",
        secondaryLabel: "Learn More",
        secondaryHref: "/learn",
        align: "center",
      } satisfies CtaBlockProps,
    },
    {
      id: "cta-left-aligned",
      blockType: "cta",
      label: "Left-Aligned CTA",
      description: "Left-aligned call-to-action section.",
      props: {
        eyebrow: "Important",
        headline: "Take the next step",
        body: "We're here to help you succeed.",
        primaryLabel: "Contact Us",
        primaryHref: "/contact",
        secondaryLabel: "",
        secondaryHref: "",
        align: "left",
      } satisfies CtaBlockProps,
    },
  ],

  "feature-grid": [
    {
      id: "grid-2col-4items",
      blockType: "feature-grid",
      label: "2-Column Grid (4 Items)",
      description: "Two-column grid with 4 features.",
      props: {
        headline: "Our Features",
        intro: "Discover what makes us special",
        columns: 2,
        items: [
          {
            id: "feature-01a78b2c-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
            title: "Feature One",
            body: "Description of the first feature goes here.",
          },
          {
            id: "feature-11c9d4e5-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
            title: "Feature Two",
            body: "Description of the second feature goes here.",
          },
          {
            id: "feature-22e7f8g9-0h1i-2j3k-4l5m-6n7o8p9q0r1s",
            title: "Feature Three",
            body: "Description of the third feature goes here.",
          },
          {
            id: "feature-33f6a2b1-0c3d-4e5f-6g7h-8i9j0k1l2m3n",
            title: "Feature Four",
            body: "Description of the fourth feature goes here.",
          },
        ],
      } satisfies FeatureGridBlockProps,
    },
    {
      id: "grid-3col-6items",
      blockType: "feature-grid",
      label: "3-Column Grid (6 Items)",
      description: "Three-column grid with 6 features.",
      props: {
        headline: "Key Benefits",
        intro: "Everything you need in one place",
        columns: 3,
        items: [
          {
            id: "benefit-4a5b6c7d-8e9f-0g1h-2i3j-4k5l6m7n8o9p",
            title: "Benefit One",
            body: "Explanation of the first benefit.",
          },
          {
            id: "benefit-5b6c7d8e-9f0g-1h2i-3j4k-5l6m7n8o9p0q",
            title: "Benefit Two",
            body: "Explanation of the second benefit.",
          },
          {
            id: "benefit-6c7d8e9f-0g1h-2i3j-4k5l-6m7n8o9p0q1r",
            title: "Benefit Three",
            body: "Explanation of the third benefit.",
          },
          {
            id: "benefit-7d8e9f0g-1h2i-3j4k-5l6m-7n8o9p0q1r2s",
            title: "Benefit Four",
            body: "Explanation of the fourth benefit.",
          },
          {
            id: "benefit-8e9f0g1h-2i3j-4k5l-6m7n-8o9p0q1r2s3t",
            title: "Benefit Five",
            body: "Explanation of the fifth benefit.",
          },
          {
            id: "benefit-9f0g1h2i-3j4k-5l6m-7n8o-9p0q1r2s3t4u",
            title: "Benefit Six",
            body: "Explanation of the sixth benefit.",
          },
        ],
      } satisfies FeatureGridBlockProps,
    },
    {
      id: "grid-4col-8items",
      blockType: "feature-grid",
      label: "4-Column Grid (8 Items)",
      description: "Four-column grid with 8 features.",
      props: {
        headline: "Highlights",
        intro: "Our comprehensive offering",
        columns: 4,
        items: [
          {
            id: "item-0a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            title: "Item One",
            body: "Detail about item one.",
          },
          {
            id: "item-1b2c3d4e-5f6g-7h8i-9j0k-1l2m3n4o5p6q",
            title: "Item Two",
            body: "Detail about item two.",
          },
          {
            id: "item-2c3d4e5f-6g7h-8i9j-0k1l-2m3n4o5p6q7r",
            title: "Item Three",
            body: "Detail about item three.",
          },
          {
            id: "item-3d4e5f6g-7h8i-9j0k-1l2m-3n4o5p6q7r8s",
            title: "Item Four",
            body: "Detail about item four.",
          },
          {
            id: "item-4e5f6g7h-8i9j-0k1l-2m3n-4o5p6q7r8s9t",
            title: "Item Five",
            body: "Detail about item five.",
          },
          {
            id: "item-5f6g7h8i-9j0k-1l2m-3n4o-5p6q7r8s9t0u",
            title: "Item Six",
            body: "Detail about item six.",
          },
          {
            id: "item-6g7h8i9j-0k1l-2m3n-4o5p-6q7r8s9t0u1v",
            title: "Item Seven",
            body: "Detail about item seven.",
          },
          {
            id: "item-7h8i9j0k-1l2m-3n4o-5p6q-7r8s9t0u1v2w",
            title: "Item Eight",
            body: "Detail about item eight.",
          },
        ],
      } satisfies FeatureGridBlockProps,
    },
  ],

  "image-text": [
    {
      id: "imgtext-image-left",
      blockType: "image-text",
      label: "Image Left",
      description: "Image positioned on the left with text on the right.",
      props: {
        headline: "See the Difference",
        body: "Place your descriptive text here. Explain the benefits and features of your offering.",
        imageUrl: "",
        imageAlt: "",
        imagePosition: "left",
        ctaLabel: "Learn More",
        ctaHref: "/learn",
      } satisfies ImageTextBlockProps,
    },
    {
      id: "imgtext-image-right",
      blockType: "image-text",
      label: "Image Right",
      description: "Image positioned on the right with text on the left.",
      props: {
        headline: "Transform Your Experience",
        body: "Share your story and vision. Connect with your audience through compelling visuals and text.",
        imageUrl: "",
        imageAlt: "",
        imagePosition: "right",
        ctaLabel: "Discover More",
        ctaHref: "/discover",
      } satisfies ImageTextBlockProps,
    },
    {
      id: "imgtext-minimal",
      blockType: "image-text",
      label: "Minimal Image Text",
      description: "Simple image and text combination without call-to-action.",
      props: {
        headline: "About Us",
        body: "Tell your story in a compelling way.",
        imageUrl: "",
        imageAlt: "",
        imagePosition: "right",
        ctaLabel: "",
        ctaHref: "",
      } satisfies ImageTextBlockProps,
    },
  ],
}

const PRESET_BLOCK_TYPE_KEYS = new Set<string>([
  "hero",
  "text",
  "cta",
  "feature-grid",
  "image-text",
])

export function isSupportedPresetBlockType(
  blockType: string,
): blockType is SupportedPresetBlockType {
  return PRESET_BLOCK_TYPE_KEYS.has(blockType)
}

/**
 * Returns presets for a block type that participates in `BLOCK_PRESETS`.
 * Other block types get an empty list.
 */
export function getPresetsForBlockType(blockType: string): BlockPreset[] {
  if (!isSupportedPresetBlockType(blockType)) {
    return []
  }
  return BLOCK_PRESETS[blockType]
}

/**
 * Looks up a preset by id within a single block type only (no cross-type matching).
 */
export function getPresetForBlockType(
  blockType: SupportedPresetBlockType,
  presetId: string,
): BlockPreset | undefined {
  return BLOCK_PRESETS[blockType].find((p) => p.id === presetId)
}

/**
 * Clone props for a new editor block without mutating shared template objects.
 * Shallow-clones top-level props; clones `feature-grid` `items` with per-item spreads.
 */
export function cloneBlockPropsForNewBlock(
  blockType: string,
  props: Record<string, unknown>,
): Record<string, unknown> {
  if (blockType === "feature-grid") {
    const rawItems = props["items"]
    const clonedItems = Array.isArray(rawItems)
      ? rawItems.map((item) =>
          item !== null && typeof item === "object"
            ? { ...(item as Record<string, unknown>) }
            : item,
        )
      : rawItems
    return { ...props, items: clonedItems }
  }
  return { ...props }
}
