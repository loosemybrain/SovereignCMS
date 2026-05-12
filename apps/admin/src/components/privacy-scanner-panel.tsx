"use client"

import { useState } from "react"
import type {
  PrivacyScanJob,
  PrivacyScanApprovalStatus,
} from "@sovereign-cms/core"
import { clientPrivacyScannerPersistence } from "@/lib/client-privacy-scanner-persistence"

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
          "Scan was queued in mock mode. No real browser scan is executed yet."
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
          prev.map((s) => (s.id === scanId ? { ...s, approvalStatus: status } : s))
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
      {/* Create Scan Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Create New Scan</h3>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleCreateScan} className="space-y-4">
          <div>
            <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700">
              Target URL
            </label>
            <input
              id="targetUrl"
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={isCreating}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="inline-block rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isCreating ? "Creating..." : "Create Scan"}
          </button>
        </form>
      </div>

      {/* Scans List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Privacy Scans</h3>

        {scans.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-600">No privacy scans yet</p>
          </div>
        ) : (
          scans.map((scan) => (
            <div key={scan.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">URL</p>
                  <p className="mt-1 break-all font-mono text-sm text-gray-900">{scan.targetUrl}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{scan.status}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Findings</p>
                  <p className="mt-1 text-sm text-gray-900">{scan.findings.length} finding(s)</p>
                </div>
              </div>

              {/* Approval Status Selector */}
              <div className="mb-4">
                <label htmlFor={`approval-${scan.id}`} className="block text-sm font-medium text-gray-700">
                  Approval Status
                </label>
                <select
                  id={`approval-${scan.id}`}
                  value={scan.approvalStatus}
                  onChange={(e) =>
                    handleUpdateApproval(
                      scan.id,
                      e.target.value as PrivacyScanApprovalStatus
                    )
                  }
                  className="mt-1 rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Findings */}
              {scan.findings.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">Findings:</p>
                  <ul className="mt-2 space-y-2">
                    {scan.findings.map((finding) => (
                      <li key={finding.id} className="rounded bg-gray-50 p-3 text-sm text-gray-700">
                        <div className="font-medium">{finding.name}</div>
                        {finding.provider && (
                          <div className="text-xs text-gray-600">Provider: {finding.provider}</div>
                        )}
                        {finding.category && (
                          <div className="text-xs text-gray-600">Category: {finding.category}</div>
                        )}
                        {finding.description && (
                          <div className="mt-1 text-xs text-gray-600">{finding.description}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No findings yet.</p>
              )}

              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(scan.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg bg-amber-50 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-semibold">⚠️ Note:</span> This is a scanner foundation. It does not
          perform real browser scans yet. Manual review is required. Approval does not guarantee
          legal compliance.
        </p>
      </div>
    </div>
  )
}
