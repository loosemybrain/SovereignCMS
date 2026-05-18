import { headers } from "next/headers"
import { createLocaleContext } from "@sovereign-cms/runtime"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { CreateNavigationItemForm } from "@/components/create-navigation-item-form"
import { AdminDataTable, AdminDataTableBody, AdminDataTableCell, AdminDataTableHeadRow, AdminDataTableRow, AdminDataTableTh, AdminEmptyState, AdminPageHeader, AdminSectionCard } from "@/components/admin-ui"
import { formatAdminMessage, getAdminMessages } from "@/lib/admin-i18n"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { resolveAdminLocale } from "@/lib/resolve-admin-locale"

type Props = {
  searchParams: Promise<{ locale?: string }>
}

export default async function NavigationPage({ searchParams }: Props) {
  const params = await searchParams
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })
  const t = getAdminMessages(await getAdminUiLocale())
  const n = t.navigation

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
      scope: "main",
    }),
    runtime.db.pages.listByTenant({
      tenantId: tenant.tenantId,
      locale: activeLocale,
    }),
  ])

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow={n.eyebrow} title={n.title} description={n.description} />

      <AdminSectionCard
        variant="elevated"
        title={n.localeSection}
        description={formatAdminMessage(n.localeSectionDescription, { locale: activeLocale })}
      >
        <div className="space-y-4">
          <AdminLocaleSwitcher
            activeLocale={activeLocale}
            localeContext={localeContext}
            label={t.locale.contentLanguage}
          />
          <CreateNavigationItemForm
            key={`navigation-create-${activeLocale}`}
            tenantId={tenant.tenantId}
            activeLocale={activeLocale}
            pages={pages}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        variant="glass"
        title={n.entries}
        description={formatAdminMessage(n.entriesDescription, { count: items.length })}
      >
        <AdminDataTable>
        <AdminDataTableHeadRow>
          <AdminDataTableTh>Label</AdminDataTableTh>
          <AdminDataTableTh>Type</AdminDataTableTh>
          <AdminDataTableTh>Target</AdminDataTableTh>
          <AdminDataTableTh>Status</AdminDataTableTh>
          <AdminDataTableTh>Sort</AdminDataTableTh>
        </AdminDataTableHeadRow>
        <AdminDataTableBody>
          {items.length === 0 ? (
            <AdminDataTableRow hover={false}>
              <AdminDataTableCell className="px-4 py-10 text-center admin-text-muted" colSpan={5}>
                <AdminEmptyState
                  title={`Keine Navigation Items fuer Locale ${activeLocale}`}
                  description="Erstelle ein Item ueber das Formular oben."
                />
              </AdminDataTableCell>
            </AdminDataTableRow>
          ) : (
            items.map((item) => (
              <AdminDataTableRow key={item.id}>
                <AdminDataTableCell>{item.label}</AdminDataTableCell>
                <AdminDataTableCell className="admin-text-muted">{item.type}</AdminDataTableCell>
                <AdminDataTableCell className="font-mono text-xs admin-text-muted">
                  {item.type === "page" ? item.pageId : item.href}
                </AdminDataTableCell>
                <AdminDataTableCell>
                  <ContentStatusBadge status={item.status} />
                </AdminDataTableCell>
                <AdminDataTableCell className="admin-text-muted">{item.sortOrder}</AdminDataTableCell>
              </AdminDataTableRow>
            ))
          )}
        </AdminDataTableBody>
      </AdminDataTable>
      </AdminSectionCard>
    </div>
  )
}
