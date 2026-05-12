"use server"

import { createRuntime } from "@sovereign-cms/runtime"
import type { NavigationItem, NavigationScope } from "@sovereign-cms/core"

export async function loadNavigationItemsAction(input: {
  tenantId: string
  locale?: string
  scope?: NavigationScope
}): Promise<NavigationItem[]> {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid loadNavigationItems input")
  }

  if (input.scope !== undefined && input.scope !== "main" && input.scope !== "footer") {
    throw new Error("Invalid navigation scope")
  }

  const runtime = createRuntime()
  return runtime.navigationPersistence.listNavigationItems(input)
}
