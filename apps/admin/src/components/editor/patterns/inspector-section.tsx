import { useId, type ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"
import { EditorPanel } from "./editor-panel"

type InspectorSectionProps = {
  title: string
  description?: string
  children: ReactNode
  raw?: boolean
  className?: string
}

export function InspectorSection({
  title,
  description,
  children,
  raw = false,
  className,
}: InspectorSectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className={cn("space-y-2", className)}>
      <EditorPanel variant={raw ? "muted" : "default"}>
        <h3 id={headingId} className="text-sm font-semibold admin-text">
          {title}
        </h3>
        {description ? <p className="text-xs admin-text-muted mt-1">{description}</p> : null}
      </EditorPanel>
      <div>{children}</div>
    </section>
  )
}
