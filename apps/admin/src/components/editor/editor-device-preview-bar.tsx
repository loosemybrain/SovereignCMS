"use client"

import { Monitor, Smartphone, Tablet } from "lucide-react"
import { cn } from "@sovereign-cms/ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"

export type EditorDeviceMode = "desktop" | "tablet" | "mobile"

type EditorDevicePreviewBarProps = {
  mode: EditorDeviceMode
  onModeChange: (mode: EditorDeviceMode) => void
  className?: string
}

const MODES: EditorDeviceMode[] = ["desktop", "tablet", "mobile"]

export function EditorDevicePreviewBar({ mode, onModeChange, className }: EditorDevicePreviewBarProps) {
  const w = useAdminI18n().messages.editor.workspace

  const labels: Record<EditorDeviceMode, string> = {
    desktop: w.deviceDesktop,
    tablet: w.deviceTablet,
    mobile: w.deviceMobile,
  }

  const icons: Record<EditorDeviceMode, typeof Monitor> = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  }

  return (
    <div className={cn("admin-editor-device-bar", className)} role="toolbar" aria-label={w.deviceToolbarAria}>
      <div className="inline-flex rounded-md border admin-border p-0.5 admin-gov-nested-surface">
        {MODES.map((deviceMode) => {
          const Icon = icons[deviceMode]
          const active = mode === deviceMode
          return (
            <button
              key={deviceMode}
              type="button"
              onClick={() => onModeChange(deviceMode)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                active
                  ? "admin-text bg-[color-mix(in_oklab,var(--admin-accent)_14%,var(--admin-surface))] shadow-sm"
                  : "admin-text-muted hover:admin-text",
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              <span className="hidden sm:inline">{labels[deviceMode]}</span>
              <span className="sr-only sm:hidden">{labels[deviceMode]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function editorPreviewFrameClass(mode: EditorDeviceMode): string {
  switch (mode) {
    case "tablet":
      return "admin-editor-preview-frame admin-editor-preview-frame--tablet"
    case "mobile":
      return "admin-editor-preview-frame admin-editor-preview-frame--mobile"
    default:
      return "admin-editor-preview-frame admin-editor-preview-frame--desktop"
  }
}
