"use server"

import { getAdminRuntime } from "@/lib/get-admin-runtime"
import type { CreatePrivacyScanInput, CreatePrivacyScanResult } from "@sovereign-cms/core"
import { validatePrivacyScanTargetUrl } from "@sovereign-cms/core"

export async function createPrivacyScanAction(
  input: CreatePrivacyScanInput
): Promise<CreatePrivacyScanResult> {
  // Validate tenantId
  if (typeof input.tenantId !== "string" || input.tenantId.trim().length === 0) {
    throw new Error("tenantId is required")
  }

  // Validate targetUrl
  if (typeof input.targetUrl !== "string" || input.targetUrl.trim().length === 0) {
    throw new Error("targetUrl is required")
  }

  if (!validatePrivacyScanTargetUrl(input.targetUrl)) {
    throw new Error("targetUrl must be a valid HTTP or HTTPS URL")
  }

  const { runtime } = getAdminRuntime()
  return runtime.privacyScannerPersistence.createPrivacyScan(input)
}
