import type { z } from "zod"
import type { CmsBlock } from "./cms"
import type { ExternalEmbedProps } from "./external-embed"

/** Technischer Block-Typbezeichner (z. B. "hero", "richtext"). */
export type BlockType = string

export type BlockInstance<TProps extends Record<string, unknown> = Record<string, unknown>> = {
  id: CmsBlock["id"]
  type: BlockType
  props: TProps
}

export type BlockDefinition<TProps extends Record<string, unknown> = Record<string, unknown>> = {
  type: BlockType
  label: string
  /** Optionales Zod-Schema für Props-Validierung im Admin / bei Imports. */
  propsSchema?: z.ZodType<TProps>
  defaultProps: TProps
}

/** Props für Contact Form Block */
export type ContactFormBlockProps = {
  headline?: string
  intro?: string
  submitLabel?: string
  successMessage?: string
  consentLabel?: string
  recipientEmail?: string
}

/** Props für External Embed Block */
export type ExternalEmbedBlockProps = ExternalEmbedProps

/** Props für CTA Block */
export type CtaBlockProps = {
  eyebrow?: string
  headline?: string
  body?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  align?: "left" | "center"
}

/** Item für Feature Grid Block */
export type FeatureGridItem = {
  id: string
  title: string
  body?: string
}

/** Props für Feature Grid Block */
export type FeatureGridBlockProps = {
  headline?: string
  intro?: string
  columns?: 2 | 3 | 4
  items: FeatureGridItem[]
}

/** Props für Image Text Block */
export type ImageTextBlockProps = {
  headline?: string
  body?: string
  imageUrl?: string
  imageAlt?: string
  imagePosition?: "left" | "right"
  ctaLabel?: string
  ctaHref?: string
}

/** Props für Hero Block */
export type HeroBlockProps = {
  headline?: string
  subline?: string
  mediaAssetId?: string | null
  mediaUrl?: string
  mediaAlt?: string
}

/** Props für Text Block */
export type TextBlockProps = {
  body?: string
}