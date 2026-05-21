import type { LucideIcon } from "lucide-react"
import {
  LayoutGrid,
  Palette,
  Scale,
  Share2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react"
import type { SettingsDomainTab } from "@/components/settings/settings-domain-tabs"

/** Static lucide mapping per settings domain tab (no dynamic component creation). */
export const SETTINGS_DOMAIN_TAB_ICONS: Record<SettingsDomainTab, LucideIcon> = {
  branding: Sparkles,
  appearance: Palette,
  navigationLayout: LayoutGrid,
  socialExternal: Share2,
  legalGovernance: Scale,
  systemRuntime: SlidersHorizontal,
}
