"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdminAppearanceToggle } from "@/components/admin-appearance-toggle"
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
  { href: "/navigation", label: "Navigation", icon: "🧭" },
  { href: "/footer-navigation", label: "Footer Navigation", icon: "📎" },
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
    <div className="flex h-screen overflow-hidden admin-bg admin-text">
      {/* Sidebar */}
      <aside className="w-60 h-screen border-r admin-border admin-surface flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b admin-border">
          <h1 className="text-sm font-bold admin-text tracking-tight">SOVEREIGNCMS</h1>
          <p className="text-xs admin-text-muted mt-2 truncate">Tenant: {tenant.tenantId}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => {
            const isActive = isRouteActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded text-sm transition-all duration-200 admin-focus-ring",
                  isActive
                    ? "admin-accent-bg admin-text border admin-border"
                    : "admin-text-muted hover:bg-zinc-800/30 admin-surface-muted",
                )}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Config */}
        <div className="border-t admin-border p-4 space-y-2 text-xs">
          <div className="space-y-1">
            <p className="admin-text-muted font-medium">Runtime Config</p>
            <div className="space-y-1 admin-text-muted">
              <p className="truncate"><span className="admin-text-muted">DB:</span> {runtimeConfig.databaseAdapter}</p>
              <p className="truncate"><span className="admin-text-muted">Storage:</span> {runtimeConfig.storageAdapter}</p>
              <p className="truncate"><span className="admin-text-muted">Auth:</span> {runtimeConfig.authAdapter}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 min-h-0 flex flex-col admin-bg">
        {/* Header */}
        <header className="border-b admin-border admin-surface px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold admin-text">
              {navItems.find((item) => isRouteActive(item.href))?.label || "Admin"}
            </h2>
            <div className="flex items-center gap-2">
              <AdminAppearanceToggle />
              <div className="text-xs admin-text-muted px-2 py-1 rounded admin-surface-muted border admin-border">
                {tenant.source}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto max-w-6xl p-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
