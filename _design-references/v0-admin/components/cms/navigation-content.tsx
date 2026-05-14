"use client"

import * as React from "react"
import { Compass, Link2, ExternalLink, GripVertical, Plus, ChevronDown } from "lucide-react"
import { Topbar, PageHeader } from "@/components/cms/topbar"
import { SectionCard, FieldGroup, FormField } from "@/components/cms/section-card"
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
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  type: "page" | "external"
  target: string
  status: StatusType
  sort: number
}

const sampleNavItems: NavItem[] = [
  {
    id: "1",
    label: "Startseite",
    type: "page",
    target: "page-demo-home-de",
    status: "published",
    sort: 1,
  },
]

const navColumns: Column<NavItem>[] = [
  {
    key: "drag",
    header: "",
    className: "w-10",
    render: () => (
      <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab hover:text-muted-foreground transition-colors" />
    ),
  },
  {
    key: "label",
    header: "Label",
    render: (item) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-primary/10">
          {item.type === "external" ? (
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Link2 className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
        <span className="font-medium">{item.label}</span>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (item) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        item.type === "page" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      )}>
        {item.type}
      </span>
    ),
  },
  {
    key: "target",
    header: "Target",
    render: (item) => (
      <code className="text-xs bg-muted/50 px-2 py-1 rounded-md font-mono text-muted-foreground">
        {item.target}
      </code>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "sort",
    header: "Order",
    className: "text-right",
    render: (item) => (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
        {item.sort}
      </span>
    ),
  },
]

// Scope selector card component
function ScopeCard({ 
  scope, 
  label, 
  count, 
  isActive, 
  onClick 
}: { 
  scope: string
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5",
        isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <Compass className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">{scope}</p>
        </div>
      </div>
      <div className={cn(
        "min-w-[28px] h-7 px-2 rounded-full flex items-center justify-center text-xs font-semibold",
        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {count}
      </div>
    </button>
  )
}

export function NavigationContent() {
  const [activeScope, setActiveScope] = React.useState("main")
  const [label, setLabel] = React.useState("")
  const [type, setType] = React.useState("page")
  const [page, setPage] = React.useState("home")
  const [isFormExpanded, setIsFormExpanded] = React.useState(true)

  const scopes = [
    { scope: "main", label: "Header Navigation", count: 1 },
    { scope: "footer", label: "Footer Links", count: 0 },
    { scope: "legal", label: "Legal Links", count: 0 },
  ]

  return (
    <>
      <Topbar title="Navigation" />

      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-6 px-4 sm:px-6 lg:px-8 space-y-8">
          <PageHeader
            title="Navigation"
            description="Manage navigation items by locale"
          />

          {/* Scope Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger-children">
            {scopes.map((s) => (
              <ScopeCard
                key={s.scope}
                scope={s.scope}
                label={s.label}
                count={s.count}
                isActive={activeScope === s.scope}
                onClick={() => setActiveScope(s.scope)}
              />
            ))}
          </div>

          {/* Create Navigation Item Form */}
          <SectionCard
            title="Create Navigation Item"
            description={`Add a new link to ${activeScope} navigation for locale: de`}
            headerIcon={<Plus className="h-5 w-5" />}
            collapsible
            defaultOpen={isFormExpanded}
          >
            <div className="space-y-6">
              <FieldGroup columns={2}>
                <FormField label="Label" required>
                  <Input
                    placeholder="Enter link label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </FormField>

                <FormField label="Link Type">
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4" />
                          Internal Page
                        </div>
                      </SelectItem>
                      <SelectItem value="external">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          External URL
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </FieldGroup>

              {type === "page" ? (
                <FieldGroup columns={1}>
                  <FormField label="Target Page">
                    <Select value={page} onValueChange={setPage}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Startseite (home)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </FieldGroup>
              ) : (
                <FieldGroup columns={1}>
                  <FormField label="External URL">
                    <Input placeholder="https://example.com" />
                  </FormField>
                </FieldGroup>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Navigation Item
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLabel("")}>
                  Reset
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Navigation Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {scopes.find(s => s.scope === activeScope)?.label} Items
              </h3>
              <p className="text-xs text-muted-foreground">
                Drag to reorder
              </p>
            </div>
            <DataTable
              columns={navColumns}
              data={sampleNavItems}
              keyExtractor={(item) => item.id}
              onRowClick={(item) => console.log("Edit:", item)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
