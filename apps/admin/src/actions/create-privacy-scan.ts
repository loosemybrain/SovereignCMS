"use server"

import type { CreatePrivacyScanInput, CreatePrivacyScanResult } from "@sovereign-cms/core"
import { validatePrivacyScanTargetUrl } from "@sovereign-cms/core"
import { resolveAdminWriteScope } from "@/lib/resolve-admin-write-scope"

/** Server-side privacy scan create. Phase 72: scoped privacy scanner adapter write. */
export async function createPrivacyScanAction(
  input: CreatePrivacyScanInput,
): Promise<CreatePrivacyScanResult> {
  if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
    throw new Error("tenantId is required")
  }

  if (typeof input.targetUrl !== "string" || input.targetUrl.trim().length === 0) {
    throw new Error("targetUrl is required")
  }

  if (!validatePrivacyScanTargetUrl(input.targetUrl)) {
    throw new Error("targetUrl must be a valid HTTP or HTTPS URL")
  }

  const { runtime, scope } = resolveAdminWriteScope({
    clientTenantId: input.tenantId,
    locale: input.locale,
    operation: "privacy:manage",
  })

  return runtime.privacyScannerPersistence.createPrivacyScan({
    ...input,
    tenantId: scope.tenantId,
  })
}
