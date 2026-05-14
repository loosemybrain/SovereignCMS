"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Navigation,
  PanelBottom,
  Image,
  Settings,
  Shield,
  Database,
  HardDrive,
  Lock,
  Sparkles,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    title: "Pages",
    icon: FileText,
    href: "/pages",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Navigation",
    icon: Navigation,
    href: "/navigation",
    gradient: "from-pink-500 to-fuchsia-500",
  },
  {
    title: "Footer Navigation",
    icon: PanelBottom,
    href: "/footer",
    gradient: "from-slate-400 to-slate-500",
  },
  {
    title: "Media",
    icon: Image,
    href: "/media",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    title: "Privacy",
    icon: Shield,
    href: "/privacy",
    gradient: "from-amber-600 to-yellow-500",
  },
]

interface RuntimeConfigProps {
  db: string
  storage: string
  auth: string
}

function RuntimeConfigFooter({ db, storage, auth }: RuntimeConfigProps) {
  return (
    <div className="px-3 py-4 space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3" />
        Runtime Config
      </p>
      <div className="space-y-2">
        {[
          { icon: Database, label: "DB", value: db },
          { icon: HardDrive, label: "Storage", value: storage },
          { icon: Lock, label: "Auth", value: auth },
        ].map((item, index) => (
          <div 
            key={item.label}
            className="group flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <item.icon className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className="truncate font-medium">{item.label}:</span>
            <span className="truncate font-mono text-[11px] opacity-70">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  tenant?: string
  runtimeConfig?: RuntimeConfigProps
}

export function AppSidebar({
  tenant = "demo",
  runtimeConfig = { db: "memory", storage: "memory", auth: "none" },
  ...props
}: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-105">
            <span className="relative z-10">S</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              SovereignCMS
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Tenant: {tenant}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-3 bg-gradient-to-r from-transparent via-border to-transparent" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/" && pathname.startsWith(item.href))
                return (
                  <SidebarMenuItem 
                    key={item.title}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-up"
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "group relative transition-all duration-300 rounded-lg",
                        isActive && "bg-sidebar-accent shadow-sm"
                      )}
                    >
                      <Link href={item.href}>
                        <div className={cn(
                          "relative flex h-5 w-5 items-center justify-center rounded-md transition-all duration-300",
                          isActive 
                            ? `bg-gradient-to-br ${item.gradient} text-white shadow-md` 
                            : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          <item.icon className="h-3.5 w-3.5" />
                        </div>
                        <span className={cn(
                          "font-medium transition-colors duration-300",
                          isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-gradient-to-b from-primary to-primary/50" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarSeparator className="mx-3 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="group-data-[collapsible=icon]:hidden">
          <RuntimeConfigFooter {...runtimeConfig} />
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/50 text-muted-foreground text-xs font-medium transition-transform duration-300 hover:scale-110">
            N
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
