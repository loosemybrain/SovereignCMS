import type {
  CreatePrivacyScanInput,
  CreatePrivacyScanResult,
  PrivacyScanJob,
  UpdatePrivacyScanApprovalInput,
  UpdatePrivacyScanApprovalResult,
} from "@sovereign-cms/core"
import type { DatabaseAdapter } from "@sovereign-cms/db"

export function createPrivacyScannerPersistence(input: { db: DatabaseAdapter }) {
  return {
    async listPrivacyScans(params: { tenantId: string }): Promise<PrivacyScanJob[]> {
      return input.db.privacyScans.listByTenant(params)
    },

    async createPrivacyScan(
      createInput: CreatePrivacyScanInput
    ): Promise<CreatePrivacyScanResult> {
      const scan = await input.db.privacyScans.create(createInput)

      return {
        success: true,
        scan,
        persisted: false,
      }
    },

    async updatePrivacyScanApproval(
      updateInput: UpdatePrivacyScanApprovalInput
    ): Promise<UpdatePrivacyScanApprovalResult> {
      const scan = await input.db.privacyScans.updateApproval(updateInput)

      return {
        success: true,
        scan,
        persisted: false,
      }
    },
  }
}
