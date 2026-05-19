import type {
  CreatePrivacyScanInput,
  CreatePrivacyScanResult,
  PrivacyScanFinding,
  PrivacyScanJob,
  UpdatePrivacyScanApprovalInput,
  UpdatePrivacyScanApprovalResult,
} from "@sovereign-cms/core"
import type { PrivacyScannerPersistenceAdapter } from "@sovereign-cms/db"

export function createPrivacyScannerPersistence(input: {
  privacyScanner: PrivacyScannerPersistenceAdapter
}) {
  return {
    async listPrivacyScans(params: { tenantId: string }): Promise<PrivacyScanJob[]> {
      return input.privacyScanner.listScans(params)
    },

    async listPrivacyFindings(params: {
      tenantId: string
      scanId?: string
    }): Promise<PrivacyScanFinding[]> {
      return input.privacyScanner.listFindings(params)
    },

    async createPrivacyScan(
      createInput: CreatePrivacyScanInput
    ): Promise<CreatePrivacyScanResult> {
      const scan = await input.privacyScanner.createScan({
        tenantId: createInput.tenantId,
        input: createInput,
      })

      return {
        success: true,
        scan,
        persisted: false,
      }
    },

    async updatePrivacyScanApproval(
      updateInput: UpdatePrivacyScanApprovalInput
    ): Promise<UpdatePrivacyScanApprovalResult> {
      const scan = await input.privacyScanner.updateScanApproval({
        tenantId: updateInput.tenantId,
        input: updateInput,
      })

      return {
        success: true,
        scan,
        persisted: false,
      }
    },
  }
}
