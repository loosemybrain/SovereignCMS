import { headers } from "next/headers"
import Link from "next/link"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { loadAdminPages } from "@/lib/load-admin-pages"

type Props = {
  searchParams: Promise<{ locale?: string }>
}

export default async function PagesListPage({ searchParams }: Props) {
  const params = await searchParams
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const {
    pages,
    error,
    localeContext,
    activeLocale,
    activeLocalePagesCount,
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
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Pages</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your CMS pages</p>
      </div>

      {/* Locale Switcher */}
      <AdminLocaleSwitcher
        activeLocale={activeLocale}
        localeContext={localeContext}
        createHref={createHref}
      />

      {/* Page Counts Info */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="px-3 py-2 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300">
          Showing pages for locale: <span className="font-medium text-zinc-100">{activeLocale}</span>
        </div>
        <div className="px-3 py-2 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300">
          Total variants: <span className="font-medium text-zinc-100">{pageVariantsCount}</span>
        </div>
        <div className="px-3 py-2 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300">
          Logical pages: <span className="font-medium text-zinc-100">{logicalPagesCount}</span>
        </div>
      </div>

      {error === true ? (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-4 text-red-300">
          Failed to load pages. Please try again.
        </div>
      ) : pages.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-8 text-center text-zinc-400">
          <p className="text-sm">No pages for locale {activeLocale}</p>
          <p className="text-xs text-zinc-500 mt-2">
            Other locale variants may exist. Use locale switcher above to view them.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-3 text-left font-medium text-zinc-300">Title</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-300">Slug</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-300">Locale</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-300">Status</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-300">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="hover:bg-zinc-900/40 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 text-zinc-100">
                    <Link
                      href={`/pages/${page.slug}?locale=${activeLocale}`}
                      className="hover:underline font-medium"
                    >
                      {page.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{page.slug}</td>
                  <td className="px-6 py-4 text-zinc-400">{page.locale}</td>
                  <td className="px-6 py-4">
                    <ContentStatusBadge status={page.status} />
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">{new Date(page.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
