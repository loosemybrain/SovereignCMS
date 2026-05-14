import type { ReactNode } from "react"
import { createFieldIds, getDescribedBy } from "@/lib/a11y"
import { cn } from "@sovereign-cms/ui"

type FieldRenderProps = {
  id: string
  "aria-describedby"?: string
  "aria-invalid"?: true
}

type AdminFieldProps = {
  id: string
  label: string
  description?: string
  error?: string | null
  children: (fieldProps: FieldRenderProps) => ReactNode
}

export function AdminField({
  id,
  label,
  description,
  error,
  children,
}: AdminFieldProps) {
  const ids = createFieldIds(id)
  const describedBy = getDescribedBy([
    description ? ids.descriptionId : undefined,
    error ? ids.errorId : undefined,
  ])

  return (
    <div className="group/field admin-inspector-field space-y-2 rounded-lg border border-transparent px-0.5 py-0.5 transition-[border-color,background-color] duration-200 ease-out focus-within:border-[color-mix(in_oklab,var(--admin-accent)_35%,var(--admin-border))] focus-within:bg-[color-mix(in_oklab,var(--admin-surface-muted)_55%,transparent)] motion-reduce:transition-none">
      <label
        className={cn(
          "block text-xs font-semibold tracking-tight transition-colors admin-text-muted",
          "group-focus-within/field:admin-text group-focus-within/field:admin-accent",
        )}
        htmlFor={ids.inputId}
      >
        {label}
      </label>
      {children({
        id: ids.inputId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {description ? (
        <p id={ids.descriptionId} className="text-xs leading-relaxed admin-text-muted">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={ids.errorId} className="text-xs text-red-300" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  )
}
