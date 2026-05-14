import { cn } from "@sovereign-cms/ui"

export type SparklineColor = "primary" | "emerald" | "amber" | "rose"

type AdminSparklineProps = {
  data: number[]
  color?: SparklineColor
  height?: number
  animated?: boolean
  className?: string
}

/**
 * Animated sparkline chart component using SVG.
 * Displays a mini line chart with area fill.
 */
export function AdminSparkline({
  data,
  color = "primary",
  height = 40,
  animated = true,
  className,
}: AdminSparklineProps) {
  if (data.length === 0) {
    return null
  }

  // Calculate scaling
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  // Generate SVG path points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(" ")

  // Area fill points
  const areaPoints = `0,${height} ${points} 100,${height}`

  // Color classes for different variants
  const colorClasses: Record<SparklineColor, { stroke: string; fill: string; gradient: string }> = {
    primary: {
      stroke: "stroke-sky-500",
      fill: "fill-sky-500/10",
      gradient: "stop-color: rgb(14, 165, 233); stop-opacity: 0.3",
    },
    emerald: {
      stroke: "stroke-emerald-500",
      fill: "fill-emerald-500/10",
      gradient: "stop-color: rgb(16, 185, 129); stop-opacity: 0.3",
    },
    amber: {
      stroke: "stroke-amber-500",
      fill: "fill-amber-500/10",
      gradient: "stop-color: rgb(217, 119, 6); stop-opacity: 0.3",
    },
    rose: {
      stroke: "stroke-rose-500",
      fill: "fill-rose-500/10",
      gradient: "stop-color: rgb(244, 63, 94); stop-opacity: 0.3",
    },
  }

  const colors = colorClasses[color]

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      className={cn("w-full h-8 overflow-visible", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={`sparkline-gradient-${color}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: colors.gradient.split(";")[0].split(":")[1], stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: colors.gradient.split(";")[0].split(":")[1], stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill={`url(#sparkline-gradient-${color})`}
        className={cn(animated && "animate-[fadeIn_1s_ease-out]")}
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(colors.stroke, animated && "animate-[drawLine_1.5s_ease-out]")}
        style={
          animated
            ? {
                strokeDasharray: "200",
                strokeDashoffset: "0",
              }
            : undefined
        }
      />
    </svg>
  )
}
