import type { ReactNode } from "react"

type AdminPageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  meta?: ReactNode
}

export function AdminPageHeader({ title, description, actions, meta }: AdminPageHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold admin-text">{title}</h1>
          {description && <p className="text-sm admin-text-muted mt-1">{description}</p>}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
    </div>
  )
}
