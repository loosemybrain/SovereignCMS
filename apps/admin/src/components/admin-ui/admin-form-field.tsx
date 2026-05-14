import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminFormFieldProps = {
  id: string
  label: string
  description?: string
  required?: boolean
  children: ReactNode
  className?: string
}

/**
 * Label + control + helper text (design-kit layout). Does not replace AdminField validation wiring.
 */
export function AdminFormField({
  id,
  label,
  description,
  required,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div
      className={cn(
        "group/aff admin-inspector-field space-y-2 rounded-lg border border-transparent px-0.5 py-1 transition-[border-color,background-color] duration-200 ease-out focus-within:border-[color-mix(in_oklab,var(--admin-accent)_22%,var(--admin-border))] focus-within:bg-[color-mix(in_oklab,var(--admin-surface-muted)_35%,transparent)] motion-reduce:transition-none",
        className,
      )}
    >
      <label
        htmlFor={id}
        className="block text-sm font-semibold leading-none tracking-tight transition-colors admin-text group-focus-within/aff:admin-accent"
      >
        {label}
        {required ? (
          <span className="ml-0.5 admin-danger" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      <div className="relative">{children}</div>
      {description ? (
        <p className="text-xs leading-relaxed text-[color-mix(in_oklab,var(--admin-text-muted)_96%,var(--admin-text))]">
          {description}
        </p>
      ) : null}
    </div>
  )
}
