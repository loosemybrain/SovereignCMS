"use client"

import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { EditorPanel } from "./editor-panel"

type EditorHintProps = {
  children: ReactNode
  tone?: "info" | "warning" | "success" | "danger"
}

const toneClasses: Record<NonNullable<EditorHintProps["tone"]>, string> = {
  info: "admin-text",
  warning: "admin-warning",
  success: "text-emerald-700",
  danger: "admin-error",
}

export function EditorHint({ children, tone = "info" }: EditorHintProps) {
  const { messages } = useAdminI18n()
  const c = messages.common
  const role = tone === "danger" ? "alert" : undefined
  const ariaLive = tone === "info" || tone === "success" ? "polite" : undefined
  const prefix: Record<NonNullable<EditorHintProps["tone"]>, string> = {
    info: c.hintInfo,
    warning: c.hintWarning,
    success: c.hintSuccess,
    danger: c.hintDanger,
  }
  const panelVariant = tone === "danger" ? "danger" : tone === "info" ? "accent" : "muted"

  return (
    <EditorPanel variant={panelVariant}>
      <p role={role} aria-live={ariaLive} className={cn("text-xs font-medium", toneClasses[tone])}>
        <span className="font-semibold mr-1">{prefix[tone]}:</span>
        {children}
      </p>
    </EditorPanel>
  )
}
