"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TopbarProps {
  title: string
  subtitle?: string
  badge?: string
  children?: React.ReactNode
}

export function Topbar({ title, subtitle, badge, children }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 transition-all duration-300">
      <SidebarTrigger className="-ml-1 md:hidden transition-transform duration-300 hover:scale-105 active:scale-95" />
      <Separator orientation="vertical" className="h-6 md:hidden" />
      
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight truncate">
              {title}
            </h1>
            {badge && (
              <Badge 
                variant="secondary" 
                className="text-[10px] px-2 py-0.5 h-5 font-medium bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-primary animate-slide-in-right"
              >
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate hidden sm:block animate-slide-up" style={{ animationDelay: '100ms' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </header>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between animate-slide-up",
      className
    )}>
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground text-pretty max-w-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2 mt-4 sm:mt-0 animate-slide-in-right" style={{ animationDelay: '150ms' }}>
          {action}
        </div>
      )}
    </div>
  )
}
