import { cn } from "@sovereign-cms/ui"

export type AdminSpinnerSize = "sm" | "md" | "lg"

type AdminSpinnerProps = {
  size?: AdminSpinnerSize
  className?: string
  /** Accessible label for the spinner */
  label?: string
}

const sizeClasses: Record<AdminSpinnerSize, string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
}

/**
 * Animated loading spinner with accessible label.
 */
export function AdminSpinner({
  size = "md",
  className,
  label = "Loading...",
}: AdminSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <div
        className={cn(
          "border-2 border-current border-t-transparent rounded-full animate-spin",
          "opacity-70",
          sizeClasses[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
