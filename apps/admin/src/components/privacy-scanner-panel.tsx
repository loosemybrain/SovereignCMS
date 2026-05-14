"use client"

import { useState } from "react"
import type {
  PrivacyScanJob,
  PrivacyScanApprovalStatus,
} from "@sovereign-cms/core"
import { clientPrivacyScannerPersistence } from "@/lib/client-privacy-scanner-persistence"
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminCardTitle,
  AdminInput,
  AdminSelect,
} from "@/components/admin-ui"

type Props = {
  tenantId: string
  initialScans: PrivacyScanJob[]
}

export function PrivacyScannerPanel({ tenantId, initialScans }: Props) {
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
      setError("Target URL is required")
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
        setSuccessMessage(
          "Scan was queued in mock mode. No real browser scan is executed yet.",
        )

        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        setError("Failed to create privacy scan")
      }
    } catch {
      setError("An unexpected error occurred")
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
        setSuccessMessage("Approval status updated")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setError("Failed to update approval status")
      }
    } catch {
      setError("An unexpected error occurred")
    }
  }

  return (
    <div className="space-y-6">
      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Create New Scan</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          {error ? (
            <AdminAlert variant="destructive" title="Something went wrong" className="mb-4">
              {error}
            </AdminAlert>
          ) : null}

          {successMessage ? (
            <AdminAlert variant="success" className="mb-4">
              {successMessage}
            </AdminAlert>
          ) : null}

          <form onSubmit={handleCreateScan} className="space-y-4">
            <div>
              <label htmlFor="targetUrl" className="block text-sm font-medium admin-text">
                Target URL
              </label>
              <AdminInput
                id="targetUrl"
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={isCreating}
                className="mt-1"
              />
            </div>

            <AdminButton type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Scan"}
            </AdminButton>
          </form>
        </AdminCardContent>
      </AdminCard>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold admin-text">Privacy Scans</h3>

        {scans.length === 0 ? (
          <div className="rounded-xl border admin-border admin-surface-muted p-6 text-center">
            <p className="text-sm admin-text-muted">No privacy scans yet</p>
          </div>
        ) : (
          scans.map((scan) => (
            <AdminCard key={scan.id}>
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase admin-text-muted">URL</p>
                  <p className="mt-1 break-all font-mono text-sm admin-text">{scan.targetUrl}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase admin-text-muted">Status</p>
                  <p className="mt-1 text-sm capitalize admin-text">{scan.status}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase admin-text-muted">Findings</p>
                  <p className="mt-1 text-sm admin-text">{scan.findings.length} finding(s)</p>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor={`approval-${scan.id}`} className="block text-sm font-medium admin-text">
                  Approval Status
                </label>
                <AdminSelect
                  id={`approval-${scan.id}`}
                  value={scan.approvalStatus}
                  onChange={(e) =>
                    handleUpdateApproval(scan.id, e.target.value as PrivacyScanApprovalStatus)
                  }
                  className="mt-1 max-w-md"
                >
                  <option value="draft">Draft</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </AdminSelect>
              </div>

              {scan.findings.length > 0 ? (
                <div>
                  <p className="text-sm font-medium admin-text">Findings:</p>
                  <ul className="mt-2 space-y-2">
                    {scan.findings.map((finding) => (
                      <li
                        key={finding.id}
                        className="rounded-lg border admin-border admin-surface-muted p-3 text-sm admin-text"
                      >
                        <div className="font-medium">{finding.name}</div>
                        {finding.provider ? (
                          <div className="text-xs admin-text-muted">Provider: {finding.provider}</div>
                        ) : null}
                        {finding.category ? (
                          <div className="text-xs admin-text-muted">Category: {finding.category}</div>
                        ) : null}
                        {finding.description ? (
                          <div className="mt-1 text-xs admin-text-muted">{finding.description}</div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm admin-text-muted">No findings yet.</p>
              )}

              <div className="mt-4 text-xs admin-text-muted">
                Created: {new Date(scan.createdAt).toLocaleString()}
              </div>
            </AdminCard>
          ))
        )}
      </div>

      <AdminAlert
        variant="warning"
        title="Hinweis"
        className="rounded-xl"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 9v4M12 17h.01M10.3 3.9L2.7 18.1c-.4.7.1 1.6.9 1.6h16.8c.8 0 1.3-.9.9-1.6L13.7 3.9c-.4-.7-1.4-.7-1.8 0z" />
          </svg>
        }
      >
        Dies ist eine Scanner-Basis. Es werden noch keine echten Browser-Scans ausgeführt. Manuelle Prüfung
        erforderlich; Freigaben ersetzen keine Rechtsberatung.
      </AdminAlert>
    </div>
  )
}
