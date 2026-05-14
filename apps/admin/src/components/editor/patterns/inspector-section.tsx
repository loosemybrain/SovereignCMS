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
    <div className={cn("admin-inspector-section space-y-0", className)}>
      <AdminSectionCard
        title={title}
        description={description}
        dense={!raw}
        variant="default"
        className={cn(
          raw && "admin-inspector-debug border-dashed shadow-sm hover:shadow-sm",
        )}
      >
        {children}
      </AdminSectionCard>
    </div>
  )
}
