import type { ReactNode } from "react"
import { AdminStatCard, type SparklineColor } from "@/components/admin-ui"

type DashboardCardProps = {
  title: string
  value: string | number
  description?: string
  variant?: "default" | "highlight"
  icon?: ReactNode
  sparklineData?: number[]
  sparklineColor?: SparklineColor
}

export function DashboardCard({
  title,
  value,
  description,
  variant = "default",
  icon,
  sparklineData,
  sparklineColor = "primary",
}: DashboardCardProps) {
  return (
    <AdminStatCard
      title={title}
      value={value}
      description={description}
      variant={variant}
      icon={icon}
      sparklineData={sparklineData}
      sparklineColor={sparklineColor}
    />
  )
}
