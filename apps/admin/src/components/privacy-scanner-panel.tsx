"use client"

import { useState } from "react"
import type {
  PrivacyScanApprovalStatus,
  PrivacyScanFinding,
  PrivacyScanJob,
  PrivacyScanStatus,
} from "@sovereign-cms/core"
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Shield,
} from "lucide-react"
import { cn } from "@sovereign-cms/ui"
import { clientPrivacyScannerPersistence } from "@/lib/client-privacy-scanner-persistence"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { formatAdminMessage } from "@/lib/admin-i18n"
import {
  AdminAlert,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminSectionCard,
} from "@/components/admin-ui"

type Props = {
  tenantId: string
  initialScans: PrivacyScanJob[]
}

const APPROVAL_ORDER: PrivacyScanApprovalStatus[] = ["draft", "reviewed", "approved", "rejected"]

function statusPillClass(status: PrivacyScanStatus): string {
  switch (status) {
    case "completed":
      return "border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
    case "failed":
    case "cancelled":
      return "border-red-500/35 bg-red-500/10 text-red-700 dark:text-red-300"
    case "running":
      return "border-sky-500/35 bg-sky-500/12 text-sky-800 dark:text-sky-200"
    default:
      return "border-[color-mix(in_oklab,var(--admin-border)_80%,transparent)] bg-[color-mix(in_oklab,var(--admin-surface-muted)_90%,var(--admin-surface))] admin-text"
  }
}

function providerTag(provider: string): string {
  return provider.replace(/\s+/g, "-").toUpperCase()
}

function categoryTag(category: NonNullable<PrivacyScanFinding["category"]>): string {
  const map: Record<NonNullable<PrivacyScanFinding["category"]>, string> = {
    necessary: "NOTWENDIG",
    "external-media": "EXTERNAL-MEDIA",
    analytics: "ANALYTICS",
    marketing: "MARKETING",
    unknown: "UNBEKANNT",
  }
  return map[category]
}

export function PrivacyScannerPanel({ tenantId, initialScans }: Props) {
  const { messages } = useAdminI18n()
  const p = messages.privacyPage
  const [scans, setScans] = useState<PrivacyScanJob[]>(initialScans)
  const [targetUrl, setTargetUrl] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleCreateScan = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    if (!targetUrl.trim()) {
      setError(p.urlRequired)
      return
    }

    setIsCreating(true)

    try {
      const result = await clientPrivacyScannerPersistence.createPrivacyScan({
        tenantId,
        targetUrl: targetUrl.trim(),
      })

      if (result.success) {
        setScans((prev) => [result.scan, ...prev])
        setTargetUrl("")
        setSuccessMessage(p.createSuccess)

        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        setError(p.createFailed)
      }
    } catch {
      setError(p.unexpectedError)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateApproval = async (scanId: string, status: PrivacyScanApprovalStatus) => {
    setError("")
    setSuccessMessage("")

    try {
      const result = await clientPrivacyScannerPersistence.updatePrivacyScanApproval({
        tenantId,
        scanId,
        approvalStatus: status,
      })

      if (result.success) {
        setScans((prev) =>
          prev.map((s) => (s.id === scanId ? { ...s, approvalStatus: status } : s)),
        )
        setSuccessMessage(p.approvalUpdated)
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setError(p.approvalUpdateFailed)
      }
    } catch {
      setError(p.unexpectedError)
    }
  }

  return (
    <div className="space-y-8">
      <AdminSectionCard
        variant="elevated"
        title={p.newScanTitle}
        description={p.newScanDescription}
        headerIcon={<Shield className="h-5 w-5" strokeWidth={2} aria-hidden />}
      >
        {error ? (
          <AdminAlert variant="destructive" title={p.hintTitle} className="mb-4">
            {error}
          </AdminAlert>
        ) : null}

        {successMessage ? (
          <AdminAlert variant="success" title={p.okTitle} className="mb-4">
            {successMessage}
          </AdminAlert>
        ) : null}

        <form onSubmit={handleCreateScan} className="space-y-4">
          <div>
            <label htmlFor="targetUrl" className="mb-1.5 block text-sm font-semibold tracking-tight admin-text">
              {p.targetUrlLabel}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 admin-text-muted"
                strokeWidth={2}
                aria-hidden
              />
              <AdminInput
                id="targetUrl"
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder={p.urlPlaceholder}
                disabled={isCreating}
                className="pl-10"
              />
            </div>
          </div>

          <AdminButton type="submit" disabled={isCreating} variant="primary" className="gap-2 px-4">
            <Shield className="h-4 w-4 opacity-95" strokeWidth={2} aria-hidden />
            {isCreating ? p.creating : p.createScanButton}
          </AdminButton>
        </form>
      </AdminSectionCard>

      <section aria-labelledby="privacy-scans-heading" className="space-y-4">
        <h2
          id="privacy-scans-heading"
          className="flex items-center gap-2.5 text-lg font-semibold tracking-tight admin-text"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color-mix(in_oklab,var(--admin-accent)_14%,var(--admin-surface-muted))] text-(--admin-accent)">
            <Shield className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          {p.scansHeading}
        </h2>

        {scans.length === 0 ? (
          <div className="rounded-xl border admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_45%,var(--admin-surface))] px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-medium admin-text">{p.emptyScansTitle}</p>
            <p className="mt-1 text-sm admin-text-muted">{p.emptyScansDescription}</p>
          </div>
        ) : (
          <ul className="space-y-5">
            {scans.map((scan) => (
              <li key={scan.id}>
                <div className="overflow-hidden rounded-xl border admin-border admin-surface shadow-sm">
                  <div className="border-b admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_75%,var(--admin-surface))] px-4 py-2.5">
                    <p className="text-sm font-semibold tracking-tight admin-text">{p.scanResultsTitle}</p>
                  </div>

                  <div className="space-y-5 p-4 sm:p-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_55%,transparent)] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] admin-text-muted">{p.urlLabel}</p>
                        <div className="mt-2 flex items-start gap-2">
                          <span
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_2px_color-mix(in_oklab,var(--admin-surface)_100%,transparent)]"
                            aria-hidden
                          />
                          <p className="break-all font-mono text-xs leading-relaxed admin-text sm:text-sm">
                            {scan.targetUrl}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg border admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_55%,transparent)] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] admin-text-muted">{p.statusLabel}</p>
                        <div className="mt-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
                              statusPillClass(scan.status),
                            )}
                          >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80" aria-hidden />
                            {p.scanStatus[scan.status as keyof typeof p.scanStatus] ?? scan.status}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-lg border admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_55%,transparent)] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] admin-text-muted">{p.findingsLabel}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/18 text-sm font-bold text-orange-800 dark:text-orange-200">
                            {scan.findings.length}
                          </span>
                          <span className="text-sm admin-text-muted">
                            {scan.findings.length === 1 ? p.findingSingular : p.findingPlural}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`approval-${scan.id}`}
                        className="mb-1.5 block text-sm font-semibold tracking-tight admin-text"
                      >
                        {p.approvalStatusLabel}
                      </label>
                      <AdminSelect
                        id={`approval-${scan.id}`}
                        value={scan.approvalStatus}
                        onChange={(e) =>
                          handleUpdateApproval(scan.id, e.target.value as PrivacyScanApprovalStatus)
                        }
                        className="max-w-md"
                      >
                        {APPROVAL_ORDER.map((key) => (
                          <option key={key} value={key}>
                            {p.approval[key]}
                          </option>
                        ))}
                      </AdminSelect>
                    </div>

                    {scan.findings.length > 0 ? (
                      <div>
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold admin-text">
                          <Shield className="h-4 w-4 text-(--admin-accent)" strokeWidth={2} aria-hidden />
                          {p.findingsSectionTitle}
                        </p>
                        <ul className="space-y-3">
                          {scan.findings.map((finding) => (
                            <li
                              key={finding.id}
                              className="flex gap-3 rounded-xl border admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_40%,var(--admin-surface))] p-4 shadow-sm"
                            >
                              <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/16 text-amber-700 dark:text-amber-300"
                                aria-hidden
                              >
                                <AlertTriangle className="h-5 w-5" strokeWidth={2} />
                              </div>
                              <div className="min-w-0 flex-1 space-y-2">
                                <p className="font-semibold leading-snug admin-text">{finding.name}</p>
                                <div className="flex flex-wrap gap-2">
                                  {finding.provider ? (
                                    <span className="rounded-full border admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_90%,transparent)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide admin-text-muted">
                                      {providerTag(finding.provider)}
                                    </span>
                                  ) : null}
                                  {finding.category ? (
                                    <span className="rounded-full border border-sky-500/35 bg-sky-500/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-800 dark:text-sky-200">
                                      {categoryTag(finding.category)}
                                    </span>
                                  ) : null}
                                </div>
                                {finding.description ? (
                                  <p className="text-xs leading-relaxed admin-text-muted">{finding.description}</p>
                                ) : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm admin-text-muted">{p.noFindings}</p>
                    )}

                    <div className="flex items-center justify-between border-t admin-border pt-4">
                      <p className="text-xs admin-text-muted">
                        {formatAdminMessage(p.createdAt, {
                          date: new Date(scan.createdAt).toLocaleString(),
                        })}
                      </p>
                      {scan.status === "completed" ? (
                        <CheckCircle2
                          className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          strokeWidth={2}
                          aria-label={p.scanCompleteAria}
                        />
                      ) : (
                        <span className="h-5 w-5 shrink-0" aria-hidden />
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AdminAlert
        variant="warning"
        title={p.noticeTitle}
        className="rounded-xl"
        icon={
          <AlertTriangle className="h-4 w-4" strokeWidth={2} aria-hidden />
        }
      >
        {p.footerWarning}
      </AdminAlert>
    </div>
  )
}
