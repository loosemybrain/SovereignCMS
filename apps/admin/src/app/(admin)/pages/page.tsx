import { headers } from "next/headers"
import Link from "next/link"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { CompositionDebugPanel } from "@/components/composition-debug-panel"
import { CreatePageForm } from "@/components/create-page-form"
import { AdminDataTable, AdminDataTableHeadRow, AdminDataTableTh, AdminDataTableBody, AdminDataTableRow, AdminDataTableCell, AdminEmptyState, AdminPageHeader } from "@/components/admin-ui"
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

  const createHref = (locale: string) => {
    const newParams = new URLSearchParams()
    newParams.set("locale", locale)
    return `/pages?${newParams.toString()}`
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Pages" description="Manage your CMS pages" />

      {/* Locale Switcher */}
      <AdminLocaleSwitcher
        activeLocale={activeLocale}
        localeContext={localeContext}
        createHref={createHref}
      />

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

      {/* Page Counts Info */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="px-3 py-2 rounded admin-surface border admin-border admin-text-muted">
          Showing pages for locale: <span className="font-medium admin-text">{activeLocale}</span>
        </div>
        <div className="px-3 py-2 rounded admin-surface border admin-border admin-text-muted">
          Total variants: <span className="font-medium admin-text">{pageVariantsCount}</span>
        </div>
        <div className="px-3 py-2 rounded admin-surface border admin-border admin-text-muted">
          Logical pages: <span className="font-medium admin-text">{logicalPagesCount}</span>
        </div>
      </div>

      {error === true ? (
        <div className="rounded-xl border admin-border admin-callout-error p-4 text-sm">
          Failed to load pages. Please try again.
        </div>
      ) : pages.length === 0 ? (
        <AdminEmptyState
          title={`No pages for locale ${activeLocale}`}
          description="Other locale variants may exist. Use locale switcher above to view them."
        />
      ) : (
        <AdminDataTable>
          <AdminDataTableHeadRow>
            <AdminDataTableTh>Title</AdminDataTableTh>
            <AdminDataTableTh>Slug</AdminDataTableTh>
            <AdminDataTableTh>Locale</AdminDataTableTh>
            <AdminDataTableTh>Status</AdminDataTableTh>
            <AdminDataTableTh>Updated</AdminDataTableTh>
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
      )}
    </div>
  )
}
