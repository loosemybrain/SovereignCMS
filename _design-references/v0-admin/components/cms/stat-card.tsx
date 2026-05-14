"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react"

// Animated sparkline component
function Sparkline({ 
  data, 
  color = "primary",
  height = 40,
  animated = true 
}: { 
  data: number[]
  color?: "primary" | "emerald" | "amber" | "rose"
  height?: number
  animated?: boolean
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,${height} ${points} 100,${height}`
  
  const colorClasses = {
    primary: "stroke-primary fill-primary/10",
    emerald: "stroke-emerald-500 fill-emerald-500/10",
    amber: "stroke-amber-500 fill-amber-500/10", 
    rose: "stroke-rose-500 fill-rose-500/10"
  }

  return (
    <svg 
      viewBox={`0 0 100 ${height}`} 
      className={cn("w-full overflow-visible", colorClasses[color])}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" className={cn(
            color === "primary" && "stop-color-primary/30",
            color === "emerald" && "stop-color-emerald-500/30",
            color === "amber" && "stop-color-amber-500/30",
            color === "rose" && "stop-color-rose-500/30"
          )} style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#gradient-${color})`}
        className={cn(animated && "animate-[fadeIn_1s_ease-out]")}
      />
      <polyline
        points={points}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          animated && "animate-[drawLine_1.5s_ease-out]",
          "[stroke-dasharray:200] [stroke-dashoffset:0]"
        )}
        style={animated ? {
          strokeDasharray: 200,
          strokeDashoffset: 0,
          animation: 'drawLine 1.5s ease-out forwards'
        } : undefined}
      />
    </svg>
  )
}

// Animated donut/ring chart
function DonutChart({ 
  value, 
  max = 100,
  size = 60,
  strokeWidth = 6,
  color = "primary"
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: "primary" | "emerald" | "amber" | "rose"
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min(value / max, 1)
  const offset = circumference - percentage * circumference

  const colorClasses = {
    primary: "stroke-primary",
    emerald: "stroke-emerald-500",
    amber: "stroke-amber-500",
    rose: "stroke-rose-500"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={cn(colorClasses[color], "transition-all duration-1000 ease-out")}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold">{Math.round(percentage * 100)}%</span>
      </div>
    </div>
  )
}

// Animated bar chart
function MiniBarChart({ 
  data,
  color = "primary",
  height = 32
}: {
  data: number[]
  color?: "primary" | "emerald" | "amber" | "rose"
  height?: number
}) {
  const max = Math.max(...data)
  
  const colorClasses = {
    primary: "bg-primary",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500"
  }

  return (
    <div className="flex items-end gap-1 h-full" style={{ height }}>
      {data.map((value, index) => {
        const barHeight = (value / max) * 100
        return (
          <div
            key={index}
            className={cn(
              "flex-1 rounded-t transition-all duration-500 ease-out",
              colorClasses[color],
              "opacity-60 hover:opacity-100"
            )}
            style={{ 
              height: `${barHeight}%`,
              animationDelay: `${index * 50}ms`,
              animation: 'growUp 0.5s ease-out forwards'
            }}
          />
        )
      })}
    </div>
  )
}

// Activity pulse indicator
function ActivityPulse({ active = true }: { active?: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-3 h-3">
      <span className={cn(
        "absolute inline-flex h-full w-full rounded-full opacity-75",
        active ? "bg-emerald-400 animate-ping" : "bg-muted"
      )} />
      <span className={cn(
        "relative inline-flex rounded-full h-2 w-2",
        active ? "bg-emerald-500" : "bg-muted-foreground"
      )} />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  description?: string
  className?: string
  valueClassName?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  delay?: number
  sparklineData?: number[]
  chartType?: "sparkline" | "donut" | "bars" | "none"
  chartColor?: "primary" | "emerald" | "amber" | "rose"
  chartValue?: number
  chartMax?: number
  showActivity?: boolean
  href?: string
}

export function StatCard({ 
  label, 
  value, 
  description, 
  className,
  valueClassName,
  trend,
  trendValue,
  icon,
  delay = 0,
  sparklineData,
  chartType = "none",
  chartColor = "primary",
  chartValue,
  chartMax,
  showActivity,
  href
}: StatCardProps) {
  const CardWrapper = href ? 'a' : 'div'
  
  // Generate random sparkline data if not provided but chartType is sparkline
  const displaySparklineData = sparklineData || (chartType === "sparkline" 
    ? [4, 6, 8, 5, 9, 7, 10, 8, 12, 9, 11, 13]
    : [])
  
  // Generate random bar data
  const barData = chartType === "bars" 
    ? [3, 7, 5, 9, 6, 8, 4, 7, 9, 6, 8, 10]
    : []

  return (
    <CardWrapper
      href={href}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "group relative rounded-2xl border bg-card overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20",
        "animate-slide-up opacity-0",
        href && "cursor-pointer",
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Subtle border highlight on hover */}
      <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-105">
                {icon}
              </div>
            )}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              {showActivity && (
                <div className="flex items-center gap-1.5 mt-1">
                  <ActivityPulse active />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Live</span>
                </div>
              )}
            </div>
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300",
              trend === "up" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
              trend === "down" && "bg-rose-500/15 text-rose-600 dark:text-rose-400",
              trend === "neutral" && "bg-muted text-muted-foreground"
            )}>
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {trend === "neutral" && <Minus className="h-3 w-3" />}
              {trendValue && <span>{trendValue}</span>}
            </div>
          )}

          {href && (
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>

        {/* Value and Chart Row */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text transition-all duration-300",
              "group-hover:from-primary group-hover:to-primary/70",
              valueClassName
            )}>
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1.5 truncate transition-colors duration-300 group-hover:text-foreground/60">
                {description}
              </p>
            )}
          </div>

          {/* Chart visualization */}
          {chartType === "sparkline" && displaySparklineData.length > 0 && (
            <div className="w-24 h-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkline data={displaySparklineData} color={chartColor} height={40} />
            </div>
          )}

          {chartType === "donut" && chartValue !== undefined && (
            <div className="opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
              <DonutChart value={chartValue} max={chartMax} color={chartColor} />
            </div>
          )}

          {chartType === "bars" && (
            <div className="w-24 h-8 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <MiniBarChart data={barData} color={chartColor} height={32} />
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

// Large feature card for highlighting key metrics
interface FeatureCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  gradient?: "blue" | "emerald" | "amber" | "rose" | "purple"
  sparklineData?: number[]
  delay?: number
}

export function FeatureCard({
  title,
  value,
  subtitle,
  icon,
  gradient = "blue",
  sparklineData,
  delay = 0
}: FeatureCardProps) {
  const gradientClasses = {
    blue: "from-blue-600 to-indigo-600",
    emerald: "from-emerald-600 to-teal-600",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
    purple: "from-purple-600 to-indigo-600"
  }

  return (
    <div 
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "group relative rounded-2xl p-6 overflow-hidden transition-all duration-500",
        "animate-slide-up opacity-0",
        "bg-gradient-to-br",
        gradientClasses[gradient],
        "hover:shadow-2xl hover:-translate-y-1",
        "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100"
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
          {sparklineData && (
            <div className="w-20 h-8 opacity-50">
              <Sparkline data={sparklineData} color="primary" height={32} />
            </div>
          )}
        </div>
        
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <p className="text-white text-4xl font-bold tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-white/60 text-sm mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

interface ConfigGridProps {
  items: Array<{
    label: string
    value: string
    icon?: React.ReactNode
  }>
  className?: string
}

export function ConfigGrid({ items, className }: ConfigGridProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {items.map((item, index) => (
        <div 
          key={item.label} 
          className={cn(
            "group relative p-4 rounded-xl transition-all duration-300",
            "bg-gradient-to-br from-muted/50 to-muted/20",
            "border border-transparent hover:border-primary/20",
            "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start gap-3">
            {item.icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary/70 transition-colors duration-300 group-hover:text-primary group-hover:bg-primary/15">
                {item.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 transition-colors group-hover:text-primary/70">
                {item.label}
              </p>
              <p className="text-sm font-mono font-semibold truncate">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
