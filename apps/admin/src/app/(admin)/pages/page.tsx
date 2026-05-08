import { headers } from "next/headers"
import Link from "next/link"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { CreatePageForm } from "@/components/create-page-form"
import { AdminCard, AdminEmptyState, AdminPageHeader } from "@/components/admin-ui"
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

      <CreatePageForm tenantId={tenant.tenantId} activeLocale={activeLocale} />

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
        <AdminCard className="border-red-800/50 bg-red-900/20 text-red-300">
          Failed to load pages. Please try again.
        </AdminCard>
      ) : pages.length === 0 ? (
        <AdminEmptyState
          title={`No pages for locale ${activeLocale}`}
          description="Other locale variants may exist. Use locale switcher above to view them."
        />
      ) : (
        <AdminCard className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b admin-border admin-surface-muted">
                <th className="px-6 py-3 text-left font-medium admin-text-muted">Title</th>
                <th className="px-6 py-3 text-left font-medium admin-text-muted">Slug</th>
                <th className="px-6 py-3 text-left font-medium admin-text-muted">Locale</th>
                <th className="px-6 py-3 text-left font-medium admin-text-muted">Status</th>
                <th className="px-6 py-3 text-left font-medium admin-text-muted">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y admin-border">
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="hover:bg-zinc-900/40 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 admin-text">
                    <Link
                      href={`/pages/${page.slug}?locale=${activeLocale}`}
                      className="hover:underline font-medium"
                    >
                      {page.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 admin-text-muted font-mono text-xs">{page.slug}</td>
                  <td className="px-6 py-4 admin-text-muted">{page.locale}</td>
                  <td className="px-6 py-4">
                    <ContentStatusBadge status={page.status} />
                  </td>
                  <td className="px-6 py-4 admin-text-muted text-xs">{new Date(page.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  )
}
