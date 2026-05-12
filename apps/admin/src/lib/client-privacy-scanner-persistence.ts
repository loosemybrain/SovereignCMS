/**
 * Client adapter for privacy scanner persistence.
 * Delegates to server-side privacy scanner boundaries via server actions.
 */

import type {
  CreatePrivacyScanInput,
  CreatePrivacyScanResult,
  PrivacyScanJob,
  UpdatePrivacyScanApprovalInput,
  UpdatePrivacyScanApprovalResult,
} from "@sovereign-cms/core"
import { createPrivacyScanAction } from "@/actions/create-privacy-scan"
import { loadPrivacyScansAction } from "@/actions/load-privacy-scans"
import { updatePrivacyScanApprovalAction } from "@/actions/update-privacy-scan-approval"

export const clientPrivacyScannerPersistence = {
  async listPrivacyScans(input: { tenantId: string }): Promise<PrivacyScanJob[]> {
    return loadPrivacyScansAction(input)
  },

  async createPrivacyScan(input: CreatePrivacyScanInput): Promise<CreatePrivacyScanResult> {
    return createPrivacyScanAction(input)
  },

  async updatePrivacyScanApproval(
    input: UpdatePrivacyScanApprovalInput
  ): Promise<UpdatePrivacyScanApprovalResult> {
    return updatePrivacyScanApprovalAction(input)
  },
}
