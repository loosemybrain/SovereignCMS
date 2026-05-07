import type { Locale, TenantId } from "./cms"
import type { BlockInstance } from "./blocks"

export type RenderContext = {
  mode: "public" | "preview" | "editor"
  tenantId: TenantId
  locale?: Locale
}

export type EditorContext = {
  tenantId: TenantId
  locale: Locale
  pageId: string
  userId?: string
}

export type BlockRenderProps<TProps extends Record<string, unknown> = Record<string, unknown>> = {
  block: BlockInstance<TProps>
  ctx: RenderContext
}

/**
 * Vertrag f�r die �ffentliche Darstellung eines Blocks (framework-neutral).
 */
export type BlockRenderer<TProps extends Record<string, unknown> = Record<string, unknown>> = (
  props: BlockRenderProps<TProps>,
) => unknown