# Phase 25 Result – Publish Transition Foundation

**Status**: ✅ Complete  
**Date**: May 7, 2026  
**Branch**: main

## Summary

Phase 25 introduces a **clean foundation for content state transitions** with validated, rule-based status changes (draft → published → archived → draft). All transitions are server-side enforced with no versioning, approval, or scheduling logic.

## Changes

### New Files

#### 1. `packages/core/src/content-transition.ts`
Central transition type definitions:
- ✅ `ContentTransitionAction` ("publish" | "archive" | "restoreDraft")
- ✅ `TransitionPageStatusInput` contract
- ✅ `TransitionPageStatusResult` contract
- ✅ `getNextStatusForAction()` – validates transitions
- ✅ `getTransitionActionLabel()` – human-readable labels
- ✅ `getAvailableActionsForStatus()` – determines UI buttons

#### 2. `packages/runtime/src/page-status-persistence.ts`
Runtime-managed status persistence:
- ✅ `createPageStatusPersistence()` factory
- ✅ `transitionPageStatus()` method
- ✅ Delegates to `db.pages.transitionStatus()`
- ✅ Returns `TransitionPageStatusResult` with `persisted: false`

#### 3. `apps/admin/src/actions/transition-page-status.ts`
Server Action boundary for transitions:
- ✅ "use server" directive
- ✅ Input validation (tenantId, pageId, locale, action)
- ✅ Runtime creation (server-side only)
- ✅ Delegation to `runtime.pageStatusPersistence.transitionPageStatus()`

#### 4. `apps/admin/src/lib/client-page-status-persistence.ts`
Client adapter for transitions:
- ✅ Implements transition interface
- ✅ Delegates to server action
- ✅ Error handling
- ✅ No Runtime objects exposed

#### 5. `docs/architecture/page-status-transitions.md`
Architecture documentation:
- ✅ Valid transitions and rules
- ✅ Type contracts
- ✅ Implementation details
- ✅ Data flow diagrams
- ✅ Migration paths

### Updated Files

#### 1. `packages/core/src/index.ts`
**Changed**: Added exports
- ✅ `ContentTransitionAction` type
- ✅ `TransitionPageStatusInput` type
- ✅ `TransitionPageStatusResult` type
- ✅ `getNextStatusForAction()` function
- ✅ `getTransitionActionLabel()` function
- ✅ `getAvailableActionsForStatus()` function

#### 2. `packages/db/src/contracts.ts`
**Changed**: PageRepository extended
- ✅ Added `transitionStatus(input: TransitionPageStatusInput): Promise<CmsPage>`
- ✅ Imported `TransitionPageStatusInput` from core

#### 3. `packages/db/src/in-memory-adapter.ts`
**Changed**: PageRepository implementation
- ✅ Implemented `transitionStatus()`
- ✅ Finds page by ID + tenant + locale
- ✅ Calls `getNextStatusForAction()` for validation
- ✅ Updates status and updatedAt
- ✅ Throws if transition invalid or page not found

#### 4. `packages/runtime/src/runtime.ts`
**Changed**: SovereignRuntime extended
- ✅ Added `pageStatusPersistence` field
- ✅ Created via `createPageStatusPersistence({ db })`
- ✅ Included in return object

#### 5. `packages/runtime/src/index.ts`
**Changed**: Exports updated
- ✅ Added `createPageStatusPersistence` export

#### 6. `apps/admin/src/components/page-editor-client.tsx`
**Changed**: Editor state and UI
- ✅ Imported `ContentTransitionAction`, transition functions
- ✅ Added import: `clientPageStatusPersistence`
- ✅ Added state: `currentPageStatus`, `isTransitioningStatus`, `statusTransitionError`
- ✅ Added handler: `handleTransitionPageStatus()`
- ✅ Added UI: Status transition buttons (dynamically shown based on currentPageStatus)
- ✅ Buttons use `getAvailableActionsForStatus()` to determine visibility

## Architecture

### Validation Flow

```
User clicks "Publish" button
  ↓
handleTransitionPageStatus("publish")
  ↓
currentPageStatus = "draft" [valid]
  ↓
clientPageStatusPersistence.transitionPageStatus({
  tenantId, pageId, locale, action: "publish"
})
  ↓
Server Action: transitionPageStatusAction()
  ↓
createRuntime() [server-side]
  ↓
runtime.pageStatusPersistence.transitionPageStatus()
  ↓
db.pages.transitionStatus()
  ↓
InMemory: Find page, check if draft
  ↓
getNextStatusForAction("draft", "publish") → "published"
  ↓
Update page.status = "published"
  ↓
Return result with status: "published"
  ↓
setCurrentPageStatus("published")
  ↓
UI updates: Hides "Publish" button, shows "Archive" button
```

### Transition State Machine

```
┌──────────────────────────────────────────────┐
│           Content State Machine               │
├──────────────────────────────────────────────┤
│                                               │
│  [DRAFT]                                      │
│    │                                          │
│    │ action: "publish"                       │
│    │ rule: currentStatus === "draft"         │
│    ↓                                          │
│  [PUBLISHED]                                  │
│    │                                          │
│    │ action: "archive"                       │
│    │ rule: currentStatus === "published"     │
│    ↓                                          │
│  [ARCHIVED]                                   │
│    │                                          │
│    │ action: "restoreDraft"                  │
│    │ rule: currentStatus === "archived"      │
│    ↓                                          │
│  [DRAFT] (loop back)                         │
│                                               │
└──────────────────────────────────────────────┘
```

### Transition Rules (getNextStatusForAction)

| Current | Action | Valid? | Next | Error |
|---------|--------|--------|------|-------|
| draft | publish | ✅ | published | - |
| draft | archive | ❌ | - | Only published can archive |
| draft | restoreDraft | ❌ | - | Only archived can restore |
| published | publish | ❌ | - | Only draft can publish |
| published | archive | ✅ | archived | - |
| published | restoreDraft | ❌ | - | Only archived can restore |
| archived | publish | ❌ | - | Only draft can publish |
| archived | archive | ❌ | - | Only published can archive |
| archived | restoreDraft | ✅ | draft | - |

## Validation

✅ **TypeScript**: `npm run typecheck` → EXIT 0  
✅ **Build**: `npm run build` → EXIT 0  
✅ **ESLint**: `npm run lint` → EXIT 0  
✅ **No Breaking Changes**: All features work  

## File Changes Summary

| File | Type | Change |
|------|------|--------|
| `packages/core/src/content-transition.ts` | New | Transition types + logic |
| `packages/core/src/index.ts` | Updated | Exports |
| `packages/db/src/contracts.ts` | Updated | PageRepository.transitionStatus() |
| `packages/db/src/in-memory-adapter.ts` | Updated | Implemented transitionStatus() |
| `packages/runtime/src/page-status-persistence.ts` | New | Runtime persistence |
| `packages/runtime/src/runtime.ts` | Updated | Added pageStatusPersistence |
| `packages/runtime/src/index.ts` | Updated | Exports |
| `apps/admin/src/actions/transition-page-status.ts` | New | Server Action |
| `apps/admin/src/lib/client-page-status-persistence.ts` | New | Client adapter |
| `apps/admin/src/components/page-editor-client.tsx` | Updated | State + UI buttons |
| `docs/architecture/page-status-transitions.md` | New | Architecture docs |

## UI Changes

### Page Editor Status Actions

**Before**:
```
[Save Button]
```

**After**:
```
[Save Button]  [Publish]   (if draft)
or
[Save Button]  [Archive]   (if published)
or
[Save Button]  [Restore Draft]  (if archived)
```

Buttons disabled during transition.
Color-coded:
- Publish: Emerald
- Archive: Orange
- Restore: Amber

## What's NOT Changed

- ❌ Page data model: Unchanged
- ❌ Database schema: No migration
- ❌ Block handling: Identical
- ❌ Persistence: Still InMemory (persisted=false)
- ❌ Versioning: NOT added
- ❌ Approval: NOT added
- ❌ Scheduling: NOT added
- ❌ History: NOT added

## What's NOT Implemented

- ❌ **No versioning**: Transitions don't create versions
- ❌ **No approval workflow**: Direct status change
- ❌ **No scheduling**: Immediate transition
- ❌ **No archive enforcement**: Public rendering not changed
- ❌ **No audit log**: No history tracking
- ❌ **No bulk operations**: One page at a time

All can be added in future phases.

## Known Limitations (Intentional)

- ⏸ **persisted=false**: Still mock/InMemory
- ⏸ **No external DB**: Transitions not durable
- ⏸ **No API**: Only Server Action
- ⏸ **No confirmation dialogs**: Direct transitions

All acceptable for current phase.

## Migration Path

### To Add Approval Workflow (Phase 26)

```typescript
// New contract
export type ApproveStatusTransitionInput = {
  requestedBy: string
  requestedAction: ContentTransitionAction
  approvedBy: string
}

// Transitionable only after approval
runtime.approvalWorkflow.approveTransition(input)
```

No changes to existing transition contract.

### To Add Publish History (Phase 26)

```typescript
// Query history
runtime.pageHistory.getTransitionHistory({
  tenantId, pageId, locale
}) → Array<{ action, timestamp, fromStatus, toStatus }>
```

Transition logic unchanged.

### To Add Scheduling (Phase 27)

```typescript
// New contract
export type ScheduleTransitionInput = {
  transitionInput: TransitionPageStatusInput
  scheduledFor: Date
}

// Schedule for later
runtime.scheduler.scheduleTransition(input)
```

Immediate transitions still available.

## Summary

Phase 25 successfully:
- ✅ Defines validated transition rules
- ✅ Implements state machine (draft → published → archived → draft)
- ✅ Enforces transitions at repository level
- ✅ Provides runtime persistence abstraction
- ✅ Delegates to server action boundary
- ✅ Creates client adapter
- ✅ Integrates status buttons in editor
- ✅ Maintains mock persistence (persisted=false)
- ✅ Sets foundation for approval, history, scheduling

The transition foundation is now ready for Phase 26+ to add approval workflows, history tracking, scheduling, or other features without breaking the core transition contract.

---

**Ready for Phase 26: Approval & History Workflows** ✅
