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
        "space-y-3 rounded-lg border admin-border admin-surface-muted p-4",
        className,
      )}
    >
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide admin-text">
        {title}
      </legend>
      {description ? <p className="-mt-1 text-xs admin-text-muted">{description}</p> : null}
      <div className="space-y-3">{children}</div>
    </fieldset>
  )
}
