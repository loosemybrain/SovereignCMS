import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@sovereign-cms/ui"

type AdminButtonVariant = "primary" | "secondary" | "destructive" | "outline" | "ghost"
type AdminButtonSize = "sm" | "md" | "lg" | "icon"

type AdminButtonProps = {
  children: ReactNode
  variant?: AdminButtonVariant
  size?: AdminButtonSize
  isLoading?: boolean
  className?: string
  icon?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantClasses: Record<AdminButtonVariant, string> = {
  primary:
    "admin-accent-bg admin-text border admin-border hover:opacity-90 active:scale-[0.98] transition-[opacity,transform,background-color,border-color] duration-200 ease-out motion-reduce:active:scale-100",
  secondary:
    "admin-surface-muted admin-text border admin-border hover:opacity-90 active:scale-[0.98] transition-[opacity,transform,background-color,border-color] duration-200 ease-out motion-reduce:active:scale-100",
  destructive:
    "bg-destructive/90 text-destructive-foreground border border-destructive/50 hover:bg-destructive active:scale-[0.98] transition-[opacity,transform,background-color,border-color] duration-200 ease-out motion-reduce:active:scale-100",
  outline:
    "bg-transparent admin-text border-2 admin-border hover:admin-surface-muted active:scale-[0.98] transition-[opacity,transform,background-color,border-color] duration-200 ease-out motion-reduce:active:scale-100",
  ghost:
    "bg-transparent admin-text hover:admin-surface-muted active:scale-[0.98] transition-[opacity,transform,background-color] duration-200 ease-out motion-reduce:active:scale-100",
}

const sizeClasses: Record<AdminButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-lg",
  icon: "w-10 h-10 p-0 rounded-lg",
}

export function AdminButton({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  disabled,
  icon,
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "admin-focus-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        isLoading && "opacity-70 cursor-wait",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : icon ? (
        <>
          {icon}
          {children && size !== "icon" && <span className="ml-2">{children}</span>}
        </>
      ) : (
        children
      )}
    </button>
  )
}
