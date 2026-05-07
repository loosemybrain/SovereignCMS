# Server-Side Save Boundary

## Overview

Phase 23 establishes a clean **server-side save boundary** that separates client and server concerns while maintaining type safety and contract-based persistence.

## Architecture

### Data Flow

```
PageEditorClient (Client Component)
  ↓
clientEditorPersistence.savePageDraft(input)
  ↓
savePageDraftAction (Server Action, "use server")
  ↓
createRuntime() (Server only)
  ↓
runtime.editorPersistence.savePageDraft(input)
  ↓
runtime.db.blocks.replacePageBlocks(input)
  ↓
InMemory Store (Mock/Non-durable)
  ↓
SavePageDraftResult (persisted=false)
  ↓
Client (displayed in UI)
```

### Key Boundary Principles

1. **Runtime stays on server**: `createRuntime()` is called only in `savePageDraftAction`, never exposed to client
2. **Input validation**: Minimal guard ensures valid SavePageDraftInput shape
3. **No external calls**: No fetch(), no REST API, no Supabase/Postgres
4. **Type-safe delegation**: All interfaces use established contracts
5. **Persistent flag preserved**: `persisted=false` indicates InMemory/Mock

## Components

### 1. savePageDraftAction (Server)

**File**: `apps/admin/src/actions/save-page-draft.ts`

```typescript
"use server"

export async function savePageDraftAction(
  input: SavePageDraftInput
): Promise<SavePageDraftResult> {
  // Minimal validation
  // Create runtime on server (safe)
  // Delegate to runtime.editorPersistence.savePageDraft(input)
  // Return result to client
}
```

**Responsibilities**:
- Validate input shape
- Create runtime server-side (no exposure to client)
- Call `runtime.editorPersistence.savePageDraft()`
- Return result

**NOT responsible for**:
- Authentication (can be added later)
- Authorization (can be added later)
- External database writes (would be in future phases)

### 2. clientEditorPersistence (Client Adapter)

**File**: `apps/admin/src/lib/client-editor-persistence.ts`

```typescript
export const clientEditorPersistence: EditorPersistence = {
  async savePageDraft(input): Promise<SavePageDraftResult> {
    // Delegate to server action
    return savePageDraftAction(input)
  }
}
```

**Responsibilities**:
- Implement EditorPersistence interface
- Delegate to server action
- Handle errors gracefully
- Return SavePageDraftResult

**NOT responsible for**:
- Runtime creation
- Database operations
- Business logic (all server-side)

### 3. pageEditorClient (Client Component)

**File**: `apps/admin/src/components/page-editor-client.tsx`

Unchanged from Phase 22:
- Calls `clientEditorPersistence.savePageDraft(input)`
- Receives `SavePageDraftResult`
- Updates dirty state on success
- Displays errors on failure

## Why This Architecture?

### Problem: Runtime Exposure

Before Phase 23, Runtime objects couldn't be passed to Client Components safely (Next.js serialization limitation).

### Solution: Server Action Boundary

A "use server" function:
- ✅ Can create Runtime
- ✅ Can call runtime.editorPersistence
- ✅ Returns serializable SavePageDraftResult
- ✅ Clean separation of concerns

### Why Not API Route?

We use Server Actions instead of API routes because:
- ✅ Same file/function reference (type-safe)
- ✅ No manual fetch() needed
- ✅ Automatic serialization
- ✅ Simpler mental model
- ✅ Can migrate to API route later if needed

### Why persisted=false?

The flag indicates:
- Current implementation: InMemory/Mock (not durable)
- Future phases can change this
- Client UI should handle accordingly (no "success" UI lies)

## Input Validation

```typescript
// Minimal guards in savePageDraftAction
if (!input.tenantId || typeof input.tenantId !== "string")
if (!input.pageId || typeof input.pageId !== "string")
if (!input.locale || typeof input.locale !== "string")
if (!Array.isArray(input.blocks))
```

**Future enhancements** can add:
- Authentication checks
- Authorization rules
- Tenant membership verification
- Rate limiting

## Error Handling

### Server Action Errors

If `savePageDraftAction` throws:
```typescript
throw new Error("Invalid input: ...")
```

The error:
- ✅ Is caught by Next.js Server Action error boundary
- ✅ Is logged
- ✅ Returns error to client
- ✅ Client shows error message

### Client-side Error Handling

```typescript
try {
  const result = await savePageDraftAction(input)
  if (result.success) { /* ... */ }
} catch (error) {
  // Server action failed
  return {
    success: false,
    savedAt: ...,
    persisted: false,
  }
}
```

## Migration Path

### Phase 23 → Phase 24 (Future)

If a real database is added:

1. Update `packages/db/src/in-memory-adapter.ts` `replacePageBlocks()`:
   - Add real DB writes
   - Return `persisted=true`

2. No changes needed to:
   - `savePageDraftAction` (still delegates to runtime)
   - `clientEditorPersistence` (still calls server action)
   - `pageEditorClient` (still uses clientEditorPersistence)

### Phase 23 → Phase 25 (Future)

If authentication/authorization needed:

1. Update `savePageDraftAction`:
   - Add auth check
   - Verify user has access to tenant/page
   - Log audit trail

2. No changes needed to:
   - `clientEditorPersistence`
   - `pageEditorClient`
   - Any contracts

## Testing

### Client-side

```typescript
// No special testing needed
// Editor component already handles SavePageDraftResult
```

### Server Action

```typescript
// Could test directly if needed:
// const result = await savePageDraftAction({
//   tenantId: "demo",
//   pageId: "...",
//   locale: "de",
//   blocks: [...]
// })
```

## Known Limitations (Intentional)

- ❌ **No real external DB**: persisted=false
- ❌ **No authentication**: Can be added
- ❌ **No rate limiting**: Can be added
- ❌ **No audit logging**: Can be added
- ❌ **No conflict resolution**: Single writer model (for now)

All limitations can be addressed in future phases without breaking the boundary.

## Summary

The server-side save boundary:
- ✅ Separates client and server cleanly
- ✅ Maintains type safety via contracts
- ✅ Allows Runtime creation server-side
- ✅ Remains flexible for future features
- ✅ Requires no external dependencies
