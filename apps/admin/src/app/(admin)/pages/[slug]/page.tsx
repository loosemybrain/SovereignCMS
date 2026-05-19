import { headers } from "next/headers"
import Link from "next/link"
import { PageEditorClient } from "@/components/page-editor-client"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { AdminBadge, AdminPageHeader } from "@/components/admin-ui"
import { loadAdminPageDetail } from "@/lib/load-admin-page-detail"
import { formatAdminMessage, getAdminMessages } from "@/lib/admin-i18n"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"

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
  const t = getAdminMessages(await getAdminUiLocale())
  const p = t.pages

  if (result.notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/pages" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
            {p.backToPages}
          </Link>
        </div>
        <div className="rounded-lg border border-amber-800/50 bg-amber-900/20 p-6">
          <p className="text-amber-200 font-medium">{p.pageNotFound}</p>
          <p className="text-sm text-amber-300 mt-2">
            {formatAdminMessage(p.pageNotFoundDetail, {
              slug,
              locale: result.activeLocale,
            })}
          </p>
        </div>
      </div>
    )
  }

  if (result.error || !result.page) {
    return (
      <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-4 text-red-300">
        {p.loadPageFailed}
      </div>
    )
  }

  const {
    tenant,
    runtimeConfig,
    page,
    blocks,
    mediaCompositionGovernanceHints,
    navigationGovernanceItems,
    localeContext,
    activeLocale,
  } = result

  return (
    <div className="admin-page-editor-layout space-y-4">
      <AdminPageHeader
        eyebrow={p.editorEyebrow}
        title={page.title}
        description={p.editorDescription}
        meta={
          <>
            <AdminBadge variant="muted" className="rounded px-2 py-1">
              <span className="font-mono">{page.slug}</span>
            </AdminBadge>
            <AdminBadge variant="muted" className="rounded px-2 py-1">
              {formatAdminMessage(p.localeMeta, { locale: activeLocale })}
            </AdminBadge>
            <ContentStatusBadge status={page.status} />
            <AdminBadge variant="muted" className="rounded px-2 py-1">
              {formatAdminMessage(p.tenantMeta, { tenant: tenant.tenantId })}
            </AdminBadge>
          </>
        }
        actions={
          <Link
            href={`/pages?locale=${activeLocale}`}
            className="text-sm font-medium admin-text-muted underline-offset-2 transition-colors hover:admin-text"
          >
            {p.backToPages}
          </Link>
        }
      />

      <AdminLocaleSwitcher activeLocale={activeLocale} localeContext={localeContext} />

      {/* Editor */}
      <PageEditorClient
        page={page}
        blocks={blocks}
        mediaCompositionGovernanceHints={mediaCompositionGovernanceHints}
        navigationGovernanceItems={navigationGovernanceItems}
        tenant={tenant}
        databaseAdapterLabel={String(runtimeConfig.databaseAdapter)}
      />
    </div>
  )
}
