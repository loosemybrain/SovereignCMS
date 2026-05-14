import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminFeatureCardProps = {
  children: ReactNode
  className?: string
  /** When true, applies selected accent border (e.g. preset chosen). */
  selected?: boolean
}

/** Shared classes for `<button className={adminFeatureCardClassNames(...)} />` wrappers. */
export function adminFeatureCardClassNames(selected?: boolean, className?: string) {
  return cn(
    "rounded-lg border-2 px-3 py-2 text-left transition-all duration-200 motion-reduce:transition-none",
    "admin-focus-ring focus-visible:outline-none",
    selected
      ? "border-(--admin-accent) admin-accent-bg shadow-sm"
      : "border-(--admin-border) admin-surface hover:border-[color-mix(in_oklab,var(--admin-accent)_55%,var(--admin-border))] hover:shadow-sm active:scale-[0.99] motion-reduce:active:scale-100",
    className,
  )
}

/**
 * Compact interactive card surface (block palette presets, feature tiles).
 */
export function AdminFeatureCard({ children, className, selected }: AdminFeatureCardProps) {
  return (
    <div className={adminFeatureCardClassNames(selected, className)}>{children}</div>
  )
}
