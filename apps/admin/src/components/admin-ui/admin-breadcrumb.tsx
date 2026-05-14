import type { ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

export type BreadcrumbItem = {
  label: string
  href?: string
  isCurrentPage?: boolean
}

type AdminBreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
  separator?: ReactNode
}

/**
 * Navigation breadcrumb trail with accessible markup.
 */
export function AdminBreadcrumb({
  items,
  className,
  separator = "/",
}: AdminBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1", className)}
    >
      <ol className="flex items-center gap-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {item.href && !item.isCurrentPage ? (
              <a
                href={item.href}
                className="text-sm admin-text hover:admin-accent transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  "text-sm",
                  item.isCurrentPage ? "admin-text font-medium" : "admin-text-muted"
                )}
                aria-current={item.isCurrentPage ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="mx-0.5 admin-text-muted">{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
