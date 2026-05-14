import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"
import { AdminSectionCard } from "@/components/admin-ui"

type InspectorSectionProps = {
  title: string
  description?: string
  children: ReactNode
  raw?: boolean
  className?: string
}

export function InspectorSection({
  title,
  description,
  children,
  raw = false,
  className,
}: InspectorSectionProps) {
  return (
    <div className={cn("space-y-0", className)}>
      <AdminSectionCard
        title={title}
        description={description}
        dense={!raw}
        className={cn(raw && "border-dashed opacity-95 shadow-none hover:shadow-none")}
      >
        {children}
      </AdminSectionCard>
    </div>
  )
}
