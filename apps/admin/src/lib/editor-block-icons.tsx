import type { LucideIcon } from "lucide-react"
import { Box, Globe, Image as ImageIcon, LayoutGrid, Mail, Megaphone, Sparkles, Type } from "lucide-react"

const BLOCK_TYPE_ICONS: Record<string, LucideIcon> = {
  hero: Sparkles,
  text: Type,
  "contact-form": Mail,
  "external-embed": Globe,
  cta: Megaphone,
  "feature-grid": LayoutGrid,
  "image-text": ImageIcon,
}

export function getEditorBlockTypeIcon(blockType: string): LucideIcon {
  return BLOCK_TYPE_ICONS[blockType] ?? Box
}

type EditorBlockTypeIconProps = {
  blockType: string
  className?: string
}

/** Stable icon element for block types (satisfies react-hooks/static-components). */
export function EditorBlockTypeIcon({ blockType, className }: EditorBlockTypeIconProps) {
  const Icon = BLOCK_TYPE_ICONS[blockType] ?? Box
  return <Icon className={className} strokeWidth={2} aria-hidden />
}
