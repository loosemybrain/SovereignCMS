import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type AdminFieldGroupProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/**
 * Grouped fields with a clear legend (inspector / settings sections).
 */
export function AdminFieldGroup({ title, description, children, className }: AdminFieldGroupProps) {
  return (
    <fieldset
      className={cn(
        "admin-surface-fieldset admin-inspector-field-group space-y-3 p-4",
        className,
      )}
    >
      <legend className="px-1 text-[11px] font-bold uppercase tracking-[0.12em] admin-text">{title}</legend>
      {description ? <p className="-mt-0.5 text-xs leading-relaxed admin-text-muted">{description}</p> : null}
      <div className="space-y-3">{children}</div>
    </fieldset>
  )
}
