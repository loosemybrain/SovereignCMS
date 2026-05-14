import { cn } from "@sovereign-cms/ui"
import type { ReactNode } from "react"

export type AdminStatCardProps = {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    direction: "up" | "down" | "neutral"
  }
  variant?: "default" | "highlight"
  className?: string
  icon?: ReactNode
  chart?: ReactNode
  showAnimation?: boolean
}

/**
 * Metric tile for dashboard-style summaries with optional charts and trends.
 */
export function AdminStatCard({
  title,
  value,
  description,
  trend,
  variant = "default",
  className,
  icon,
  chart,
  showAnimation = true,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 transition-all duration-300",
        "admin-border admin-surface hover:shadow-md",
        variant === "highlight" && "admin-accent-bg admin-accent border-admin-accent glow-sm",
        showAnimation && "animate-slide-up",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {icon && <div className="text-lg">{icon}</div>}
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">
              {title}
            </p>
          </div>

          <p
            className={cn(
              "mt-3 font-mono text-3xl font-bold tracking-tight",
              variant === "highlight" ? "admin-accent-foreground" : "admin-text",
            )}
          >
            {value}
          </p>

          {(description || trend) && (
            <div className="mt-3 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "text-xs font-semibold",
                    trend.direction === "up" && "text-emerald-500",
                    trend.direction === "down" && "text-red-500",
                    trend.direction === "neutral" && "admin-text-muted",
                  )}
                >
                  {trend.direction === "up" && "↑"}
                  {trend.direction === "down" && "↓"}
                  {trend.direction === "neutral" && "→"}
                  {trend.value}%
                </span>
              )}
              {description && <p className="text-xs admin-text-muted">{description}</p>}
            </div>
          )}
        </div>

        {chart && <div className="flex-shrink-0">{chart}</div>}
      </div>
    </div>
  )
}
