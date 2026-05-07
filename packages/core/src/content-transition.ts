import type { ContentStatus } from "./content-status"

export type ContentTransitionAction = "publish" | "archive" | "restoreDraft"

export type TransitionPageStatusInput = {
  tenantId: string
  pageId: string
  locale: string
  action: ContentTransitionAction
}

export type TransitionPageStatusResult = {
  success: boolean
  status: ContentStatus
  transitionedAt: string
  persisted: boolean
}

/**
 * Determines the next status based on action and current status.
 * Validates transition rules.
 */
export function getNextStatusForAction(
  currentStatus: ContentStatus,
  action: ContentTransitionAction,
): ContentStatus {
  if (action === "publish") {
    if (currentStatus !== "draft") {
      throw new Error("Only draft pages can be published")
    }
    return "published"
  }

  if (action === "archive") {
    if (currentStatus !== "published") {
      throw new Error("Only published pages can be archived")
    }
    return "archived"
  }

  if (action === "restoreDraft") {
    if (currentStatus !== "archived") {
      throw new Error("Only archived pages can be restored to draft")
    }
    return "draft"
  }

  throw new Error(`Unsupported content transition action: ${action}`)
}

/**
 * Get human-readable label for transition action
 */
export function getTransitionActionLabel(action: ContentTransitionAction): string {
  const labels: Record<ContentTransitionAction, string> = {
    publish: "Publish",
    archive: "Archive",
    restoreDraft: "Restore Draft",
  }
  return labels[action]
}

/**
 * Determine available actions for a given status
 */
export function getAvailableActionsForStatus(status: ContentStatus): ContentTransitionAction[] {
  if (status === "draft") {
    return ["publish"]
  }
  if (status === "published") {
    return ["archive"]
  }
  if (status === "archived") {
    return ["restoreDraft"]
  }
  return []
}
