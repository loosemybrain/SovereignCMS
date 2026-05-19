import { headers } from "next/headers"
import Link from "next/link"
import { Box, Building2, Database, GitBranch, Layers, LayoutTemplate } from "lucide-react"
import { DashboardCard } from "@/components/dashboard-card"
import { AdminLocaleToolbar } from "@/components/admin-locale-toolbar"
import { AdminConfigGrid, AdminPageHeader, AdminSectionCard, AdminStatusBadge } from "@/components/admin-ui"
import { formatAdminMessage, getAdminMessages } from "@/lib/admin-i18n"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"
import { loadAdminPages } from "@/lib/load-admin-pages"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

type Props = {
  searchParams: Promise<{ locale?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const uiLocale = await getAdminUiLocale()
  const t = getAdminMessages(uiLocale)
  const d = t.dashboard

  const {
    tenant,
    runtimeConfig,
    pages,
    localeContext,
    activeLocale,
    activeLocalePagesCount,
    pageVariantsCount,
    logicalPagesCount,
  } = await loadAdminPages({
    host,
    searchParams: params,
  })

  const { runtime } = getAdminRuntime({ host })
  const totalBlocks = await Promise.all(
    pages.map((page) => runtime.content.listBlocks({ tenantId: tenant.tenantId, pageId: page.id })),
  ).then((results) => results.reduce((sum, blocks) => sum + blocks.length, 0))

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={d.eyebrow}
        title={d.title}
        description={d.description}
        actions={
          <Link
            href={`/pages?locale=${activeLocale}`}
            className="text-sm font-medium admin-accent underline-offset-2 transition-opacity hover:opacity-85"
          >
            {d.pagesLink}
          </Link>
        }
      />

      <AdminSectionCard variant="elevated" title={d.workspaceTitle} description={d.workspaceDescription}>
        <AdminLocaleToolbar activeLocale={activeLocale} localeContext={localeContext} />
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs admin-text-muted">
          <span>{t.shell.tenant}</span>
          <AdminStatusBadge>{tenant.tenantId}</AdminStatusBadge>
          <span className="opacity-60">·</span>
          <span>Source</span>
          <AdminStatusBadge variant="muted">{tenant.source}</AdminStatusBadge>
        </div>
      </AdminSectionCard>

      <AdminSectionCard variant="elevated" title={d.metricsTitle} description={d.metricsDescription}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title={d.tenantId}
            value={tenant.tenantId}
            description={`Resolved via: ${tenant.source}`}
            variant="highlight"
            icon={<Building2 strokeWidth={2} />}
          />
          <DashboardCard
            title={d.pagesCurrentLocale}
            value={activeLocalePagesCount}
            description={formatAdminMessage(d.pagesInLocale, { locale: activeLocale })}
            icon={<LayoutTemplate strokeWidth={2} />}
          />
          <DashboardCard
            title={d.pageVariants}
            value={pageVariantsCount}
            description={d.pageVariantsDescription}
            icon={<Layers strokeWidth={2} />}
          />
          <DashboardCard
            title={d.logicalPages}
            value={logicalPagesCount}
            description={d.logicalPagesDescription}
            icon={<GitBranch strokeWidth={2} />}
          />
          <DashboardCard
            title={d.blocks}
            value={totalBlocks}
            description={d.blocksDescription}
            icon={<Box strokeWidth={2} />}
          />
          <DashboardCard
            title={d.database}
            value={runtimeConfig.databaseAdapter}
            description={d.databaseDescription}
            icon={<Database strokeWidth={2} />}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard variant="glass" title={d.runtimeConfigTitle} description={d.runtimeConfigDescription}>
        <AdminConfigGrid columns={2}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">DB Adapter</p>
            <p className="mt-2 font-mono text-lg admin-text">{runtimeConfig.databaseAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">Storage</p>
            <p className="mt-2 font-mono text-lg admin-text">{runtimeConfig.storageAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">Auth</p>
            <p className="mt-2 font-mono text-lg admin-text">{runtimeConfig.authAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">Environment</p>
            <p className="mt-2 font-mono text-lg admin-text">{runtimeConfig.appEnv}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">{d.defaultLocale}</p>
            <p className="mt-2 font-mono text-lg admin-text">{localeContext.defaultLocale}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">{d.supportedLocales}</p>
            <p className="mt-2 font-mono text-lg admin-text">
              {localeContext.supportedLocales.map((l) => l.code).join(", ")}
            </p>
          </div>
        </AdminConfigGrid>
      </AdminSectionCard>
    </div>
  )
}
