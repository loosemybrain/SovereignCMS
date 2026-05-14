"use client"

import * as React from "react"
import { ImageIcon, Film, FileText, Upload, Grid, List, Search, Filter, Plus, Check, X } from "lucide-react"
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

interface MediaAsset {
  id: string
  title: string
  type: "image" | "video" | "document"
  url: string
  alt: string
  status: StatusType
  updated: string
}

const sampleMedia: MediaAsset[] = [
  {
    id: "1",
    title: "Demo Image",
    type: "image",
    url: "/placeholder.svg",
    alt: "Demo image",
    status: "draft",
    updated: "2026-05-04T00:00:00.000Z",
  },
]

const mediaColumns: Column<MediaAsset>[] = [
  {
    key: "preview",
    header: "",
    className: "w-16",
    render: (item) => (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
        {item.type === "image" ? (
          <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
        ) : item.type === "video" ? (
          <Film className="h-5 w-5 text-muted-foreground/60" />
        ) : (
          <FileText className="h-5 w-5 text-muted-foreground/60" />
        )}
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (item) => (
      <div>
        <span className="font-medium block">{item.title}</span>
        <span className="text-xs text-muted-foreground">{item.alt}</span>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (item) => {
      const icons = {
        image: ImageIcon,
        video: Film,
        document: FileText,
      }
      const Icon = icons[item.type]
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{item.type}</span>
        </div>
      )
    },
  },
  {
    key: "url",
    header: "URL",
    render: (item) => (
      <code className="text-xs bg-muted/50 px-2 py-1 rounded-md font-mono text-muted-foreground truncate max-w-[180px] block">
        {item.url}
      </code>
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
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {new Date(item.updated).toLocaleDateString()}
      </span>
    ),
  },
]

// Media type selector
function MediaTypeSelector({ 
  value, 
  onChange 
}: { 
  value: string
  onChange: (value: string) => void 
}) {
  const types = [
    { value: "image", icon: ImageIcon, label: "Image" },
    { value: "video", icon: Film, label: "Video" },
    { value: "document", icon: FileText, label: "Document" },
  ]

  return (
    <div className="flex gap-2">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          className={cn(
            "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
            "hover:border-primary/30 hover:bg-primary/5",
            value === type.value ? "border-primary bg-primary/5 shadow-sm" : "border-border"
          )}
        >
          <div className={cn(
            "p-3 rounded-xl transition-colors",
            value === type.value ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <type.icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">{type.label}</span>
        </button>
      ))}
    </div>
  )
}

// Media card component for grid view
function MediaCard({ 
  asset, 
  isSelected, 
  onSelect, 
  onView 
}: { 
  asset: MediaAsset
  isSelected?: boolean
  onSelect?: () => void
  onView?: () => void
}) {
  const icons = {
    image: ImageIcon,
    video: Film,
    document: FileText,
  }
  const Icon = icons[asset.type]

  return (
    <div 
      className={cn(
        "group relative rounded-xl border bg-card overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20",
        isSelected && "ring-2 ring-primary border-primary"
      )}
    >
      {/* Selection indicator */}
      {onSelect && (
        <button
          onClick={onSelect}
          className={cn(
            "absolute top-3 left-3 z-10 w-6 h-6 rounded-full border-2 transition-all duration-200",
            "flex items-center justify-center",
            isSelected 
              ? "bg-primary border-primary text-primary-foreground" 
              : "bg-background/80 backdrop-blur border-muted-foreground/30 opacity-0 group-hover:opacity-100"
          )}
        >
          {isSelected && <Check className="h-3.5 w-3.5" />}
        </button>
      )}

      {/* Preview area */}
      <div 
        className="aspect-video bg-gradient-to-br from-muted to-muted/30 flex items-center justify-center relative cursor-pointer"
        onClick={onView}
      >
        <Icon className="h-10 w-10 text-muted-foreground/40 transition-transform duration-300 group-hover:scale-110" />
        <StatusBadge 
          status={asset.status} 
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" 
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <h4 className="font-medium text-sm truncate">{asset.title}</h4>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground capitalize">{asset.type}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(asset.updated).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export function MediaContent() {
  const [title, setTitle] = React.useState("")
  const [type, setType] = React.useState("image")
  const [url, setUrl] = React.useState("")
  const [alt, setAlt] = React.useState("")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedAsset, setSelectedAsset] = React.useState<string | null>(null)

  return (
    <>
      <Topbar title="Media" />

      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-6 px-4 sm:px-6 lg:px-8 space-y-8">
          <PageHeader
            title="Media"
            description="Tenant-aware media assets (locale-neutral)"
          />

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 stagger-children">
            {[
              { label: "Images", count: 1, icon: ImageIcon, color: "blue" },
              { label: "Videos", count: 0, icon: Film, color: "rose" },
              { label: "Documents", count: 0, icon: FileText, color: "amber" },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-transparent hover:border-primary/10 transition-all duration-200"
              >
                <div className={cn(
                  "p-2.5 rounded-xl",
                  stat.color === "blue" && "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                  stat.color === "rose" && "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                  stat.color === "amber" && "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                )}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Create Media Asset Form */}
          <SectionCard
            title="Upload Media Asset"
            description="Add a new media asset to your library"
            headerIcon={<Upload className="h-5 w-5" />}
            collapsible
          >
            <div className="space-y-6">
              <MediaTypeSelector value={type} onChange={setType} />

              <FieldGroup columns={2}>
                <FormField label="Title" required>
                  <Input
                    placeholder="Asset title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormField>

                <FormField label="Alt Text" description="For accessibility">
                  <Input
                    placeholder="Describe the content"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                  />
                </FormField>
              </FieldGroup>

              <FieldGroup columns={1}>
                <FormField label="URL" description="External URL or upload path">
                  <Input
                    placeholder="https://... or /path/to/file"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </FormField>
              </FieldGroup>

              <div className="flex items-center gap-3 pt-2">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Media Asset
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Media Library */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Media Library
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <div className="flex rounded-lg border overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {sampleMedia.map((asset) => (
                  <MediaCard
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset === asset.id}
                    onSelect={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
                    onView={() => console.log("View:", asset)}
                  />
                ))}
              </div>
            ) : (
              <DataTable
                columns={mediaColumns}
                data={sampleMedia}
                keyExtractor={(item) => item.id}
                onRowClick={(item) => console.log("View:", item)}
              />
            )}
          </div>

          {/* Selected Asset Actions */}
          {selectedAsset && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border shadow-xl">
                <span className="text-sm font-medium">1 asset selected</span>
                <div className="h-4 w-px bg-border" />
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="destructive" className="gap-1">
                  <X className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
