import { headers } from "next/headers"
import Link from "next/link"
import { PageEditorClient } from "@/components/page-editor-client"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { loadAdminPageDetail } from "@/lib/load-admin-page-detail"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ locale?: string }>
}

export default async function AdminPageDetailRoute({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const result = await loadAdminPageDetail({
    host,
    slug,
    searchParams: sp,
  })

  if (result.notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/pages" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
            ← Back to Pages
          </Link>
        </div>
        <div className="rounded-lg border border-amber-800/50 bg-amber-900/20 p-6">
          <p className="text-amber-200 font-medium">Page not found</p>
          <p className="text-sm text-amber-300 mt-2">
            No page with slug &quot;{slug}&quot; found for locale &quot;{result.activeLocale}&quot;
          </p>
        </div>
      </div>
    )
  }

  if (result.error || !result.page) {
    return (
      <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-4 text-red-300">
        Failed to load page. Please try again.
      </div>
    )
  }

  const { tenant, runtimeConfig, page, blocks, localeContext, activeLocale } = result

  const createHref = (locale: string) => {
    const newParams = new URLSearchParams()
    newParams.set("locale", locale)
    return `/pages/${slug}?${newParams.toString()}`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Link
            href={`/pages?locale=${activeLocale}`}
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            ← Back to Pages
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-zinc-100">{page.title}</h1>
          <p className="text-sm text-zinc-400 mt-1">Edit page content and blocks</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-xs">
            <span className="font-mono">{page.slug}</span>
          </div>
          <div className="px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-xs">
            Locale: <span className="font-medium">{activeLocale}</span>
          </div>
          <ContentStatusBadge status={page.status} />
          <div className="px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-xs">
            Tenant: <span className="font-medium">{tenant.tenantId}</span>
          </div>
        </div>
      </div>

      {/* Locale Switcher */}
      <AdminLocaleSwitcher
        activeLocale={activeLocale}
        localeContext={localeContext}
        createHref={createHref}
      />

      {/* Editor */}
      <PageEditorClient page={page} blocks={blocks} tenant={tenant} runtimeConfig={runtimeConfig} />
    </div>
  )
}
