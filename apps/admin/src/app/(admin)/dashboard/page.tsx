import { headers } from "next/headers"
import { DashboardCard } from "@/components/dashboard-card"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { loadAdminPages } from "@/lib/load-admin-pages"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

type Props = {
  searchParams: Promise<{ locale?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { tenant, runtimeConfig, pages, localeContext, activeLocale } = await loadAdminPages({
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
      <div>
        <h1 className="text-4xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Overview of your CMS</p>
      </div>

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
        <DashboardCard title="Pages" value={pages.length} description={`Total CMS pages (${activeLocale})`} />
        <DashboardCard title="Blocks" value={totalBlocks} description="Total content blocks" />
        <DashboardCard
          title="Database"
          value={runtimeConfig.databaseAdapter}
          description="Currently active"
        />
      </div>

      {/* Runtime Configuration */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-100">Runtime Configuration</h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">DB Adapter</p>
            <p className="text-lg font-mono text-zinc-100 mt-2">{runtimeConfig.databaseAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Storage</p>
            <p className="text-lg font-mono text-zinc-100 mt-2">{runtimeConfig.storageAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Auth</p>
            <p className="text-lg font-mono text-zinc-100 mt-2">{runtimeConfig.authAdapter}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Environment</p>
            <p className="text-lg font-mono text-zinc-100 mt-2">{runtimeConfig.appEnv}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Default Locale</p>
            <p className="text-lg font-mono text-zinc-100 mt-2">{localeContext.defaultLocale}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Supported Locales</p>
            <p className="text-lg font-mono text-zinc-100 mt-2">
              {localeContext.supportedLocales.map((l) => l.code).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
