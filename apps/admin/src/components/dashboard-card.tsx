import { AdminStatCard, type SparklineColor } from "@/components/admin-ui"

type DashboardCardProps = {
  title: string
  value: string | number
  description?: string
  variant?: "default" | "highlight"
  sparklineData?: number[]
  sparklineColor?: SparklineColor
}

export function DashboardCard({
  title,
  value,
  description,
  variant = "default",
  sparklineData,
  sparklineColor = "primary",
}: DashboardCardProps) {
  return (
    <AdminStatCard
      title={title}
      value={value}
      description={description}
      variant={variant}
      sparklineData={sparklineData}
      sparklineColor={sparklineColor}
    />
  )
}
