import { headers } from "next/headers"
import { createLocaleContext } from "@sovereign-cms/runtime"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { CreateNavigationItemForm } from "@/components/create-navigation-item-form"
import { AdminDataTable, AdminDataTableHeadRow, AdminDataTableTh, AdminEmptyState, AdminPageHeader } from "@/components/admin-ui"
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

      <AdminDataTable>
        <AdminDataTableHeadRow>
          <AdminDataTableTh>Label</AdminDataTableTh>
          <AdminDataTableTh>Type</AdminDataTableTh>
          <AdminDataTableTh>Target</AdminDataTableTh>
          <AdminDataTableTh>Status</AdminDataTableTh>
          <AdminDataTableTh>Sort</AdminDataTableTh>
        </AdminDataTableHeadRow>
        <tbody className="divide-y admin-border">
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center admin-text-muted">
                <AdminEmptyState
                  title={`Keine Footer-Navigation fuer Locale ${activeLocale}`}
                  description="Erstelle ein Item ueber das Formular oben."
                />
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="admin-row-hover">
                <td className="px-4 py-3 admin-text">{item.label}</td>
                <td className="px-4 py-3 admin-text-muted">{item.type}</td>
                <td className="px-4 py-3 font-mono text-xs admin-text-muted">
                  {item.type === "page" ? item.pageId : item.href}
                </td>
                <td className="px-4 py-3">
                  <ContentStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 admin-text-muted">{item.sortOrder}</td>
              </tr>
            ))
          )}
        </tbody>
      </AdminDataTable>
    </div>
  )
}
