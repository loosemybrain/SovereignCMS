import { cn } from "@sovereign-cms/ui"

export type AdminStatCardProps = {
  title: string
  value: string | number
  description?: string
  variant?: "default" | "highlight"
  className?: string
}

/**
 * Metric tile for dashboard-style summaries (presentational only).
 */
export function AdminStatCard({
  title,
  value,
  description,
  variant = "default",
  className,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all duration-200 motion-reduce:transition-none",
        "admin-border admin-surface shadow-sm hover:shadow-md motion-reduce:hover:shadow-sm",
        variant === "highlight" &&
          "border-(--admin-accent) admin-accent-bg shadow-sm",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">{title}</p>
      <p
        className={cn(
          "mt-2 font-mono text-2xl font-bold tracking-tight sm:text-3xl",
          variant === "highlight" ? "admin-accent" : "admin-text",
        )}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-xs leading-snug admin-text-muted">{description}</p>
      ) : null}
    </div>
  )
}
