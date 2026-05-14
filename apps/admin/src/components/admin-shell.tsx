"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdminAppearanceToggle } from "@/components/admin-appearance-toggle"
import { AdminTopbar } from "@/components/admin-ui"
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
  { href: "/privacy", label: "Privacy", icon: "🔒" },
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
      <aside className="flex h-screen w-62 shrink-0 flex-col border-r admin-border admin-surface transition-all duration-200">
        {/* Logo Section */}
        <div className="border-b admin-border px-5 py-5 transition-all duration-200">
          <h1 className="text-xs font-bold uppercase tracking-[0.12em] admin-text">SovereignCMS</h1>
          <p className="mt-2 truncate text-xs admin-text-muted" title={tenant.tenantId}>
            Tenant · <span className="font-mono admin-text">{tenant.tenantId}</span>
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
          {navItems.map((item, index) => {
            const isActive = isRouteActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "admin-focus-ring flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm transition-all duration-200 motion-reduce:transition-none",
                  "animate-slide-up",
                  isActive
                    ? "admin-accent-bg admin-text border-(--admin-border) shadow-sm ring-1 ring-[color-mix(in_oklab,var(--admin-accent)_28%,transparent)]"
                    : "admin-text-muted hover:admin-text hover:shadow-sm admin-row-hover",
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <span className="text-base opacity-90 transition-transform group-hover:scale-110" aria-hidden>
                  {item.icon}
                </span>
                <span className={cn("font-medium", isActive && "admin-text")}>{item.label}</span>
                {isActive ? (
                  <span
                    className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-(--admin-accent) animate-scale-in"
                    aria-hidden
                  />
                ) : null}
              </Link>
            )
          })}
        </nav>

        {/* Footer Config */}
        <div className="space-y-2 border-t admin-border p-4 text-xs transition-all duration-200">
          <p className="font-semibold uppercase tracking-wide admin-text-muted">Runtime</p>
          <dl className="space-y-1.5 admin-text-muted text-[11px]">
            <div className="flex items-center justify-between gap-2 rounded px-1 py-1 transition-colors hover:admin-surface-muted">
              <dt className="shrink-0 opacity-70 font-medium">DB</dt>
              <dd className="truncate font-mono admin-text">{runtimeConfig.databaseAdapter}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded px-1 py-1 transition-colors hover:admin-surface-muted">
              <dt className="shrink-0 opacity-70 font-medium">Storage</dt>
              <dd className="truncate font-mono admin-text">{runtimeConfig.storageAdapter}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded px-1 py-1 transition-colors hover:admin-surface-muted">
              <dt className="shrink-0 opacity-70 font-medium">Auth</dt>
              <dd className="truncate font-mono admin-text">{runtimeConfig.authAdapter}</dd>
            </div>
          </dl>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden admin-bg transition-all duration-200">
        {/* Header */}
        <AdminTopbar
          title={navItems.find((item) => isRouteActive(item.href))?.label || "Admin"}
          actions={
            <>
              <AdminAppearanceToggle />
              <div className="rounded-md border admin-border admin-surface-muted px-2.5 py-1 text-xs font-medium admin-text-muted transition-all duration-200 hover:admin-surface">
                {tenant.source}
              </div>
            </>
          }
        />

        {/* Content: single vertical scroll for all admin pages */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
          <div className="mx-auto max-w-6xl p-8 animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
