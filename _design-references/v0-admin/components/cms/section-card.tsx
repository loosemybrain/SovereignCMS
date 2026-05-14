"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface SectionCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
  headerIcon?: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  variant?: "default" | "elevated" | "glass"
}

export function SectionCard({ 
  title, 
  description, 
  children, 
  className,
  headerAction,
  headerIcon,
  collapsible = false,
  defaultOpen = true,
  variant = "default"
}: SectionCardProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden transition-all duration-300 animate-slide-up",
        variant === "default" && "bg-card shadow-sm hover:shadow-md",
        variant === "elevated" && "bg-card shadow-lg shadow-black/5 dark:shadow-black/20",
        variant === "glass" && "glass border-white/20 dark:border-white/10",
        className
      )}
    >
      <div 
        className={cn(
          "border-b px-5 py-4 transition-all duration-300",
          "bg-gradient-to-r from-muted/50 to-muted/30",
          collapsible && "cursor-pointer hover:from-muted/70 hover:to-muted/50"
        )}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {headerIcon && (
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                {headerIcon}
              </div>
            )}
            {collapsible && (
              <ChevronRight 
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-90"
                )} 
              />
            )}
            <div className="space-y-1">
              <h3 className="text-base font-semibold tracking-tight">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {headerAction && (
            <div onClick={(e) => e.stopPropagation()}>
              {headerAction}
            </div>
          )}
        </div>
      </div>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

interface FieldGroupProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function FieldGroup({ children, columns = 1, className }: FieldGroupProps) {
  return (
    <div
      className={cn(
        "grid gap-5",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}

interface FormFieldProps {
  label: string
  description?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ 
  label, 
  description, 
  required, 
  children, 
  className 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2 group", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors group-focus-within:text-primary">
        {label}
        {required && <span className="text-destructive ml-1 animate-pulse">*</span>}
      </label>
      <div className="relative">
        {children}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground transition-colors group-focus-within:text-muted-foreground/80">
          {description}
        </p>
      )}
    </div>
  )
}
