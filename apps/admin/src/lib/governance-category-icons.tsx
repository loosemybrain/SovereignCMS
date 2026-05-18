import type { GovernanceCategory } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import {
  Accessibility,
  FileText,
  Image as ImageIcon,
  MapPin,
  PenLine,
  Search,
} from "lucide-react"

type GovernanceCategoryIconProps = {
  category: GovernanceCategory
  className?: string
}

/** Static lucide mapping per governance category (no dynamic component creation). */
export function GovernanceCategoryIcon({ category, className }: GovernanceCategoryIconProps) {
  const iconClass = cn("h-3.5 w-3.5 shrink-0 opacity-70", className)

  switch (category) {
    case "accessibility":
      return <Accessibility className={iconClass} strokeWidth={2} aria-hidden />
    case "media":
      return <ImageIcon className={iconClass} strokeWidth={2} aria-hidden />
    case "content":
      return <FileText className={iconClass} strokeWidth={2} aria-hidden />
    case "navigation":
      return <MapPin className={iconClass} strokeWidth={2} aria-hidden />
    case "seo":
      return <Search className={iconClass} strokeWidth={2} aria-hidden />
    case "editorial":
      return <PenLine className={iconClass} strokeWidth={2} aria-hidden />
    default: {
      const _exhaustive: never = category
      return _exhaustive
    }
  }
}
