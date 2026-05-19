import { headers } from "next/headers"
import Link from "next/link"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { CompositionDebugPanel } from "@/components/composition-debug-panel"
import { CreatePageForm } from "@/components/create-page-form"
import { AdminDataTable, AdminDataTableBody, AdminDataTableCell, AdminDataTableHeadRow, AdminDataTableRow, AdminDataTableTh, AdminEmptyState, AdminPageHeader, AdminSectionCard, AdminStatusBadge } from "@/components/admin-ui"
import { formatAdminMessage, getAdminMessages } from "@/lib/admin-i18n"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"
import { loadAdminPages } from "@/lib/load-admin-pages"

type Props = {
  searchParams: Promise<{ locale?: string }>
}

export default async function PagesListPage({ searchParams }: Props) {
  const params = await searchParams
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const {
    tenant,
    pages,
    error,
    localeContext,
    activeLocale,
    pageVariantsCount,
    logicalPagesCount,
  } = await loadAdminPages({
    host,
    searchParams: params,
  })

  const t = getAdminMessages(await getAdminUiLocale())
  const p = t.pages
  const c = t.common

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <AdminSectionCard variant="elevated" title={p.localeOverviewTitle} description={p.localeOverviewDescription}>
        <div className="space-y-4">
          <AdminLocaleSwitcher activeLocale={activeLocale} localeContext={localeContext} />
          <div className="flex flex-wrap items-center gap-2 text-xs admin-text-muted">
            <span>{c.locale}</span>
            <AdminStatusBadge>{activeLocale}</AdminStatusBadge>
            <span className="opacity-50">·</span>
            <span>{c.variants}</span>
            <AdminStatusBadge variant="muted">{pageVariantsCount}</AdminStatusBadge>
            <span className="opacity-50">·</span>
            <span>{c.logical}</span>
            <AdminStatusBadge variant="muted">{logicalPagesCount}</AdminStatusBadge>
          </div>
        </div>
      </AdminSectionCard>

      <CreatePageForm
        tenantId={tenant.tenantId}
        activeLocale={activeLocale}
        runtimeSupportedLocales={localeContext.supportedLocales}
        runtimeDefaultLocale={localeContext.defaultLocale}
      />
      <CompositionDebugPanel
        tenantId={tenant.tenantId}
        runtimeSupportedLocales={localeContext.supportedLocales}
        runtimeDefaultLocale={localeContext.defaultLocale}
      />

      {error === true ? (
        <div className="rounded-xl border admin-border admin-callout-error p-4 text-sm">
          {p.loadFailed}
        </div>
      ) : pages.length === 0 ? (
        <AdminEmptyState
          title={formatAdminMessage(p.emptyTitle, { locale: activeLocale })}
          description={p.emptyDescription}
        />
      ) : (
        <AdminSectionCard
          variant="glass"
          title={p.pageListTitle}
          description={formatAdminMessage(p.pageListDescription, { locale: activeLocale })}
        >
          <AdminDataTable>
          <AdminDataTableHeadRow>
            <AdminDataTableTh>{c.title}</AdminDataTableTh>
            <AdminDataTableTh>{c.slug}</AdminDataTableTh>
            <AdminDataTableTh>{c.locale}</AdminDataTableTh>
            <AdminDataTableTh>{c.status}</AdminDataTableTh>
            <AdminDataTableTh>{c.updated}</AdminDataTableTh>
          </AdminDataTableHeadRow>
          <AdminDataTableBody>
            {pages.map((page) => (
              <AdminDataTableRow key={page.id}>
                <AdminDataTableCell>
                  <Link
                    href={`/pages/${page.slug}?locale=${activeLocale}`}
                    className="font-medium admin-accent underline-offset-2 hover:underline rounded-sm admin-focus-ring"
                  >
                    {page.title}
                  </Link>
                </AdminDataTableCell>
                <AdminDataTableCell className="font-mono text-xs admin-text-muted">
                  {page.slug}
                </AdminDataTableCell>
                <AdminDataTableCell className="admin-text-muted">
                  {page.locale}
                </AdminDataTableCell>
                <AdminDataTableCell>
                  <ContentStatusBadge status={page.status} />
                </AdminDataTableCell>
                <AdminDataTableCell className="text-xs admin-text-muted">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </AdminDataTableCell>
              </AdminDataTableRow>
            ))}
          </AdminDataTableBody>
          </AdminDataTable>
        </AdminSectionCard>
      )}
    </div>
  )
}
