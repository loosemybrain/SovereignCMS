# Content State Model

## Overview

Phase 24 introduces a **centralized content state model** that provides clear semantics for page lifecycle states without implementing complex publish workflows, versioning, or scheduling.

## Content States

```typescript
type ContentStatus = "draft" | "published" | "archived"
```

### States

| State | Meaning | Visibility |
|-------|---------|-----------|
| **draft** | Page is being edited, not complete | Internal only |
| **published** | Page is live and visible | Public/frontend |
| **archived** | Page removed from public view but retained | Internal only |

## Types & Contracts

### 1. ContentStatus (Central Type)

**Location**: `packages/core/src/content-status.ts`

```typescript
export type ContentStatus = "draft" | "published" | "archived"

export const CONTENT_STATUSES: ContentStatus[] = [
  "draft",
  "published",
  "archived",
]

export function isContentStatus(value: unknown): value is ContentStatus {
  // Type guard for validation
}

export function getContentStatusLabel(status: ContentStatus): string {
  // Human-readable labels
}
```

**Exported from**: `@sovereign-cms/core`

### 2. CmsPage with ContentStatus

**Location**: `packages/core/src/cms.ts`

```typescript
export type CmsPage = CmsEntityBase & {
  slug: string
  locale: Locale
  title: string
  status: ContentStatus  // ← Uses central type
  seo?: Record<string, unknown>
}
```

### 3. SavePageDraftResult with Status

**Location**: `packages/core/src/editor.ts`

```typescript
export type SavePageDraftResult = {
  success: boolean
  savedAt: string
  persisted: boolean
  status: ContentStatus  // ← Always "draft" for draft saves
  updatedBlocks?: CmsBlock[]
}
```

**Key Point**: Draft saves always return `status: "draft"`. The state model distinguishes editor saves from publish operations (future phases).

## Implementation

### Runtime Persistence

**Location**: `packages/runtime/src/editor-persistence.ts`

```typescript
export function createEditorPersistence(
  input: CreateEditorPersistenceInput
): EditorPersistence {
  return {
    async savePageDraft(draftInput): Promise<SavePageDraftResult> {
      // Save blocks via db adapter
      const blocks = await input.db.blocks.replacePageBlocks({
        tenantId: draftInput.tenantId,
        pageId: draftInput.pageId,
        locale: draftInput.locale,
        blocks: draftInput.blocks,
      })

      return {
        success: true,
        savedAt: new Date().toISOString(),
        persisted: false,       // InMemory mock
        status: "draft",        // Always draft for this save method
        updatedBlocks: blocks,
      }
    },
  }
}
```

### Editor State

**Location**: `apps/admin/src/lib/editor-state.ts`

```typescript
type EditorState = {
  // ... existing fields ...
  lastSavedStatus: ContentStatus | null  // ← New field
}

// In useReducer return:
lastSavedStatus: state.lastSavedStatus,
setLastSavedStatus: (status: ContentStatus | null) =>
  dispatch({ type: "setLastSavedStatus", status }),
```

### PageEditorClient Save Flow

**Location**: `apps/admin/src/components/page-editor-client.tsx`

```typescript
const handleSave = async () => {
  try {
    const result = await clientEditorPersistence.savePageDraft(input)

    if (result.success) {
      setIsDirty(false)
      setLastSavedAt(result.savedAt)
      setLastSavedStatus(result.status)  // ← Capture status
    }
  } catch (error) {
    // Handle error
  }
}
```

**UI Display**:
```tsx
{lastSavedAt && !isDirty && (
  <div className="space-y-1">
    <p className="text-emerald-400 text-xs">
      Last saved: {new Date(lastSavedAt).toLocaleTimeString()}
    </p>
    {lastSavedStatus && (
      <p className="text-zinc-400 text-xs">
        Status: <span className="capitalize font-medium">{lastSavedStatus}</span>
      </p>
    )}
  </div>
)}
```

## UI Components

### ContentStatusBadge

**Location**: `apps/admin/src/components/content-status-badge.tsx`

```typescript
export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const label = getContentStatusLabel(status)

  const statusStyles: Record<ContentStatus, string> = {
    draft: "bg-amber-900/30 text-amber-300 border-amber-700/50",
    published: "bg-emerald-900/30 text-emerald-300 border-emerald-700/50",
    archived: "bg-zinc-800/50 text-zinc-300 border-zinc-700/50",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${statusStyles[status]}`}>
      {label}
    </span>
  )
}
```

**Rendered in**:
- Pages list table (Status column)
- Page detail header (with other metadata)

## State Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Page Lifecycle                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [DRAFT] ──────> (edit & save) ──> [DRAFT] (remain)         │
│    ↑                                   │                      │
│    │                                   │                      │
│    └──── (future: publish) ───────> [PUBLISHED]             │
│                                        │                      │
│                                        └──> (archive) ──→ [ARCHIVED]
│                                                               │
└─────────────────────────────────────────────────────────────┘

Phase 24: Draft/Published/Archived states defined
Phase 25+: Publish/Archive operations
```

## Known Limitations (Intentional)

- ❌ **No publish action**: Status changes happen only in future phases
- ❌ **No archive UI**: Archive state defined but no UI yet
- ❌ **No status-based filtering**: Pages list shows all statuses
- ❌ **No version history**: Single version per locale
- ❌ **No scheduling**: Immediate publish (when added)
- ❌ **No approval workflow**: Direct publish (when added)

All can be added in future phases.

## Demo Data

In-memory adapter provides:
- **German page** (`de/home`): `status: "published"`
- **English page** (`en/home`): `status: "draft"`

This allows testing status badge visibility in:
- Pages list
- Page detail header
- Editor status display

## Migration Path

### Phase 24 → Phase 25 (Publish/Archive Operations)

```typescript
// Future: PublishPageInput/Result contracts
export type PublishPageInput = {
  tenantId: string
  pageId: string
  locale: string
}

export type PublishPageResult = {
  success: boolean
  previousStatus: ContentStatus
  newStatus: ContentStatus
}

// New method in EditorPersistence or new service:
async publishPage(input: PublishPageInput): Promise<PublishPageResult>
```

### Phase 25 → Phase 26 (Status-based Rendering)

```typescript
// Runtime could filter by status:
const page = await runtime.pages.findBySlug({
  tenantId: "demo",
  slug: "home",
  locale: "de",
  includeArchived: false,  // Skip archived pages
})
```

## Summary

Phase 24 establishes:
- ✅ Central `ContentStatus` type
- ✅ `CmsPage` uses `ContentStatus`
- ✅ `SavePageDraftResult` includes status
- ✅ Editor state tracks `lastSavedStatus`
- ✅ `ContentStatusBadge` for consistent UI
- ✅ Admin UI displays status in list and detail
- ✅ Demo data shows different statuses
- ✅ Foundation for publish/archive workflows

No publish operations, no versioning, no scheduling – just clean state semantics for future phases.
