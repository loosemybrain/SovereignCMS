import type { ReactNode } from "react"
import { createFieldIds, getDescribedBy } from "@/lib/a11y"

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
    <div className="space-y-1">
      <label className="text-xs font-medium admin-text-muted" htmlFor={ids.inputId}>
        {label}
      </label>
      {children({
        id: ids.inputId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {description ? (
        <p id={ids.descriptionId} className="text-xs admin-text-muted">
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
