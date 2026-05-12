import { headers } from "next/headers"
import { createLocaleContext } from "@sovereign-cms/runtime"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { CreateNavigationItemForm } from "@/components/create-navigation-item-form"
import { AdminCard, AdminEmptyState, AdminPageHeader } from "@/components/admin-ui"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { resolveAdminLocale } from "@/lib/resolve-admin-locale"

type Props = {
  searchParams: Promise<{ locale?: string }>
}

export default async function FooterNavigationPage({ searchParams }: Props) {
  const params = await searchParams
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })

  const localeContext = createLocaleContext({
    locale: runtime.config.defaultLocale,
    supportedLocales: runtime.config.supportedLocales,
    defaultLocale: runtime.config.defaultLocale,
  })
  const activeLocale = resolveAdminLocale({
    locale: params.locale,
    localeContext,
  })

  const [items, pages] = await Promise.all([
    runtime.navigationPersistence.listNavigationItems({
      tenantId: tenant.tenantId,
      locale: activeLocale,
      scope: "footer",
    }),
    runtime.db.pages.listByTenant({
      tenantId: tenant.tenantId,
      locale: activeLocale,
    }),
  ])

  const createHref = (locale: string) => {
    const next = new URLSearchParams()
    next.set("locale", locale)
    return `/footer-navigation?${next.toString()}`
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Footer Navigation"
        description="Links shown in the public footer (separate from main header navigation)."
      />

      <AdminLocaleSwitcher
        activeLocale={activeLocale}
        localeContext={localeContext}
        createHref={createHref}
      />

      <CreateNavigationItemForm
        key={`footer-navigation-create-${activeLocale}`}
        tenantId={tenant.tenantId}
        activeLocale={activeLocale}
        pages={pages}
        defaultScope="footer"
        lockScope
      />

      <AdminCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b admin-border admin-surface-muted">
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Label</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Type</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Target</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Status</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Sort</th>
            </tr>
          </thead>
          <tbody className="divide-y admin-border">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">
                  <AdminEmptyState
                    title={`Keine Footer-Navigation fuer Locale ${activeLocale}`}
                    description="Erstelle ein Item ueber das Formular oben."
                  />
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/40">
                  <td className="px-6 py-4 admin-text">{item.label}</td>
                  <td className="px-6 py-4 admin-text-muted">{item.type}</td>
                  <td className="px-6 py-4 admin-text-muted font-mono text-xs">
                    {item.type === "page" ? item.pageId : item.href}
                  </td>
                  <td className="px-6 py-4">
                    <ContentStatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 admin-text-muted">{item.sortOrder}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
