import type { PrivacyScanJob } from "@sovereign-cms/core"
import { PersistenceAdapterError } from "./errors"

type TenantOwnedRow = { tenantId: string; id?: string }

export function filterRowsByTenant<T extends TenantOwnedRow>(
  rows: T[],
  tenantId: string,
  operation: string,
): T[] {
  const mismatched = rows.filter((row) => row.tenantId !== tenantId)
  if (mismatched.length > 0) {
    throw new PersistenceAdapterError(
      "tenant_scope_mismatch",
      `${operation}: result set contained rows for other tenants`,
    )
  }
  return rows
}

export function assertTenantOwnedSettings(
  settings: { tenantId: string },
  tenantId: string,
  operation: string,
): void {
  if (settings.tenantId !== tenantId) {
    throw new PersistenceAdapterError(
      "tenant_scope_mismatch",
      `${operation}: settings belong to tenant ${settings.tenantId}, not ${tenantId}`,
    )
  }
}

export function findScanForTenant(
  scans: PrivacyScanJob[],
  tenantId: string,
  scanId: string,
  operation: string,
): PrivacyScanJob | null {
  const scan = scans.find((candidate) => candidate.id === scanId) ?? null
  if (!scan) {
    return null
  }
  if (scan.tenantId !== tenantId) {
    throw new PersistenceAdapterError(
      "tenant_scope_mismatch",
      `${operation}: scan ${scanId} belongs to tenant ${scan.tenantId}, not ${tenantId}`,
    )
  }
  return scan
}
