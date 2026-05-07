"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { RuntimeConfig } from "@sovereign-cms/runtime"
import type { AdminTenantContext } from "@sovereign-cms/tenancy"
import { cn } from "@sovereign-cms/ui"

type AdminShellProps = {
  children: React.ReactNode
  tenant: AdminTenantContext
  runtimeConfig: RuntimeConfig
}

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/pages", label: "Pages", icon: "📄" },
  { href: "/media", label: "Media", icon: "🖼️" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
]

export function AdminShell({ children, tenant, runtimeConfig }: AdminShellProps) {
  const pathname = usePathname()

  // Helper to determine if a route is active
  const isRouteActive = (href: string): boolean => {
    if (href === "/") {
      // Dashboard is active on "/" or "/dashboard"
      return pathname === "/" || pathname === "/dashboard"
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-60 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-sm font-bold text-white tracking-tight">SOVEREIGNCMS</h1>
          <p className="text-xs text-zinc-500 mt-2 truncate">Tenant: {tenant.tenantId}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = isRouteActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded text-sm transition-all duration-200",
                  isActive
                    ? "bg-blue-950 text-blue-100 border border-blue-800/50"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30",
                )}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Config */}
        <div className="border-t border-zinc-800 p-4 space-y-2 text-xs">
          <div className="space-y-1">
            <p className="text-zinc-500 font-medium">Runtime Config</p>
            <div className="space-y-1 text-zinc-400">
              <p className="truncate"><span className="text-zinc-600">DB:</span> {runtimeConfig.databaseAdapter}</p>
              <p className="truncate"><span className="text-zinc-600">Storage:</span> {runtimeConfig.storageAdapter}</p>
              <p className="truncate"><span className="text-zinc-600">Auth:</span> {runtimeConfig.authAdapter}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col bg-zinc-950/50">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-900/30 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">
              {navItems.find((item) => isRouteActive(item.href))?.label || "Admin"}
            </h2>
            <div className="text-xs text-zinc-500 px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800">
              {tenant.source}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl p-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
