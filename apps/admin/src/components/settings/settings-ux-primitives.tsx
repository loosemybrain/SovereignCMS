"use client"

import type { ReactNode } from "react"
import { Info } from "lucide-react"
import { AdminSectionCard } from "@/components/admin-ui"
import type { AdminSectionCardProps } from "@/components/admin-ui/admin-section-card"
import { cn } from "@sovereign-cms/ui"

/** Consistent muted section surface for all settings domains. */
export function SettingsSectionCard(props: AdminSectionCardProps) {
  return <AdminSectionCard variant="muted" {...props} />
}

/** Vertical rhythm for a settings domain tab panel. */
export function SettingsTabPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-5", className)}>{children}</div>
}

type SettingsInlineHintProps = {
  children: ReactNode
  className?: string
}

export function SettingsInlineHint({ children, className }: SettingsInlineHintProps) {
  return (
    <p
      className={cn(
        "flex gap-2 rounded-lg border admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_55%,var(--admin-surface))] px-3 py-2.5 text-xs leading-relaxed admin-text-muted",
        className,
      )}
      role="note"
    >
      <Info
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color-mix(in_oklab,var(--admin-accent)_65%,var(--admin-text-muted))]"
        strokeWidth={2}
        aria-hidden
      />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  )
}

type SettingsNestedItemCardProps = {
  children: ReactNode
  className?: string
}

export function SettingsNestedItemCard({ children, className }: SettingsNestedItemCardProps) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border admin-border bg-[color-mix(in_oklab,var(--admin-surface)_92%,var(--admin-surface-muted))] p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  )
}

type SettingsPreviewFrameProps = {
  label: string
  children: ReactNode
  className?: string
}

/** Static mock chrome for theme/spinner previews — no runtime sandbox. */
export function SettingsPreviewFrame({ label, children, className }: SettingsPreviewFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_40%,var(--admin-surface))] shadow-sm",
        className,
      )}
    >
      <div
        className="flex h-9 min-w-0 items-center gap-2 border-b admin-border px-3"
        aria-hidden
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-red-500/70" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500/70" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500/70" />
        <span className="ml-1 h-3 min-w-0 flex-1 rounded-sm bg-[color-mix(in_oklab,var(--admin-border)_80%,transparent)]" />
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide admin-text-muted">
          {label}
        </span>
      </div>
      <div className="min-w-0 p-5">{children}</div>
    </div>
  )
}
