"use client"

import { cn } from "@sovereign-cms/ui"

type DashboardCardProps = {
  title: string
  value: string | number
  description?: string
  variant?: "default" | "highlight"
}

export function DashboardCard({
  title,
  value,
  description,
  variant = "default",
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-6 transition-all duration-200",
        variant === "highlight"
          ? "border-blue-800/60 bg-blue-950/30 hover:bg-blue-950/40"
          : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/50",
      )}
    >
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
      <p className={cn("text-3xl font-bold mt-3 font-mono", variant === "highlight" ? "text-blue-300" : "text-zinc-100")}>
        {value}
      </p>
      {description && <p className="text-xs text-zinc-500 mt-2">{description}</p>}
    </div>
  )
}
