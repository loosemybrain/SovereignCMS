export type PrivacyScanStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"

export type PrivacyScanApprovalStatus =
  | "draft"
  | "reviewed"
  | "approved"
  | "rejected"

export type PrivacyScanFindingType =
  | "cookie"
  | "local-storage"
  | "session-storage"
  | "external-request"
  | "script"
  | "iframe"
  | "other"

export type PrivacyScanFinding = {
  id: string
  type: PrivacyScanFindingType
  name: string
  provider?: string
  category?: "necessary" | "external-media" | "analytics" | "marketing" | "unknown"
  sourceUrl?: string
  description?: string
  detectedBeforeConsent?: boolean
  createdAt: string
}

export type PrivacyScanJob = {
  id: string
  tenantId: string
  locale?: string
  targetUrl: string
  status: PrivacyScanStatus
  approvalStatus: PrivacyScanApprovalStatus
  findings: PrivacyScanFinding[]
  errorMessage?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type CreatePrivacyScanInput = {
  tenantId: string
  locale?: string
  targetUrl: string
}

export type CreatePrivacyScanResult = {
  success: boolean
  scan: PrivacyScanJob
  persisted: boolean
}

export type UpdatePrivacyScanApprovalInput = {
  tenantId: string
  scanId: string
  approvalStatus: PrivacyScanApprovalStatus
}

export type UpdatePrivacyScanApprovalResult = {
  success: boolean
  scan: PrivacyScanJob
  persisted: boolean
}

export function isPrivacyScanApprovalStatus(
  value: unknown
): value is PrivacyScanApprovalStatus {
  return (
    value === "draft" ||
    value === "reviewed" ||
    value === "approved" ||
    value === "rejected"
  )
}

export function validatePrivacyScanTargetUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}
