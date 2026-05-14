"use client"

import * as React from "react"
import { Topbar, PageHeader } from "@/components/cms/topbar"
import { SectionCard, FieldGroup, FormField } from "@/components/cms/section-card"
import { CMSAlert } from "@/components/cms/cms-alert"
import { DataTable, StatusBadge, type Column, type StatusType } from "@/components/cms/data-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Filter } from "lucide-react"

interface Page {
  id: string
  title: string
  slug: string
  locale: string
  status: StatusType
  updated: string
}

const samplePages: Page[] = [
  {
    id: "1",
    title: "Startseite",
    slug: "home",
    locale: "de",
    status: "published",
    updated: "4.5.2026",
  },
]

const pageColumns: Column<Page>[] = [
  {
    key: "title",
    header: "Title",
    render: (item) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400">
          <FileText className="h-4 w-4" />
        </div>
        <span className="font-medium">{item.title}</span>
      </div>
    ),
  },
  {
    key: "slug",
    header: "Slug",
    render: (item) => (
      <code className="text-xs bg-muted/80 px-2 py-1 rounded-md font-mono border border-border/50">
        {item.slug}
      </code>
    ),
  },
  {
    key: "locale",
    header: "Locale",
    render: (item) => (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <span className="w-4 h-3 rounded-sm bg-gradient-to-r from-black via-red-500 to-yellow-400" />
        {item.locale}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "updated",
    header: "Updated",
    className: "text-muted-foreground",
  },
]

interface DebugInfo {
  tenant: string
  brand: string
  defaultTemplate: string
  runtimeDefaultLocale: string
  runtimeSupportedLocales: string
  compositionDefaultLocale: string
  compositionEnabledLocales: string
  effectiveDefaultLocale: string
  effectiveEnabledLocales: string
  droppedCompositionLocales: string
  allowedTemplates: string
  themePreset: string
}

export function PagesContent() {
  const [title, setTitle] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [template, setTemplate] = React.useState("basic-page-template")
  const [locale, setLocale] = React.useState("de")

  const debugInfo: DebugInfo = {
    tenant: "demo",
    brand: "demo",
    defaultTemplate: "basic-page-template",
    runtimeDefaultLocale: "de",
    runtimeSupportedLocales: "de",
    compositionDefaultLocale: "de",
    compositionEnabledLocales: "de, en",
    effectiveDefaultLocale: "de",
    effectiveEnabledLocales: "de",
    droppedCompositionLocales: "en",
    allowedTemplates: "empty-page-template, basic-page-template, landing-page-template",
    themePreset: "theme-demo",
  }

  return (
    <>
      <Topbar title="Pages" />

      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          <PageHeader
            title="Pages"
            description="Manage your CMS pages"
          />

          {/* Create New Page Form */}
          <SectionCard
            title="Create New Page"
            description="Create a new page with composition defaults for this tenant."
            variant="elevated"
          >
            <div className="space-y-6">
              <FieldGroup columns={1}>
                <FormField label="Title" required>
                  <Input
                    placeholder="Enter page title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>

                <FormField
                  label="Slug"
                  required
                  description="Lowercase kebab-case (letters, numbers, hyphens). Special characters are normalized away."
                >
                  <Input
                    placeholder="e.g., about or services/consulting"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>

                <FormField
                  label="Template"
                  description="Choose a starter template for initial blocks."
                >
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="animate-scale-in">
                      <SelectItem value="empty-page-template">Empty Page</SelectItem>
                      <SelectItem value="basic-page-template">Basic Page</SelectItem>
                      <SelectItem value="landing-page-template">Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Locale"
                  description="Enabled locales from tenant composition."
                >
                  <Select value={locale} onValueChange={setLocale}>
                    <SelectTrigger className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="animate-scale-in">
                      <SelectItem value="de">de</SelectItem>
                      <SelectItem value="en">en</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </FieldGroup>

              <div className="space-y-3">
                <CMSAlert variant="warning" dismissible>
                  Some composition locales are not supported by runtime: <strong>en</strong>.
                </CMSAlert>

                <CMSAlert variant="info">
                  Simple starter with a hero and one text section. Starter blocks: <strong>2</strong>.
                </CMSAlert>

                <CMSAlert variant="warning" dismissible>
                  Composition defaults: brand <strong>demo</strong>, default template{" "}
                  <strong>basic-page-template</strong>, default locale <strong>de</strong>.
                </CMSAlert>
              </div>

              <Button 
                className="w-full group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25" 
                size="lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                  Create Page
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Button>
            </div>
          </SectionCard>

          {/* Composition Debug */}
          <SectionCard
            title="Composition Debug"
            description="Debug information for the current composition."
            collapsible
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              {Object.entries(debugInfo).map(([key, value], index) => (
                <div 
                  key={key} 
                  className="group flex justify-between items-start gap-4 py-3 border-b border-border/30 last:border-0 transition-all duration-300 hover:bg-muted/30 -mx-2 px-2 rounded-lg"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span className="text-sm text-muted-foreground capitalize transition-colors duration-300 group-hover:text-foreground">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-medium text-right font-mono">{value}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters:</span>
            </div>
            <Badge variant="outline" className="text-xs px-3 py-1.5 gap-1.5 transition-all duration-300 hover:bg-muted/50 cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Showing pages for locale: <strong>de</strong>
            </Badge>
            <Badge variant="outline" className="text-xs px-3 py-1.5 transition-all duration-300 hover:bg-muted/50 cursor-default">
              Total variants: <strong>2</strong>
            </Badge>
            <Badge variant="outline" className="text-xs px-3 py-1.5 transition-all duration-300 hover:bg-muted/50 cursor-default">
              Logical pages: <strong>1</strong>
            </Badge>
          </div>

          {/* Pages Table */}
          <DataTable
            columns={pageColumns}
            data={samplePages}
            keyExtractor={(page) => page.id}
            onRowClick={(page) => console.log("Clicked:", page)}
          />
        </div>
      </div>
    </>
  )
}
