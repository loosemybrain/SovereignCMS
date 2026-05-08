"use client"

import { cn } from "@sovereign-cms/ui"
import { AdminCard } from "@/components/admin-ui"

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
    <AdminCard
      className={cn(
        "p-6 transition-all duration-200",
        variant === "highlight"
          ? "border-blue-800/60 bg-blue-950/30 hover:bg-blue-950/40"
          : "admin-border admin-surface hover:admin-surface-muted",
      )}
    >
      <p className="text-xs font-medium admin-text-muted uppercase tracking-wide">{title}</p>
      <p className={cn("text-3xl font-bold mt-3 font-mono", variant === "highlight" ? "text-blue-300" : "admin-text")}>
        {value}
      </p>
      {description && <p className="text-xs admin-text-muted mt-2">{description}</p>}
    </AdminCard>
  )
}
