import { cn } from "@sovereign-cms/ui"

export type DonutColor = "primary" | "emerald" | "amber" | "rose"

type AdminDonutChartProps = {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: DonutColor
  label?: string
  className?: string
}

/**
 * Animated donut/ring chart component using SVG.
 * Displays percentage as a circular progress indicator.
 */
export function AdminDonutChart({
  value,
  max = 100,
  size = 60,
  strokeWidth = 6,
  color = "primary",
  label,
  className,
}: AdminDonutChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min(value / max, 1)
  const offset = circumference - percentage * circumference

  // Color classes for different variants
  const colorClasses: Record<DonutColor, { stroke: string; bg: string }> = {
    primary: {
      stroke: "stroke-sky-500",
      bg: "stroke-sky-500/20",
    },
    emerald: {
      stroke: "stroke-emerald-500",
      bg: "stroke-emerald-500/20",
    },
    amber: {
      stroke: "stroke-amber-500",
      bg: "stroke-amber-500/20",
    },
    rose: {
      stroke: "stroke-rose-500",
      bg: "stroke-rose-500/20",
    },
  }

  const colors = colorClasses[color]

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={colors.bg}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            colors.stroke,
            "transition-all duration-1000 ease-out",
            "rounded-full"
          )}
          strokeLinecap="round"
        />
      </svg>

      {label && (
        <div className="mt-2 text-center">
          <p className="text-sm font-semibold admin-text">
            {Math.round(percentage * 100)}%
          </p>
          <p className="text-xs admin-text-muted">{label}</p>
        </div>
      )}
    </div>
  )
}
