import { AdminStatCard } from "@/components/admin-ui"

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
    <AdminStatCard
      title={title}
      value={value}
      description={description}
      variant={variant}
    />
  )
}
