import { cn } from "@sovereign-cms/ui"

export type AdminAvatarSize = "sm" | "md" | "lg"

type AdminAvatarProps = {
  /** Initials or single character for fallback */
  initials: string
  /** URL to avatar image */
  src?: string
  /** Semantic name for accessibility */
  alt?: string
  size?: AdminAvatarSize
  className?: string
  /** Optional status indicator: online, offline, away, busy */
  status?: "online" | "offline" | "away" | "busy"
}

const sizeClasses: Record<AdminAvatarSize, string> = {
  sm: "w-7 h-7 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
}

const statusColors: Record<NonNullable<AdminAvatarProps["status"]>, string> = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
}

/**
 * User avatar with optional image, initials fallback, and status indicator.
 */
export function AdminAvatar({
  initials,
  src,
  alt,
  size = "md",
  className,
  status,
}: AdminAvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold",
          "bg-gradient-to-br from-[color-mix(in_oklab,var(--admin-accent)_60%,var(--admin-surface))] to-[color-mix(in_oklab,var(--admin-accent)_40%,var(--admin-surface-muted))]",
          "admin-text border admin-border",
          sizeClasses[size],
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || initials}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="leading-none">{initials}</span>
        )}
      </div>
      {status && (
        <div
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900",
            "w-2.5 h-2.5",
            statusColors[status],
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}
