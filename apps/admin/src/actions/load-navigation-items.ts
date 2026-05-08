"use server"

import { createRuntime } from "@sovereign-cms/runtime"
import type { NavigationItem } from "@sovereign-cms/core"

export async function loadNavigationItemsAction(input: {
  tenantId: string
  locale?: string
}): Promise<NavigationItem[]> {
  if (typeof input.tenantId !== "string" || input.tenantId.length === 0) {
    throw new Error("Invalid loadNavigationItems input")
  }

  const runtime = createRuntime()
  return runtime.navigationPersistence.listNavigationItems(input)
}
