# Page Status Transitions

## Overview

Phase 25 introduces a **clean foundation for content state transitions** with validated, rule-based status changes:
- **draft** → **published**: Publish a page
- **published** → **archived**: Archive a page
- **archived** → **draft**: Restore to draft

No versioning, no approval workflows, no scheduling – just clear transition rules and server-side enforcement.

## Status Transition Rules

### Valid Transitions

```
draft ─────publish────→ published ─────archive────→ archived
  ↑                                                      │
  └──────────────── restoreDraft ──────────────────────┘
```

### Why These Rules?

1. **Draft → Published**: Ready to publish when fully edited
2. **Published → Archived**: Remove from public view
3. **Archived → Draft**: Restore for re-editing/re-publishing

No "direct" transitions (e.g., cannot go from draft to archived).
No "free" status setting (always via action).

## Types & Contracts

### ContentTransitionAction

```typescript
export type ContentTransitionAction = "publish" | "archive" | "restoreDraft"
```

### TransitionPageStatusInput

```typescript
export type TransitionPageStatusInput = {
  tenantId: string
  pageId: string
  locale: string
  action: ContentTransitionAction
}
```

Required for:
- ✅ Tenant isolation
- ✅ Page identification (by ID, not slug)
- ✅ Locale-specific transitions
- ✅ Action-based state change

### TransitionPageStatusResult

```typescript
export type TransitionPageStatusResult = {
  success: boolean
  status: ContentStatus
  transitionedAt: string
  persisted: boolean  // false for InMemory
}
```

**Key Point**: `persisted=false` indicates this is mock/InMemory persistence (not durable).

## Implementation

### 1. Repository Contract

**Location**: `packages/db/src/contracts.ts`

```typescript
export interface PageRepository {
  // Existing:
  findBySlug(...): Promise<CmsPage | null>
  listByTenant(...): Promise<CmsPage[]>

  // New:
  transitionStatus(input: TransitionPageStatusInput): Promise<CmsPage>
}
```

Enforces transition logic at repository level.

### 2. InMemory Adapter Implementation

**Location**: `packages/db/src/in-memory-adapter.ts`

```typescript
async transitionStatus(input) {
  // Find page
  const pageIndex = store.pages.findIndex(
    (p) =>
      p.id === input.pageId &&
      p.tenantId === input.tenantId &&
      p.locale === input.locale,
  )

  if (pageIndex === -1) {
    throw new Error("Page not found")
  }

  // Get next status (validates transition rule)
  const nextStatus = getNextStatusForAction(page.status, input.action)

  // Update
  const updated: InternalPageRow = {
    ...page,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  }

  store.pages[pageIndex] = updated
  return toCmsPage(updated)
}
```

Behavior:
- Find page by ID, tenant, locale
- Throw if not found
- Call `getNextStatusForAction()` to validate transition
- Update status and timestamp
- Return updated page

### 3. Runtime PageStatusPersistence

**Location**: `packages/runtime/src/page-status-persistence.ts`

```typescript
export function createPageStatusPersistence(input: { db: DatabaseAdapter }) {
  return {
    async transitionPageStatus(
      transitionInput: TransitionPageStatusInput,
    ): Promise<TransitionPageStatusResult> {
      const page = await input.db.pages.transitionStatus(transitionInput)

      return {
        success: true,
        status: page.status,
        transitionedAt: new Date().toISOString(),
        persisted: false,  // InMemory
      }
    },
  }
}
```

Added to `SovereignRuntime`:
```typescript
export type SovereignRuntime = {
  // ... existing fields ...
  pageStatusPersistence: ReturnType<typeof createPageStatusPersistence>
}
```

### 4. Server Action Boundary

**Location**: `apps/admin/src/actions/transition-page-status.ts`

```typescript
"use server"

export async function transitionPageStatusAction(
  input: TransitionPageStatusInput,
): Promise<TransitionPageStatusResult> {
  // Validate
  if (!input.tenantId || !input.pageId || !input.locale) {
    throw new Error("Invalid input")
  }

  // Create runtime on server
  const runtime = createRuntime()

  // Delegate
  return runtime.pageStatusPersistence.transitionPageStatus(input)
}
```

No fetch, no API route, no client Runtime exposure.

### 5. Client Adapter

**Location**: `apps/admin/src/lib/client-page-status-persistence.ts`

```typescript
export const clientPageStatusPersistence = {
  async transitionPageStatus(input: TransitionPageStatusInput) {
    return transitionPageStatusAction(input)
  },
}
```

Delegates to server action.
Handles errors gracefully.

### 6. Editor Integration

**Location**: `apps/admin/src/components/page-editor-client.tsx`

State:
```typescript
const [currentPageStatus, setCurrentPageStatus] = useState(page.status)
const [isTransitioningStatus, setIsTransitioningStatus] = useState(false)
const [statusTransitionError, setStatusTransitionError] = useState<string | null>(null)
```

Handler:
```typescript
const handleTransitionPageStatus = async (action: ContentTransitionAction) => {
  try {
    setIsTransitioningStatus(true)
    setStatusTransitionError(null)

    const result = await clientPageStatusPersistence.transitionPageStatus({
      tenantId: tenant.tenantId,
      pageId: page.id,
      locale: page.locale,
      action,
    })

    if (result.success) {
      setCurrentPageStatus(result.status)
    }
  } catch (error) {
    setStatusTransitionError("Status transition failed")
  } finally {
    setIsTransitioningStatus(false)
  }
}
```

UI (dynamically show one button):
```tsx
{getAvailableActionsForStatus(currentPageStatus).map((action) => (
  <button
    onClick={() => handleTransitionPageStatus(action)}
    disabled={isTransitioningStatus}
  >
    {getTransitionActionLabel(action)}
  </button>
))}
```

## Transition Logic

### getNextStatusForAction()

**Location**: `packages/core/src/content-transition.ts`

```typescript
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

  throw new Error(`Unsupported action: ${action}`)
}
```

**Validation Rules**:
- ❌ Cannot publish published pages
- ❌ Cannot archive draft or archived pages
- ❌ Cannot restore published or draft pages
- ✅ Only valid transitions allowed

### getAvailableActionsForStatus()

Shows which buttons to display:

```typescript
export function getAvailableActionsForStatus(
  status: ContentStatus,
): ContentTransitionAction[] {
  if (status === "draft") return ["publish"]
  if (status === "published") return ["archive"]
  if (status === "archived") return ["restoreDraft"]
  return []
}
```

**Result**:
- Draft page → Shows only "Publish" button
- Published page → Shows only "Archive" button
- Archived page → Shows only "Restore Draft" button

## Data Flow

### User publishes a page

```
PageEditorClient
  ↓
handleTransitionPageStatus("publish")
  ↓
clientPageStatusPersistence.transitionPageStatus(input)
  ↓
transitionPageStatusAction(input) [Server]
  ↓
createRuntime() [Server-side only]
  ↓
runtime.pageStatusPersistence.transitionPageStatus(input)
  ↓
db.pages.transitionStatus(input)
  ↓
getNextStatusForAction("draft", "publish") → "published"
  ↓
Update page.status in InMemory store
  ↓
TransitionPageStatusResult { status: "published", persisted: false }
  ↓
setCurrentPageStatus("published")
  ↓
UI shows "Archive" button instead of "Publish"
```

## Known Limitations (Intentional)

- ❌ **No version history**: Transitions don't create versions
- ❌ **No approval workflow**: Direct status change
- ❌ **No scheduling**: Immediate transition
- ❌ **No automatic archival**: Manual action only
- ❌ **No history tracking**: No audit log

All can be added in future phases without breaking the transition contract.

## Migration Path

### Phase 25 → Phase 26 (Approval Workflow)

```typescript
// New contract: approveStatusTransition
export type ApproveTransitionInput = {
  tenantId: string
  pageId: string
  requestedAction: ContentTransitionAction
  requestedBy: string
}

// New persistence method
runtime.approvalWorkflow.approveTransition(input)
```

No changes to PageStatusPersistence needed.

### Phase 25 → Phase 27 (Publish History)

```typescript
// New contract: getTransitionHistory
export type GetTransitionHistoryInput = {
  tenantId: string
  pageId: string
  locale: string
}

// New persistence method
runtime.pageHistory.getTransitions(input)
```

Transition function remains unchanged.

## Summary

Phase 25 establishes:
- ✅ Validated transition rules (no free status setting)
- ✅ Clear state machine (draft → published → archived → draft)
- ✅ Server-side enforcement via repository contract
- ✅ Runtime PageStatusPersistence abstraction
- ✅ Client adapter delegation
- ✅ Editor UI with dynamic action buttons
- ✅ Mock persistence (persisted=false)
- ✅ Foundation for approval workflows, history, scheduling

No versioning, no approval, no scheduling – just clean, rule-based transitions for future phases.
