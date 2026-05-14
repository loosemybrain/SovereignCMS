"use client"

import * as React from "react"
import { Topbar, PageHeader } from "@/components/cms/topbar"
import { SectionCard, FormField } from "@/components/cms/section-card"
import { CMSAlert } from "@/components/cms/cms-alert"
import { StatusBadge, type StatusType } from "@/components/cms/data-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Shield, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Finding {
  id: string
  title: string
  provider: string
  category: string
  description: string
}

interface PrivacyScan {
  id: string
  url: string
  status: StatusType
  findingsCount: number
  approvalStatus: "draft" | "approved" | "rejected"
  findings: Finding[]
  createdAt: string
}

const sampleScans: PrivacyScan[] = [
  {
    id: "1",
    url: "https://example.com",
    status: "completed",
    findingsCount: 2,
    approvalStatus: "draft",
    findings: [
      {
        id: "f1",
        title: "Google Maps Embed",
        provider: "google-maps",
        category: "external-media",
        description: "External iframe from Google Maps (properly gated by consent)",
      },
      {
        id: "f2",
        title: "External Embed",
        provider: "google-maps",
        category: "external-media",
        description: "Embedded map content",
      },
    ],
    createdAt: "11.5.2026, 12:00:00",
  },
]

function FindingCard({ finding, index }: { finding: Finding; index: number }) {
  return (
    <div 
      className="group relative rounded-xl border bg-gradient-to-br from-muted/50 to-muted/20 p-5 space-y-3 transition-all duration-300 hover:shadow-md hover:border-primary/20 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{finding.title}</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-md bg-muted text-muted-foreground">
              {finding.provider}
            </span>
            <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary">
              {finding.category}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed pl-13">
        {finding.description}
      </p>
    </div>
  )
}

function ScanCard({ scan }: { scan: PrivacyScan }) {
  const [approvalStatus, setApprovalStatus] = React.useState(scan.approvalStatus)

  return (
    <SectionCard title="Scan Results" variant="elevated">
      <div className="space-y-6">
        {/* Scan Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="group p-4 rounded-xl bg-muted/30 transition-all duration-300 hover:bg-muted/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              URL
            </p>
            <p className="text-sm font-mono truncate flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {scan.url}
            </p>
          </div>
          <div className="group p-4 rounded-xl bg-muted/30 transition-all duration-300 hover:bg-muted/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Status
            </p>
            <StatusBadge status={scan.status} />
          </div>
          <div className="group p-4 rounded-xl bg-muted/30 transition-all duration-300 hover:bg-muted/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Findings
            </p>
            <p className="text-sm font-medium flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                scan.findingsCount > 0 
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" 
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              )}>
                {scan.findingsCount}
              </span>
              finding(s)
            </p>
          </div>
        </div>

        {/* Approval Status */}
        <FormField label="Approval Status">
          <Select value={approvalStatus} onValueChange={(v) => setApprovalStatus(v as typeof approvalStatus)}>
            <SelectTrigger className="w-full max-w-xs transition-all duration-300 focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="animate-scale-in">
              <SelectItem value="draft">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Draft
                </span>
              </SelectItem>
              <SelectItem value="approved">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Approved
                </span>
              </SelectItem>
              <SelectItem value="rejected">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Rejected
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {/* Findings */}
        <div className="space-y-4">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Findings:
          </p>
          <div className="space-y-4">
            {scan.findings.map((finding, index) => (
              <FindingCard key={finding.id} finding={finding} index={index} />
            ))}
          </div>
        </div>

        {/* Created timestamp */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Created: {scan.createdAt}
          </p>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </div>
      </div>
    </SectionCard>
  )
}

export function PrivacyContent() {
  const [targetUrl, setTargetUrl] = React.useState("https://example.com")

  return (
    <>
      <Topbar title="Privacy" />

      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          <PageHeader
            title="Privacy"
            description="Privacy scan jobs and manual review"
          />

          {/* Create New Scan */}
          <SectionCard
            title="Create New Scan"
            description="Start a new privacy scan for a URL"
            variant="elevated"
          >
            <div className="space-y-5">
              <FormField label="Target URL">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://example.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </FormField>

              <Button className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
                <span className="relative z-10 flex items-center gap-2">
                  <Shield className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  Create Scan
                </span>
              </Button>
            </div>
          </SectionCard>

          {/* Privacy Scans */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 animate-slide-up">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Shield className="h-4 w-4" />
              </div>
              Privacy Scans
            </h3>
            {sampleScans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </div>

          {/* Note */}
          <CMSAlert variant="warning" title="Note">
            This is a scanner foundation. It does not perform real browser scans yet.
            Manual review is required. Approval does not guarantee legal compliance.
          </CMSAlert>
        </div>
      </div>
    </>
  )
}
