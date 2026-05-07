# Phase 17 Result – Block Reordering Foundation

**Status**: ✅ Complete  
**Date**: May 6, 2026  
**Branch**: main

## Summary

Phase 17 introduces the **foundation for local block reordering** in the Admin Editor. Users can now move blocks up or down using simple UI buttons (↑/↓), with full support for:

- ✅ Local state management (no API calls)
- ✅ Automatic sort order normalization
- ✅ Smart disabled states (first/last blocks)
- ✅ Block stays selected after move
- ✅ Position display in UI
- ✅ Safe default prop cloning

## Changes

### New Files

#### 1. `apps/admin/src/lib/reorder-blocks.ts`
Utility functions for block reordering:
- `moveBlockUp(blocks, blockId)` – Swap block up one position
- `moveBlockDown(blocks, blockId)` – Swap block down one position
- `normalizeBlockOrder(blocks)` – Recalculate sequential sortOrder (1, 2, 3...)
- `cloneDefaultProps(props)` – Deep clone props safely (structuredClone fallback)

### Updated Files

#### 1. `apps/admin/src/components/page-editor-client.tsx`

**Changes**:
- Added import: `moveBlockUp, moveBlockDown, cloneDefaultProps, normalizeBlockOrder` from `reorder-blocks.ts`
- Added `orderedBlocks` computation: `[...draftBlocks].sort((a, b) => a.sortOrder - b.sortOrder)`
- Updated `addBlock()` to:
  - Calculate `maxSortOrder` from existing blocks (handles gaps correctly)
  - Use `cloneDefaultProps()` instead of direct reference
  - Set `nextSortOrder = maxSortOrder + 1`
- Added `handleMoveBlockUp(blockId)` handler
- Added `handleMoveBlockDown(blockId)` handler
- Updated block rendering loop:
  - Renders `orderedBlocks` instead of `draftBlocks`
  - Calculates `isFirst` and `isLast` for each block
  - Shows ↑/↓ buttons with disabled states
  - Displays `Position: {block.sortOrder}` in UI
  - Calls handlers with `event.stopPropagation()`
- Updated `handleSave()` to normalize blocks before save: `normalizeBlockOrder(orderedBlocks)`

### Documentation

#### 1. `docs/architecture/block-reordering-local.md`
Comprehensive architecture document covering:
- Design principles and constraints
- Function reference with examples
- UI implementation details
- State change flows
- Data flow diagram
- Future persistence expectations
- Intentional limitations (no drag & drop, animations, etc.)

## UI Behavior

### Block List Display

Each block shows:
- **Position**: Current sort order (e.g., "Position: 1")
- **Type**: Block type label (e.g., "hero", "text")
- **Visibility**: Current visibility state
- **Up Button (↑)**:
  - Enabled for all blocks except first
  - Moves block up one position on click
- **Down Button (↓)**:
  - Enabled for all blocks except last
  - Moves block down one position on click
- **Block Preview**: Rendered using admin renderer registry

### Interaction Flow

```
1. User clicks ↑ or ↓ button
   ↓
2. event.stopPropagation() prevents selection conflict
   ↓
3. handleMoveBlockUp/Down() is called
   ↓
4. moveBlockUp/Down() swaps positions and normalizes sortOrder
   ↓
5. setDraftBlocks() triggers React re-render
   ↓
6. Blocks are sorted before render (orderedBlocks)
   ↓
7. Block remains selected, isDirty = true
```

## Technical Details

### Sort Order Normalization

After any reorder operation, `sortOrder` is recalculated sequentially:

**Before move**: `[{id: "a", sortOrder: 1}, {id: "b", sortOrder: 2}, {id: "c", sortOrder: 3}]`

**After moveBlockUp("c")**: `[{id: "a", sortOrder: 1}, {id: "c", sortOrder: 2}, {id: "b", sortOrder: 3}]`

This ensures consistency and prevents gaps from local edits.

### Default Props Cloning

When adding a new block, `definition.defaultProps` is cloned to prevent shared references:

```typescript
// Before (buggy – all instances share same props object):
props: definition.defaultProps

// After (safe – each instance has own props):
props: cloneDefaultProps(definition.defaultProps)
```

The `cloneDefaultProps()` function handles both modern environments (structuredClone) and older ones (JSON fallback).

### Add Block Sort Order

When adding a new block, the sort order is calculated correctly even with gaps:

```typescript
const maxSortOrder = draftBlocks.length > 0 ? Math.max(...draftBlocks.map((b) => b.sortOrder)) : 0
const nextSortOrder = maxSortOrder + 1
```

This ensures new blocks always go to the end, regardless of previous operations.

## What's NOT Included (Intentional)

- ❌ **Drag & Drop**: Too complex for Phase 17; arrow buttons sufficient
- ❌ **Animations**: React swaps immediately; CSS transitions possible later
- ❌ **Keyboard Shortcuts**: Conflicts with form input; could add in Phase 20+
- ❌ **Bulk Reordering**: One step at a time by design
- ❌ **Persistence**: Still mocked; Phase 11+ upgrades to real save
- ❌ **Undo/Redo**: Managed by future persistence layer

## Testing Checklist

- ✅ Reorder multiple blocks up/down
- ✅ First block cannot move up (button disabled)
- ✅ Last block cannot move down (button disabled)
- ✅ Block stays selected after reorder
- ✅ `isDirty` flag set to `true` after reorder
- ✅ Position display updates correctly
- ✅ Added blocks go to end with correct sort order
- ✅ Adding multiple blocks maintains correct sort order
- ✅ Sort order normalizes before save
- ✅ TypeScript compilation passes (`npm run typecheck`)
- ✅ No linting errors

## Next Steps (Not Phase 17)

### Phase 18 (Future)
- Persist reordered blocks to storage/DB
- Validate sort order on server
- Add undo/redo via persistence layer

### Phase 19 (Future)
- CSS animations on block move
- Smoother UX transitions
- Keyboard shortcuts (if desired)

### Phase 20+ (Future)
- Drag & drop support (Framer Motion, Dnd-Kit, or custom)
- Bulk reorder operations
- Sort by other properties (e.g., type, visibility)

## Files Summary

| File | Type | Change | Lines |
|------|------|--------|-------|
| `apps/admin/src/lib/reorder-blocks.ts` | New | Reorder utilities + cloning | 71 |
| `apps/admin/src/components/page-editor-client.tsx` | Updated | Move handlers, sorted rendering, UI | ~280 |
| `docs/architecture/block-reordering-local.md` | New | Architecture documentation | 180+ |

## Verification

✅ **TypeScript**: `npm run typecheck` – All types pass  
✅ **ESLint**: No warnings/errors  
✅ **Build**: Ready for integration  
✅ **Runtime**: Local state only – no external dependencies added

---

**Ready for Phase 18: Persistence Integration** (or next feature phase)
