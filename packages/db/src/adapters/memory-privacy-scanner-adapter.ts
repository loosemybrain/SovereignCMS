import type {
  CreatePrivacyScanInput,
  PrivacyScanFinding,
  PrivacyScanJob,
  UpdatePrivacyScanApprovalInput,
} from "@sovereign-cms/core"
import type { DatabaseAdapter } from "../contracts"
import type { PrivacyScannerPersistenceAdapter } from "./types"
import { PersistenceAdapterError, normalizeAdapterError } from "./errors"
import { requireScopedContentTenantId } from "./assert-content-write-tenant"
import { requireAdapterTenantId } from "./require-tenant-id"
import { filterRowsByTenant, findScanForTenant } from "./assert-operational-read-tenant"

function assertScanOwnedByTenant(
  scan: PrivacyScanJob | undefined,
  tenantId: string,
  scanId: string,
  operation: string,
): asserts scan is PrivacyScanJob {
  if (!scan) {
    throw new PersistenceAdapterError(
      "scan_not_found",
      `${operation}: scan not found for tenant ${tenantId} (scanId=${scanId})`,
    )
  }

  if (scan.tenantId !== tenantId) {
    throw new PersistenceAdapterError(
      "tenant_scope_mismatch",
      `${operation}: scan ${scanId} belongs to tenant ${scan.tenantId}, not ${tenantId}`,
    )
  }
}

export function createPrivacyScannerAdapterFromDatabase(
  db: DatabaseAdapter,
): PrivacyScannerPersistenceAdapter {
  return {
    async listScans(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listScans")
      try {
        const scans = await db.privacyScans.listByTenant({ tenantId })
        return filterRowsByTenant(scans, tenantId, "listScans")
      } catch (error) {
        throw normalizeAdapterError("listScans", error)
      }
    },

    async listFindings(params) {
      const tenantId = requireAdapterTenantId(params.tenantId, "listFindings")
      try {
        const scans = await db.privacyScans.listByTenant({ tenantId })
        const scopedScans = filterRowsByTenant(scans, tenantId, "listFindings")

        if (params.scanId) {
          const scan = findScanForTenant(scopedScans, tenantId, params.scanId, "listFindings")
          return scan?.findings ?? []
        }

        return scopedScans.flatMap((scan) => scan.findings)
      } catch (error) {
        throw normalizeAdapterError("listFindings", error)
      }
    },

    async createScan(params) {
      const tenantId = requireScopedContentTenantId(
        params.tenantId,
        params.input.tenantId,
        "createScan",
      )
      try {
        return await db.privacyScans.create({ ...params.input, tenantId })
      } catch (error) {
        throw normalizeAdapterError("createScan", error)
      }
    },

    async updateScanApproval(params) {
      const tenantId = requireScopedContentTenantId(
        params.tenantId,
        params.input.tenantId,
        "updateScanApproval",
      )
      try {
        const scans = await db.privacyScans.listByTenant({ tenantId })
        const existing = scans.find((scan) => scan.id === params.input.scanId)
        assertScanOwnedByTenant(existing, tenantId, params.input.scanId, "updateScanApproval")
        return await db.privacyScans.updateApproval({ ...params.input, tenantId })
      } catch (error) {
        throw normalizeAdapterError("updateScanApproval", error)
      }
    },
  }
}
