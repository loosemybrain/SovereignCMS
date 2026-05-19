"use server"

import type { NavigationItem, NavigationScope } from "@sovereign-cms/core"
import { resolveAdminOperationalReadScope } from "@/lib/resolve-admin-operational-read-scope"

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

  const { runtime, scope } = resolveAdminOperationalReadScope({
    operation: "navigation:read",
  })

  if (input.tenantId !== scope.tenantId) {
    throw new Error("client tenantId does not match server-resolved tenant scope")
  }

  if (input.scope === "footer") {
    return runtime.navigationPersistence.listFooterNavigationItems({
      tenantId: scope.tenantId,
      locale: input.locale,
    })
  }

  return runtime.navigationPersistence.listNavigationItems({
    tenantId: scope.tenantId,
    locale: input.locale,
    scope: input.scope ?? "main",
  })
}
