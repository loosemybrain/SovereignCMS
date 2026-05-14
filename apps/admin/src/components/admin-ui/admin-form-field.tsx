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
    <div className={cn("group space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-none admin-text transition-colors group-focus-within:admin-accent"
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
        <p className="text-xs leading-relaxed admin-text-muted">{description}</p>
      ) : null}
    </div>
  )
}
