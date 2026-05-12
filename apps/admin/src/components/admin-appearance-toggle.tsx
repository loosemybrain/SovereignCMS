"use client"

import { useAdminAppearance } from "@/components/admin-appearance-provider"

export function AdminAppearanceToggle() {
  const { appearance, toggleAppearance } = useAdminAppearance()
  const nextLabel = appearance === "dark" ? "Light" : "Dark"

  return (
    <button
      type="button"
      onClick={toggleAppearance}
      aria-label="Toggle admin appearance"
      className="rounded border admin-border admin-surface-muted px-3 py-1 text-xs admin-text admin-focus-ring focus-visible:outline-none"
    >
      {nextLabel}
    </button>
  )
}
