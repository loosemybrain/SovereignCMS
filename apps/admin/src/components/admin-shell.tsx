"use client"

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
  Layers,
} from "lucide-react"
import { AdminAppearanceToggle } from "@/components/admin-appearance-toggle"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { AdminUiLocaleSwitcher } from "@/components/admin-ui-locale-switcher"
import { AdminBadge, AdminTopbar } from "@/components/admin-ui"
import type { AdminRuntimeAdapterLabels } from "@/lib/admin-runtime-display"
import type { AdminTenantContext } from "@sovereign-cms/tenancy"
import { cn } from "@sovereign-cms/ui"

type AdminShellProps = {
  children: React.ReactNode
  tenant: AdminTenantContext
  runtimeAdapterLabels: AdminRuntimeAdapterLabels
}

export function AdminShell({ children, tenant, runtimeAdapterLabels }: AdminShellProps) {
  const pathname = usePathname()
  const { messages: m } = useAdminI18n()

  const navItems = [
    { href: "/", label: m.shell.nav.dashboard, icon: LayoutDashboard },
    { href: "/pages", label: m.shell.nav.pages, icon: FileText },
    { href: "/navigation", label: m.shell.nav.navigation, icon: Navigation },
    { href: "/footer-navigation", label: m.shell.nav.footerNavigation, icon: PanelBottom },
    { href: "/media", label: m.shell.nav.media, icon: Image },
    { href: "/settings", label: m.shell.nav.settings, icon: Settings },
    { href: "/privacy", label: m.shell.nav.privacy, icon: Shield },
  ]

  const isRouteActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/" || pathname === "/dashboard"
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  const activeNav = navItems.find((item) => isRouteActive(item.href))

  return (
    <div className="flex h-screen overflow-hidden admin-bg admin-text">
      <aside className="admin-sidebar flex h-screen w-62 shrink-0 flex-col border-r admin-border admin-surface">
        <div className="border-b admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_35%,transparent)] px-5 py-5">
          <div className="flex items-start gap-3">
            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-sky-500 via-indigo-600 to-violet-700 text-white shadow-md ring-1 ring-white/15"
              aria-hidden
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)] opacity-90" />
              <Layers className="relative h-5 w-5 drop-shadow-sm" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] admin-text-muted">{m.shell.workspace}</p>
              <h1 className="text-sm font-bold tracking-tight admin-text">SovereignCMS</h1>
              <p className="mt-2 truncate text-[10px] font-medium uppercase tracking-wide admin-text-muted">{m.shell.tenant}</p>
              <span className="mt-0.5 block truncate font-mono text-[11px] leading-snug admin-text" title={tenant.tenantId}>
                {tenant.tenantId}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
          {navItems.map((item) => {
            const isActive = isRouteActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group admin-focus-ring relative flex items-center gap-3 rounded-xl border border-transparent py-2.5 pl-3 pr-3 text-sm transition-[color,background-color,transform,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none motion-reduce:hover:translate-x-0",
                  isActive
                    ? "admin-sidebar-nav-active border-(--admin-border) admin-text shadow-sm"
                    : "admin-text-muted hover:admin-text admin-sidebar-nav-idle hover:shadow-sm",
                )}
              >
                {isActive ? (
                  <span
                    className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-(--admin-accent) shadow-[0_0_0_1px_color-mix(in_oklab,var(--admin-accent)_25%,transparent)]"
                    aria-hidden
                  />
                ) : null}
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[color-mix(in_oklab,var(--admin-accent)_55%,var(--admin-text-muted))] shadow-sm transition-[background,transform,color,border-color] duration-200 ease-out motion-reduce:transition-none",
                    isActive
                      ? "border-transparent bg-linear-to-br from-sky-500 via-indigo-600 to-violet-700 text-white shadow-md ring-1 ring-white/10"
                      : "admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_82%,var(--admin-surface))] group-hover:border-[color-mix(in_oklab,var(--admin-border)_70%,var(--admin-accent))]",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <span className={cn("min-w-0 flex-1 font-medium tracking-tight", isActive && "font-semibold admin-text")}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer space-y-2 border-t admin-border p-4 text-xs">
          <p className="mb-1 flex items-center gap-1.5 font-semibold uppercase tracking-wide admin-text-muted">
            <Sparkles className="h-3 w-3 shrink-0 admin-accent" aria-hidden />
            {m.shell.runtime}
          </p>
          <dl className="space-y-2 text-[11px] admin-text-muted">
            {[
              { icon: Database, label: m.shell.db, value: runtimeAdapterLabels.databaseAdapter },
              { icon: HardDrive, label: m.shell.storage, value: runtimeAdapterLabels.storageAdapter },
              { icon: Lock, label: m.shell.auth, value: runtimeAdapterLabels.authAdapter },
            ].map((row) => {
              const RowIcon = row.icon
              return (
                <div
                  key={row.label}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[color-mix(in_oklab,var(--admin-surface-muted)_85%,var(--admin-surface))]"
                >
                  <RowIcon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                  <dt className="font-medium opacity-80">{row.label}</dt>
                  <dd className="ml-auto truncate font-mono text-[10px] admin-text">{row.value}</dd>
                </div>
              )
            })}
          </dl>
        </div>
      </aside>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden admin-bg">
        <AdminTopbar
          title={activeNav?.label ?? "Admin"}
          subtitle={tenant.tenantId}
          viewLabel={m.shell.topbarView}
          badge={<AdminBadge variant="muted">{tenant.source}</AdminBadge>}
          actions={
            <div className="flex items-center gap-2">
              <AdminUiLocaleSwitcher />
              <AdminAppearanceToggle />
            </div>
          }
        />

        <div className="admin-main-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
          <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
