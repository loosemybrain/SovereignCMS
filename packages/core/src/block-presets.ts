/**
 * Curated block presets for content creation.
 * Static TypeScript definitions of pre-configured block props.
 *
 * Presets are cloned on apply—props are never mutated.
 * Feature Grid presets use the `items` array with generated UUIDs.
 */

import type {
  HeroBlockProps,
  TextBlockProps,
  CtaBlockProps,
  FeatureGridBlockProps,
  ImageTextBlockProps,
} from "./blocks"

/**
 * A curated preset for a block type.
 * Contains pre-configured props that editors can apply to new blocks.
 */
export type BlockPreset<T extends Record<string, unknown>> = {
  /** Unique identifier for the preset */
  id: string
  /** Human-readable name */
  name: string
  /** Description of the preset's purpose */
  description: string
  /** Pre-configured props for this block type */
  props: T
}

/**
 * All available block presets, organized by block type.
 */
export const BLOCK_PRESETS = {
  hero: [
    {
      id: "hero-simple",
      name: "Simple Headline",
      description: "Minimal hero with headline and subline, no background image.",
      props: {
        headline: "Welcome to our site",
        subline: "Add your tagline or description here",
        mediaAssetId: null,
        mediaUrl: "",
        mediaAlt: "",
      } as HeroBlockProps,
    },
    {
      id: "hero-with-image",
      name: "Hero with Background",
      description: "Hero section with background image, headline, and subline.",
      props: {
        headline: "Amazing experiences await",
        subline: "Discover what we offer",
        mediaAssetId: null,
        mediaUrl: "",
        mediaAlt: "Hero background image",
      } as HeroBlockProps,
    },
    {
      id: "hero-minimal",
      name: "Minimal Headline",
      description: "Small, focused hero with short headline only.",
      props: {
        headline: "Hello",
        subline: "",
        mediaAssetId: null,
        mediaUrl: "",
        mediaAlt: "",
      } as HeroBlockProps,
    },
  ] as BlockPreset<HeroBlockProps>[],

  text: [
    {
      id: "text-paragraph",
      name: "Single Paragraph",
      description: "Single paragraph of text content.",
      props: {
        body: "This is a paragraph of text content. Add your text here to share information with your audience.",
      } as TextBlockProps,
    },
    {
      id: "text-multiline",
      name: "Multiple Paragraphs",
      description: "Multiple paragraphs with formatting support.",
      props: {
        body: "This is the first paragraph. Add rich content here.\n\nThis is the second paragraph. You can continue with more text.",
      } as TextBlockProps,
    },
    {
      id: "text-snippet",
      name: "Text Snippet",
      description: "Brief text snippet for quick messaging.",
      props: {
        body: "Quick message or callout text goes here.",
      } as TextBlockProps,
    },
  ] as BlockPreset<TextBlockProps>[],

  cta: [
    {
      id: "cta-single-button",
      name: "Single Button",
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
      } as CtaBlockProps,
    },
    {
      id: "cta-dual-buttons",
      name: "Dual Buttons",
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
      } as CtaBlockProps,
    },
    {
      id: "cta-left-aligned",
      name: "Left-Aligned CTA",
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
      } as CtaBlockProps,
    },
  ] as BlockPreset<CtaBlockProps>[],

  "feature-grid": [
    {
      id: "grid-2col-4items",
      name: "2-Column Grid (4 Items)",
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
      } as FeatureGridBlockProps,
    },
    {
      id: "grid-3col-6items",
      name: "3-Column Grid (6 Items)",
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
      } as FeatureGridBlockProps,
    },
    {
      id: "grid-4col-8items",
      name: "4-Column Grid (8 Items)",
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
      } as FeatureGridBlockProps,
    },
  ] as BlockPreset<FeatureGridBlockProps>[],

  "image-text": [
    {
      id: "imgtext-image-left",
      name: "Image Left",
      description: "Image positioned on the left with text on the right.",
      props: {
        headline: "See the Difference",
        body: "Place your descriptive text here. Explain the benefits and features of your offering.",
        imageUrl: "",
        imageAlt: "Descriptive text for the image",
        imagePosition: "left",
        ctaLabel: "Learn More",
        ctaHref: "/learn",
      } as ImageTextBlockProps,
    },
    {
      id: "imgtext-image-right",
      name: "Image Right",
      description: "Image positioned on the right with text on the left.",
      props: {
        headline: "Transform Your Experience",
        body: "Share your story and vision. Connect with your audience through compelling visuals and text.",
        imageUrl: "",
        imageAlt: "Descriptive text for the image",
        imagePosition: "right",
        ctaLabel: "Discover More",
        ctaHref: "/discover",
      } as ImageTextBlockProps,
    },
    {
      id: "imgtext-minimal",
      name: "Minimal Image Text",
      description: "Simple image and text combination without call-to-action.",
      props: {
        headline: "About Us",
        body: "Tell your story in a compelling way.",
        imageUrl: "",
        imageAlt: "About image",
        imagePosition: "right",
        ctaLabel: "",
        ctaHref: "",
      } as ImageTextBlockProps,
    },
  ] as BlockPreset<ImageTextBlockProps>[],
}

/**
 * Get presets for a specific block type.
 * Returns empty array if no presets found for the type.
 */
export function getPresetsForBlockType(blockType: string): BlockPreset<Record<string, unknown>>[] {
  const presets = BLOCK_PRESETS[blockType as keyof typeof BLOCK_PRESETS]
  return presets ?? []
}

/**
 * Get a single preset by ID.
 * Returns null if preset not found.
 */
export function getPresetById(presetId: string): BlockPreset<Record<string, unknown>> | null {
  for (const presetList of Object.values(BLOCK_PRESETS)) {
    const preset = presetList.find((p) => p.id === presetId)
    if (preset) {
      return preset as BlockPreset<Record<string, unknown>>
    }
  }
  return null
}
