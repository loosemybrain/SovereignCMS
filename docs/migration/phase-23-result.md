# Phase 23 Result – Server-Side Save Boundary Foundation

**Status**: ✅ Complete  
**Date**: May 7, 2026  
**Branch**: main

## Summary

Phase 23 establishes a **clean server-side save boundary** using Next.js Server Actions, allowing client components to delegate editor persistence to a secure server context without exposing Runtime objects or requiring external database integrations.

## Changes

### New Files

#### 1. `apps/admin/src/actions/save-page-draft.ts`
Server Action implementing the save boundary:
- ✅ "use server" directive (secure server context)
- ✅ Validates SavePageDraftInput
- ✅ Creates Runtime server-side
- ✅ Delegates to `runtime.editorPersistence.savePageDraft()`
- ✅ Returns SavePageDraftResult to client

### Updated Files

#### 1. `apps/admin/src/lib/client-editor-persistence.ts`
**Changed from**: Mock-only implementation  
**Changed to**: Server Action delegation

**Old behavior**:
```typescript
// Simulate network delay
// Return hardcoded success
```

**New behavior**:
```typescript
// Import savePageDraftAction
// Call savePageDraftAction(input)
// Return actual result from server
// Handle errors gracefully
```

**Result**:
- Client adapter now delegates to server
- Still type-safe (SavePageDraftInput/Result)
- Still no external DB calls
- persisted=false preserved

## Architecture

### Data Flow

```
Client Component
  ↓ (clientEditorPersistence.savePageDraft)
Server Action (savePageDraftAction)
  ↓ (no Runtime on client!)
Runtime (server-side only)
  ↓ (runtime.editorPersistence.savePageDraft)
Repository Contract (blocks.replacePageBlocks)
  ↓
InMemory Store
  ↓
SavePageDraftResult (persisted=false)
  ↓ (returned to client)
UI Update (dirty state, saved time)
```

### Key Principles

1. **Runtime stays server-side**: Never exposed to client
2. **Server Action boundary**: Clean, type-safe delegation
3. **No external calls**: No fetch, API routes, or external DB
4. **Contract preservation**: SavePageDraftInput/Result unchanged
5. **Graceful errors**: Client handles server failures

## Validation

✅ **TypeScript**: `npm run typecheck` → EXIT 0  
✅ **Build**: `npm run build` → EXIT 0  
✅ **ESLint**: `npm run lint` → EXIT 0  
✅ **No Breaking Changes**: All existing features work  

## File Changes Summary

| File | Type | Change | Focus |
|------|------|--------|-------|
| `apps/admin/src/actions/save-page-draft.ts` | New | Server Action | Boundary |
| `apps/admin/src/lib/client-editor-persistence.ts` | Updated | Server delegation | Adapter |
| `docs/architecture/server-save-boundary.md` | New | Architecture | Docs |

## What's NOT Changed

- ❌ PageEditorClient: Still uses clientEditorPersistence
- ❌ savePageDraftInput/Result: Same contracts
- ❌ InMemory Adapter: Still mocks persistence
- ❌ persisted flag: Still false (mock/non-durable)
- ❌ No external DB
- ❌ No API routes
- ❌ No fetch calls
- ❌ No Supabase/Postgres

## Why Server Actions Over API Routes?

### Server Action Benefits
- ✅ Type-safe: Same file imports client-side
- ✅ Automatic serialization: No manual fetch()
- ✅ Co-located: Action defined near usage
- ✅ Simple error handling: Next.js managed
- ✅ Future-proof: Can migrate to API if needed

### API Route Drawbacks
- ❌ Type safety: Manual fetch() serialization
- ❌ Separate file: Must manage routing
- ❌ Error handling: Manual response handling
- ❌ String-based URLs: Runtime errors possible

## Runtime Creation Model

### Before Phase 23
```typescript
// ❌ Client could not safely access Runtime
// ❌ clientEditorPersistence was mock-only
```

### After Phase 23
```typescript
// ✅ Server Action creates Runtime safely
const runtime = createRuntime() // server context only
// ✅ Delegates to runtime.editorPersistence
return runtime.editorPersistence.savePageDraft(input)
// ✅ Returns serializable result to client
```

## Error Handling

### Validation Errors
```typescript
if (!input.tenantId || typeof input.tenantId !== "string") {
  throw new Error("Invalid input: tenantId is required")
}
```

Result on client:
```typescript
{
  success: false,
  savedAt: "...",
  persisted: false,
  updatedBlocks: input.blocks,
}
```

### Runtime Errors
If `runtime.editorPersistence.savePageDraft()` throws:
- ✅ Error is caught in clientEditorPersistence
- ✅ Returns failure SavePageDraftResult
- ✅ Client displays error message

## Migration Path

### To Add Authentication (Phase 24+)
```typescript
// In savePageDraftAction:
const user = await getUser() // hypothetical
if (!user) throw new Error("Unauthorized")
// rest of logic unchanged
```

### To Add Real Database (Phase 24+)
```typescript
// Update InMemory adapter or replace with real DB adapter
// No changes to savePageDraftAction
// No changes to clientEditorPersistence
// No changes to PageEditorClient
```

### To Replace with API Route (Phase 25+)
```typescript
// Create pages/api/save-page-draft.ts
// Copy logic from savePageDraftAction
// Update clientEditorPersistence to use fetch()
// No changes to PageEditorClient
```

## Testing Scenarios

✅ **Save with valid input** → Returns SavePageDraftResult with success=true  
✅ **Save with empty tenantId** → Returns SavePageDraftResult with success=false  
✅ **Save with missing blocks** → Throws error, caught on client  
✅ **Save during network delay** → clientEditorPersistence waits for server response  
✅ **Editor dirty state** → Resets on successful save  
✅ **Editor save error** → Displays error message  

## Known Limitations

- ⏸ **persisted=false**: Still mock/non-durable (by design)
- ⏸ **No authentication**: Can be added in next phase
- ⏸ **No authorization**: Can be added in next phase
- ⏸ **No rate limiting**: Can be added in next phase
- ⏸ **No conflict resolution**: Single writer model

All can be added without breaking this boundary.

## Summary

Phase 23 successfully:
- ✅ Establishes server-side save boundary via Server Action
- ✅ Maintains clean client/server separation
- ✅ Preserves type safety with SavePageDraftInput/Result contracts
- ✅ Allows Runtime to stay server-side only
- ✅ Remains flexible for future enhancements
- ✅ Requires no external dependencies or DB

The foundation is now ready for Phase 24+ to add authentication, authorization, real database writes, or other persistence enhancements without changing the boundary architecture.

---

**Ready for Phase 24: Real Database Integration or Authentication** ✅
