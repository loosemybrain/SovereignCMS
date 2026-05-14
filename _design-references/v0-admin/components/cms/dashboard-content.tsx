"use client"

import Link from "next/link"
import { 
  ArrowRight, 
  Zap, 
  Database, 
  Globe, 
  Layers, 
  Box, 
  Server,
  HardDrive,
  Shield,
  MapPin,
  Languages,
  Activity
} from "lucide-react"
import { Topbar, PageHeader } from "@/components/cms/topbar"
import { SectionCard } from "@/components/cms/section-card"
import { StatCard, FeatureCard, ConfigGrid } from "@/components/cms/stat-card"

interface DashboardContentProps {
  tenant: string
  stats: {
    pagesCurrentLocale: number
    pageVariants: number
    logicalPages: number
    blocks: number
    database: string
  }
  config: {
    dbAdapter: string
    storage: string
    auth: string
    environment: string
    defaultLocale: string
    supportedLocales: string
  }
}

export function DashboardContent({ tenant, stats, config }: DashboardContentProps) {
  return (
    <>
      <Topbar title="Dashboard" />
      
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          <PageHeader
            title="Dashboard"
            description="Overview of your CMS"
            action={
              <Link
                href="/pages"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300"
              >
                <span className="relative">
                  Create new page in Pages overview
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            }
          />

          {/* Tenant Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border border-primary/20 animate-slide-up backdrop-blur-sm" style={{ animationDelay: '100ms' }}>
            <div className="relative">
              <Zap className="h-4 w-4 text-primary" />
              <div className="absolute inset-0 animate-ping">
                <Zap className="h-4 w-4 text-primary opacity-50" />
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              Tenant: <span className="text-primary font-bold">{tenant}</span>
            </span>
          </div>

          {/* Feature Cards Row - Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              title="Tenant ID"
              value={tenant}
              subtitle="Resolved via: host"
              icon={<Server className="h-5 w-5" />}
              gradient="blue"
              delay={0}
            />
            <FeatureCard
              title="Total Blocks"
              value={stats.blocks}
              subtitle="Content blocks in system"
              icon={<Box className="h-5 w-5" />}
              gradient="emerald"
              sparklineData={[2, 4, 3, 5, 4, 6, 5, 7, 6, 8]}
              delay={50}
            />
            <FeatureCard
              title="Database"
              value={stats.database}
              subtitle="Currently active"
              icon={<Database className="h-5 w-5" />}
              gradient="purple"
              delay={100}
            />
          </div>

          {/* Stats Grid with Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Pages (Current Locale)"
              value={stats.pagesCurrentLocale}
              description={`Pages in ${config.defaultLocale} locale`}
              icon={<Globe className="h-4 w-4" />}
              chartType="donut"
              chartValue={stats.pagesCurrentLocale}
              chartMax={10}
              chartColor="primary"
              trend="up"
              trendValue="+2"
              delay={150}
              href="/pages"
            />
            <StatCard
              label="Page Variants"
              value={stats.pageVariants}
              description="All locale-specific records"
              icon={<Layers className="h-4 w-4" />}
              chartType="sparkline"
              chartColor="emerald"
              sparklineData={[1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7]}
              trend="up"
              trendValue="+15%"
              delay={200}
            />
            <StatCard
              label="Logical Pages"
              value={stats.logicalPages}
              description="Unique slugs across locales"
              icon={<Activity className="h-4 w-4" />}
              chartType="bars"
              chartColor="amber"
              showActivity
              delay={250}
            />
          </div>

          {/* Runtime Configuration */}
          <SectionCard
            title="Runtime Configuration"
            description="Current system configuration"
            variant="elevated"
            headerIcon={<HardDrive className="h-5 w-5" />}
          >
            <ConfigGrid
              items={[
                { label: "DB Adapter", value: config.dbAdapter, icon: <Database className="h-4 w-4" /> },
                { label: "Storage", value: config.storage, icon: <HardDrive className="h-4 w-4" /> },
                { label: "Auth", value: config.auth, icon: <Shield className="h-4 w-4" /> },
                { label: "Environment", value: config.environment, icon: <Server className="h-4 w-4" /> },
                { label: "Default Locale", value: config.defaultLocale, icon: <MapPin className="h-4 w-4" /> },
                { label: "Supported Locales", value: config.supportedLocales, icon: <Languages className="h-4 w-4" /> },
              ]}
            />
          </SectionCard>
        </div>
      </div>
    </>
  )
}
