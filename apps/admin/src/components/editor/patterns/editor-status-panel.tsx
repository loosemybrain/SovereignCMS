import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"
import { EditorPanel } from "./editor-panel"

type StatusTone = "default" | "success" | "warning" | "danger" | "muted"

type EditorStatusPanelProps = {
  title?: string
  statusItems: Array<{
    label: string
    value: ReactNode
    tone?: StatusTone
  }>
  className?: string
}

const toneClasses: Record<StatusTone, string> = {
  default: "admin-text",
  success: "text-emerald-700",
  warning: "admin-warning",
  danger: "admin-error",
  muted: "admin-text-muted",
}

export function EditorStatusPanel({ title, statusItems, className }: EditorStatusPanelProps) {
  return (
    <EditorPanel variant="muted" className={className}>
      {title ? <h4 className="text-sm font-semibold admin-text mb-2">{title}</h4> : null}
      <dl className="space-y-1.5">
        {statusItems.map((item) => (
          <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 text-xs">
            <dt className="admin-text-muted leading-5">{item.label}</dt>
            <dd className={cn("font-medium leading-5 text-right", toneClasses[item.tone ?? "default"])}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </EditorPanel>
  )
}
