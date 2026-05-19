"use server"

import type {
  UpdatePrivacyScanApprovalInput,
  UpdatePrivacyScanApprovalResult,
} from "@sovereign-cms/core"
import { isPrivacyScanApprovalStatus } from "@sovereign-cms/core"
import { resolveAdminWriteScope } from "@/lib/resolve-admin-write-scope"

/** Server-side privacy scan approval update. Phase 72: scoped with scan ownership check. */
export async function updatePrivacyScanApprovalAction(
  input: UpdatePrivacyScanApprovalInput,
): Promise<UpdatePrivacyScanApprovalResult> {
  if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
    throw new Error("tenantId is required")
  }

  if (typeof input.scanId !== "string" || input.scanId.trim().length === 0) {
    throw new Error("scanId is required")
  }

  if (!isPrivacyScanApprovalStatus(input.approvalStatus)) {
    throw new Error("approvalStatus is invalid")
  }

  const { runtime, scope } = resolveAdminWriteScope({
    clientTenantId: input.tenantId,
    operation: "privacy:manage",
  })

  return runtime.privacyScannerPersistence.updatePrivacyScanApproval({
    ...input,
    tenantId: scope.tenantId,
  })
}
