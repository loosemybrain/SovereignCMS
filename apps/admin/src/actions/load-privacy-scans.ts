"use server"

import { getAdminRuntime } from "@/lib/get-admin-runtime"
import type { PrivacyScanJob } from "@sovereign-cms/core"

export async function loadPrivacyScansAction(input: {
  tenantId: string
}): Promise<PrivacyScanJob[]> {
  // Validate tenantId
  if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
    return []
  }

  const { runtime } = getAdminRuntime()
  return runtime.privacyScannerPersistence.listPrivacyScans(input)
}
