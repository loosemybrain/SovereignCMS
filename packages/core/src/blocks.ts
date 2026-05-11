import type { z } from "zod"
import type { CmsBlock } from "./cms"

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