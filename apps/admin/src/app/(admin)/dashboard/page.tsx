import { headers } from "next/headers"
import Link from "next/link"
import { Box, Building2, Database, GitBranch, Layers, LayoutTemplate } from "lucide-react"
import { DashboardCard } from "@/components/dashboard-card"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { AdminConfigGrid, AdminPageHeader, AdminSectionCard, AdminStatusBadge } from "@/components/admin-ui"
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
        eyebrow="Orientierung"
        title="Dashboard"
        description="Kurzer Überblick über Mandant, Sprachen und Inhalte — ohne zusätzliche Kennzahlen."
        actions={
          <Link
            href={`/pages?locale=${activeLocale}`}
            className="text-sm font-medium admin-accent underline-offset-2 transition-opacity hover:opacity-85"
          >
            Zur Seitenübersicht →
          </Link>
        }
      />

      <AdminSectionCard
        variant="elevated"
        title="Arbeitsbereich"
        description="Sprache und Mandantenauflösung für diese Ansicht."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminLocaleSwitcher
            activeLocale={activeLocale}
            localeContext={localeContext}
            createHref={createHref}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs admin-text-muted">
            <span>Tenant</span>
            <AdminStatusBadge>{tenant.tenantId}</AdminStatusBadge>
            <span className="opacity-60">·</span>
            <span>Source</span>
            <AdminStatusBadge variant="muted">{tenant.source}</AdminStatusBadge>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        variant="elevated"
        title="Key metrics"
        description="Counts from the database for this tenant (no sample data)."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Tenant ID"
            value={tenant.tenantId}
            description={`Resolved via: ${tenant.source}`}
            variant="highlight"
            icon={<Building2 strokeWidth={2} />}
          />
          <DashboardCard
            title="Pages (Current Locale)"
            value={activeLocalePagesCount}
            description={`Pages in ${activeLocale} locale`}
            icon={<LayoutTemplate strokeWidth={2} />}
          />
          <DashboardCard
            title="Page Variants"
            value={pageVariantsCount}
            description="All locale-specific records"
            icon={<Layers strokeWidth={2} />}
          />
          <DashboardCard
            title="Logical Pages"
            value={logicalPagesCount}
            description="Unique slugs across locales"
            icon={<GitBranch strokeWidth={2} />}
          />
          <DashboardCard
            title="Blocks"
            value={totalBlocks}
            description="Total content blocks"
            icon={<Box strokeWidth={2} />}
          />
          <DashboardCard
            title="Database"
            value={runtimeConfig.databaseAdapter}
            description="Currently active"
            icon={<Database strokeWidth={2} />}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        variant="glass"
        title="Runtime Configuration"
        description="Adapter wiring from environment (read-only)."
      >
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
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">Default Locale</p>
            <p className="mt-2 font-mono text-lg admin-text">{localeContext.defaultLocale}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">Supported Locales</p>
            <p className="mt-2 font-mono text-lg admin-text">
              {localeContext.supportedLocales.map((l) => l.code).join(", ")}
            </p>
          </div>
        </AdminConfigGrid>
      </AdminSectionCard>
    </div>
  )
}
