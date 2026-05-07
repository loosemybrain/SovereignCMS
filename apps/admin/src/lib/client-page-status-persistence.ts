/**
 * Client-side page status persistence adapter.
 * 
 * Implements status transitions by delegating to the server-side boundary
 * via transitionPageStatusAction.
 * 
 * This ensures:
 * - Runtime objects are never exposed to client
 * - Clean server/client boundary
 * - Type-safe transition contracts
 * - InMemory/Mock persistence (persisted=false)
 */
import type { TransitionPageStatusInput, TransitionPageStatusResult } from "@sovereign-cms/core"
import { transitionPageStatusAction } from "@/actions/transition-page-status"

export const clientPageStatusPersistence = {
  async transitionPageStatus(
    input: TransitionPageStatusInput,
  ): Promise<TransitionPageStatusResult> {
    try {
      console.log("[client-page-status-persistence] delegating to server action", {
        tenantId: input.tenantId,
        pageId: input.pageId,
        locale: input.locale,
        action: input.action,
      })

      // Delegate to server-side transition boundary
      const result = await transitionPageStatusAction(input)

      console.log("[client-page-status-persistence] server action succeeded", {
        success: result.success,
        status: result.status,
        transitionedAt: result.transitionedAt,
        persisted: result.persisted,
      })

      return result
    } catch (error) {
      console.error("[client-page-status-persistence] server action failed", error)

      // Return failure result
      return {
        success: false,
        status: "draft" as const,
        transitionedAt: new Date().toISOString(),
        persisted: false,
      }
    }
  },
}
