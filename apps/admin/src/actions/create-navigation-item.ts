"use server"

import { createRuntime } from "@sovereign-cms/runtime"
import type { CreateNavigationItemInput, CreateNavigationItemResult } from "@sovereign-cms/core"

export async function createNavigationItemAction(
  input: CreateNavigationItemInput,
): Promise<CreateNavigationItemResult> {
  if (
    typeof input.tenantId !== "string" ||
    input.tenantId.length === 0 ||
    typeof input.locale !== "string" ||
    input.locale.length === 0 ||
    typeof input.label !== "string" ||
    input.label.length === 0
  ) {
    throw new Error("Invalid createNavigationItem input")
  }

  if (input.scope !== undefined && input.scope !== "main" && input.scope !== "footer") {
    throw new Error("Invalid navigation scope")
  }

  const runtime = createRuntime()
  return runtime.navigationPersistence.createNavigationItem(input)
}
