"use server"

import { getAdminRuntime } from "@/lib/get-admin-runtime"
import type {
  UpdatePrivacyScanApprovalInput,
  UpdatePrivacyScanApprovalResult,
} from "@sovereign-cms/core"
import { isPrivacyScanApprovalStatus } from "@sovereign-cms/core"

export async function updatePrivacyScanApprovalAction(
  input: UpdatePrivacyScanApprovalInput
): Promise<UpdatePrivacyScanApprovalResult> {
  // Validate tenantId
  if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
    throw new Error("tenantId is required")
  }

  // Validate scanId
  if (typeof input.scanId !== "string" || input.scanId.trim().length === 0) {
    throw new Error("scanId is required")
  }

  // Validate approvalStatus
  if (!isPrivacyScanApprovalStatus(input.approvalStatus)) {
    throw new Error("approvalStatus is invalid")
  }

  const { runtime } = getAdminRuntime()
  return runtime.privacyScannerPersistence.updatePrivacyScanApproval(input)
}
