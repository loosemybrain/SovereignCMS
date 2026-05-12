import { useId, type ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"
import { EditorPanel } from "./editor-panel"

type EditorSectionProps = {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function EditorSection({ title, description, children, actions, className }: EditorSectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className={cn("space-y-3", className)}>
      <EditorPanel variant="default">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id={headingId} className="text-base font-semibold admin-text">
              {title}
            </h3>
            {description ? <p className="text-sm admin-text-muted mt-1">{description}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>
      </EditorPanel>
      <div>{children}</div>
    </section>
  )
}
