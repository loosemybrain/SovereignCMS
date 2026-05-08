import { headers } from "next/headers"
import Link from "next/link"
import { DashboardCard } from "@/components/dashboard-card"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { AdminCard, AdminPageHeader } from "@/components/admin-ui"
import { loadAdminPages } from "@/lib/load-admin-pages"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

type Props = {
  searchParams: Promise<{ locale?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
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

  // Get runtime to calculate total blocks
  const { runtime } = getAdminRuntime({ host })
  const totalBlocks = await Promise.all(
    pages.map((page) => runtime.db.blocks.listByPage({ tenantId: tenant.tenantId, pageId: page.id })),
  ).then((results) => results.reduce((sum, blocks) => sum + blocks.length, 0))

  const createHref = (locale: string) => {
    const params = new URLSearchParams()
    params.set("locale", locale)
    return `/dashboard?${params.toString()}`
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your CMS"
        actions={
          <Link
            href={`/pages?locale=${activeLocale}`}
            className="text-sm admin-accent hover:opacity-80 transition-colors"
          >
            Create new page in Pages overview →
          </Link>
        }
      />

      {/* Locale Switcher */}
      <div className="flex items-center justify-between">
        <AdminLocaleSwitcher
          activeLocale={activeLocale}
          localeContext={localeContext}
          createHref={createHref}
        />
        <div className="text-xs text-zinc-500">
          Tenant: <span className="text-zinc-300 font-mono">{tenant.tenantId}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Tenant ID"
          value={tenant.tenantId}
          description={`Resolved via: ${tenant.source}`}
          variant="highlight"
        />
        <DashboardCard
          title="Pages (Current Locale)"
          value={activeLocalePagesCount}
          description={`Pages in ${activeLocale} locale`}
        />
        <DashboardCard
          title="Page Variants"
          value={pageVariantsCount}
          description="All locale-specific records"
        />
        <DashboardCard
          title="Logical Pages"
          value={logicalPagesCount}
          description="Unique slugs across locales"
        />
        <DashboardCard title="Blocks" value={totalBlocks} description="Total content blocks" />
        <DashboardCard
          title="Database"
          value={runtimeConfig.databaseAdapter}
          description="Currently active"
        />
      </div>

      {/* Runtime Configuration */}
      <AdminCard className="p-0 overflow-hidden">
        <div className="border-b admin-border px-6 py-4 admin-surface-muted">
          <h2 className="text-lg font-semibold admin-text">Runtime Configuration</h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium admin-text-muted uppercase tracking-wide">DB Adapter</p>
            <p className="text-lg font-mono admin-text mt-2">{runtimeConfig.databaseAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-medium admin-text-muted uppercase tracking-wide">Storage</p>
            <p className="text-lg font-mono admin-text mt-2">{runtimeConfig.storageAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-medium admin-text-muted uppercase tracking-wide">Auth</p>
            <p className="text-lg font-mono admin-text mt-2">{runtimeConfig.authAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-medium admin-text-muted uppercase tracking-wide">Environment</p>
            <p className="text-lg font-mono admin-text mt-2">{runtimeConfig.appEnv}</p>
          </div>
          <div>
            <p className="text-xs font-medium admin-text-muted uppercase tracking-wide">Default Locale</p>
            <p className="text-lg font-mono admin-text mt-2">{localeContext.defaultLocale}</p>
          </div>
          <div>
            <p className="text-xs font-medium admin-text-muted uppercase tracking-wide">Supported Locales</p>
            <p className="text-lg font-mono admin-text mt-2">
              {localeContext.supportedLocales.map((l) => l.code).join(", ")}
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  )
}
