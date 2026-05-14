import { cn } from "@sovereign-cms/ui"
import type { ReactNode } from "react"
import { AdminSparkline, type SparklineColor } from "./admin-sparkline"

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
  /** Sparkline data for mini chart visualization */
  sparklineData?: number[]
  sparklineColor?: SparklineColor
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
  sparklineData,
  sparklineColor = "primary",
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "admin-surface-stat admin-surface-interactive relative overflow-hidden p-5 motion-reduce:hover:translate-y-0",
        "transition-[box-shadow,border-color,transform] duration-200 ease-out motion-reduce:transition-[box-shadow,border-color]",
        variant === "default" &&
          "shadow-sm hover:border-[color-mix(in_oklab,var(--admin-accent)_32%,var(--admin-border))] hover:shadow-md",
        variant === "highlight" &&
          "admin-accent-bg border-[color-mix(in_oklab,var(--admin-accent)_48%,var(--admin-border))] shadow-md hover:shadow-lg",
        showAnimation && "animate-slide-up",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            {icon ? <span className="admin-stat-icon-well shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span> : null}
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] admin-text-muted">{title}</p>
          </div>

          <p
            className={cn(
              "mt-3 font-mono text-3xl font-bold tracking-tight",
              variant === "highlight" ? "admin-accent" : "admin-text",
            )}
          >
            {value}
          </p>

          {(description || trend) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold",
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
              {description && <p className="text-xs leading-relaxed admin-text-muted">{description}</p>}
            </div>
          )}

          {sparklineData && sparklineData.length > 0 ? (
            <div className="admin-stat-sparkline-wrap -mx-0.5 mt-4">
              <AdminSparkline data={sparklineData} color={sparklineColor} animated={showAnimation} />
            </div>
          ) : null}
        </div>

        {chart ? <div className="flex-shrink-0">{chart}</div> : null}
      </div>
    </div>
  )
}
