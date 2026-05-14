"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Info, AlertTriangle, CheckCircle2, X } from "lucide-react"

type AlertVariant = "info" | "warning" | "destructive" | "success"

interface CMSAlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
  animate?: boolean
}

const variantStyles: Record<AlertVariant, { 
  container: string
  icon: typeof Info
  iconClass: string
  glowClass: string
}> = {
  info: {
    container: "bg-gradient-to-r from-info/15 via-info/10 to-transparent border-info/30 text-info-foreground",
    icon: Info,
    iconClass: "text-primary",
    glowClass: "shadow-info/10",
  },
  warning: {
    container: "bg-gradient-to-r from-warning/15 via-warning/10 to-transparent border-warning/30 text-warning-foreground",
    icon: AlertTriangle,
    iconClass: "text-amber-500 dark:text-amber-400",
    glowClass: "shadow-amber-500/10",
  },
  destructive: {
    container: "bg-gradient-to-r from-destructive/15 via-destructive/10 to-transparent border-destructive/30 text-destructive",
    icon: AlertCircle,
    iconClass: "text-destructive",
    glowClass: "shadow-destructive/10",
  },
  success: {
    container: "bg-gradient-to-r from-success/15 via-success/10 to-transparent border-success/30 text-success-foreground",
    icon: CheckCircle2,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    glowClass: "shadow-emerald-500/10",
  },
}

export function CMSAlert({ 
  variant = "info", 
  title, 
  children, 
  className,
  dismissible = false,
  onDismiss,
  animate = true
}: CMSAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const styles = variantStyles[variant]
  const Icon = styles.icon

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div
      role="alert"
      className={cn(
        "group relative rounded-xl border px-4 py-3.5 text-sm shadow-lg transition-all duration-300",
        styles.container,
        styles.glowClass,
        animate && "animate-slide-up",
        "hover:shadow-xl",
        className
      )}
    >
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative flex gap-3">
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
          variant === "info" && "bg-primary/10",
          variant === "warning" && "bg-amber-500/10",
          variant === "destructive" && "bg-destructive/10",
          variant === "success" && "bg-emerald-500/10",
        )}>
          <Icon className={cn("h-4 w-4", styles.iconClass)} />
        </div>
        <div className="flex-1 space-y-1 pt-0.5">
          {title && (
            <p className="font-semibold leading-none tracking-tight">{title}</p>
          )}
          <div className="text-sm opacity-90 leading-relaxed">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 p-1.5 rounded-lg opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-foreground/5"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
