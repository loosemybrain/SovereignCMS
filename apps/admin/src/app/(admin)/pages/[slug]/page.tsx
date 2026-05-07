import { headers } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageEditorClient } from "@/components/page-editor-client"
import { loadAdminPageDetail } from "@/lib/load-admin-page-detail"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function AdminPageDetailRoute({ params }: Props) {
  const { slug } = await params
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const result = await loadAdminPageDetail({ host, slug })

  if (result.notFound) {
    notFound()
  }

  if (result.error || !result.page) {
    return (
      <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-4 text-red-300">
        Failed to load page. Please try again.
      </div>
    )
  }

  const { tenant, runtimeConfig, page, blocks, supportedLocales } = result

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Link
            href="/pages"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            ← Back to Pages
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-zinc-100">{page.title}</h1>
          <p className="text-sm text-zinc-400 mt-1">Edit page content and blocks</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300">
            <span className="font-mono">{page.slug}</span>
          </div>
          <div className="px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300">
            Locale: <span className="font-medium">{page.locale}</span>
          </div>
          <div className="px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300">
            Status: <span className="font-medium">{page.status}</span>
          </div>
          <div className="px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300">
            Tenant: <span className="font-medium">{tenant.tenantId}</span>
          </div>
        </div>
        {supportedLocales.length > 0 && (
          <div className="text-xs text-zinc-400">
            Supported locales: {supportedLocales.join(", ")}
          </div>
        )}
      </div>

      {/* Editor */}
      <PageEditorClient page={page} blocks={blocks} tenant={tenant} runtimeConfig={runtimeConfig} />
    </div>
  )
}
