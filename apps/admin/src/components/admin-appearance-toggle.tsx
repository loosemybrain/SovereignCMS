"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Check, ChevronDown, Moon, Sun } from "lucide-react"
import { cn } from "@sovereign-cms/ui"
import { useAdminAppearance } from "@/components/admin-appearance-provider"
import type { AdminAppearance } from "@/lib/admin-appearance"

export function AdminAppearanceToggle() {
  const { appearance, setAppearance } = useAdminAppearance()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onDocPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onDocPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDocPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const CurrentIcon = appearance === "dark" ? Moon : Sun
  const currentLabel = appearance === "dark" ? "Dunkel" : "Hell"

  const pick = (next: AdminAppearance) => {
    setAppearance(next)
    setOpen(false)
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={`Darstellung: ${currentLabel}. Menü öffnen.`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-9 min-w-34 items-center gap-2 rounded-lg border admin-border",
          "bg-[color-mix(in_oklab,var(--admin-surface-muted)_72%,var(--admin-surface))] px-2.5 text-xs font-semibold tracking-tight admin-text",
          "shadow-sm transition-[border-color,box-shadow,background-color] duration-150 motion-reduce:transition-none",
          "hover:border-[color-mix(in_oklab,var(--admin-accent)_42%,var(--admin-border))] hover:shadow-md",
          "admin-focus-ring focus-visible:outline-none",
          open && "border-[color-mix(in_oklab,var(--admin-accent)_48%,var(--admin-border))] shadow-md",
        )}
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--admin-surface-muted)_80%,var(--admin-surface))] text-(--admin-accent)"
          aria-hidden
        >
          <CurrentIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
        </span>
        <span className="min-w-0 flex-1 truncate text-left">{currentLabel}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
          )}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Darstellung wählen"
          className={cn(
            "absolute right-0 z-30 mt-1.5 w-46 overflow-hidden rounded-xl border admin-border admin-surface py-1 shadow-lg",
            "backdrop-blur-md supports-backdrop-filter:bg-[color-mix(in_oklab,var(--admin-surface)_88%,transparent)]",
          )}
        >
          <ThemeMenuRow
            mode="light"
            appearance={appearance}
            icon={<Sun className="h-4 w-4" strokeWidth={2} aria-hidden />}
            label="Hell"
            description="Helles Admin-Theme"
            onSelect={() => pick("light")}
          />
          <ThemeMenuRow
            mode="dark"
            appearance={appearance}
            icon={<Moon className="h-4 w-4" strokeWidth={2} aria-hidden />}
            label="Dunkel"
            description="Dunkles Admin-Theme"
            onSelect={() => pick("dark")}
          />
        </div>
      ) : null}
    </div>
  )
}

function ThemeMenuRow({
  mode,
  appearance,
  icon,
  label,
  description,
  onSelect,
}: {
  mode: AdminAppearance
  appearance: AdminAppearance
  icon: ReactNode
  label: string
  description: string
  onSelect: () => void
}) {
  const selected = appearance === mode
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-xs admin-focus-ring focus-visible:outline-none",
        "transition-colors duration-150 motion-reduce:transition-none",
        selected
          ? "bg-[color-mix(in_oklab,var(--admin-accent)_14%,var(--admin-surface-muted))] admin-text"
          : "admin-text hover:bg-[color-mix(in_oklab,var(--admin-surface-muted)_88%,var(--admin-surface))]",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-(--admin-accent)",
          selected
            ? "border-[color-mix(in_oklab,var(--admin-accent)_45%,var(--admin-border))] bg-[color-mix(in_oklab,var(--admin-accent-muted)_100%,transparent)]"
            : "border-transparent bg-[color-mix(in_oklab,var(--admin-surface-muted)_90%,transparent)]",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-tight">{label}</span>
        <span className="mt-0.5 block text-[10px] leading-snug admin-text-muted">{description}</span>
      </span>
      {selected ? (
        <Check className="h-4 w-4 shrink-0 text-(--admin-accent)" strokeWidth={2.5} aria-hidden />
      ) : (
        <span className="h-4 w-4 shrink-0" aria-hidden />
      )}
    </button>
  )
}
