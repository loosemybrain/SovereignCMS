# Block Deletion – Local Architecture

## Overview

Phase 18 adds **local block deletion** in the Admin Editor. Users can delete blocks with a simple ✕ button, with immediate state updates and automatic sort order normalization.

## Design Principles

1. **Local State Only** – Deletion happens only in React state (`draftBlocks`)
2. **No Persistence** – Deleted blocks only removed from state until save
3. **No Confirmation** – Direct delete (can add in future if needed)
4. **Automatic Normalization** – `sortOrder` recalculates after delete
5. **Smart Selection** – If deleted block was selected, selection clears
6. **Dirty State** – `isDirty` flag set for future save

## Key Function

### `deleteBlock(blocks: CmsBlock[], blockId: string)`

Removes a block from the array and normalizes remaining blocks' sort order.

- Input: Array of blocks and block ID to delete
- Output: Array with block removed and normalized `sortOrder` (1, 2, 3, ...)
- Used by `handleDeleteBlock` in editor

```typescript
const blocks = [
  { id: "a", sortOrder: 1 },
  { id: "b", sortOrder: 2 },
  { id: "c", sortOrder: 3 },
]
const afterDelete = deleteBlock(blocks, "b")
// Result:
// [
//   { id: "a", sortOrder: 1, updatedAt: "2026-05-06T..." },
//   { id: "c", sortOrder: 2, updatedAt: "2026-05-06T..." },
// ]
```

## Handler Implementation

### `handleDeleteBlock(blockId: string)`

1. Calls `deleteBlock()` to remove block and normalize sort order
2. Updates `draftBlocks` with new array
3. Clears selection if deleted block was selected
4. Sets `isDirty(true)` for save tracking

```typescript
const handleDeleteBlock = (blockId: string) => {
  const newBlocks = deleteBlock(draftBlocks, blockId)
  setDraftBlocks(newBlocks)

  // Clear selection if deleted block was selected
  if (selectedBlockId === blockId) {
    setSelectedBlockId(null)
  }

  setIsDirty(true)
}
```

## UI Implementation

### Delete Button

Added as third button next to Up/Down controls:

- **Symbol**: ✕ (X in circle)
- **Color**: Red (`text-red-400`)
- **Hover**: Darker red background (`hover:bg-red-950/30`)
- **Always Enabled**: No disabled states
- **Event Handling**: `event.stopPropagation()` to prevent selection conflicts

```typescript
<button
  onClick={(e) => {
    e.stopPropagation()
    handleDeleteBlock(block.id)
  }}
  className="p-1.5 rounded text-xs transition-colors text-red-400 hover:text-red-300 hover:bg-red-950/30"
  title="Delete block"
>
  ✕
</button>
```

### Button Layout

For each block, controls now arranged:

```
↑  ↓  ✕
```

- Up/Down: Conditional disabled states
- Delete: Always active

## State Management

### Selection Handling

When a block is deleted:

1. If it's not selected → Just remove and normalize
2. If it's selected → Remove it AND clear selection (`selectedBlockId = null`)

This prevents orphaned selection state.

### Dirty Tracking

Deletion always triggers `isDirty(true)`, allowing:
- Save button to activate
- Unsaved changes warning to show
- Future undo/redo awareness

## Data Flow

```
User clicks ✕ button on block
    ↓
handleDeleteBlock(blockId)
    ↓
deleteBlock(draftBlocks, blockId) → returns filtered + normalized blocks
    ↓
setDraftBlocks(newBlocks)
    ↓
Check if selectedBlockId === blockId → clear if true
    ↓
setIsDirty(true)
    ↓
React re-renders with updated blocks
    ↓
Block removed from list, sortOrder updated, selection cleared if needed
```

## Edge Cases

### Delete Last Remaining Block

- ✅ Works correctly – Block list becomes empty
- ✅ Selection clears automatically
- ✅ No errors

### Delete while Block Selected

- ✅ Selection clears
- ✅ `isDirty` flag set
- ✅ Inspector becomes empty (no block to show)

### Delete Multiple Blocks Sequentially

- ✅ Each delete normalizes sort order
- ✅ Remaining blocks maintain correct order
- ✅ Can delete down to zero blocks

## Future Enhancements (NOT Phase 18)

- ⏸ Soft delete (mark as deleted, not removed until save)
- ⏸ Undo/Redo (track deletion history)
- ⏸ Confirmation modal (ask before delete)
- ⏸ Restore functionality (if soft delete added)
- ⏸ Bulk delete (multiple blocks at once)

## Integration with Existing Features

### Works with Phase 17 (Reordering)

- After reordering, delete works correctly
- After delete, remaining blocks can be reordered
- Sort order always normalized correctly

### Works with Phase 16 (Add Block)

- New blocks can be deleted immediately
- Local ID blocks (`local-${uuid}`) delete cleanly
- No issues with temporary IDs

### Respects Phase 13 (Dirty State)

- Deletion sets `isDirty(true)`
- Save button activates
- Existing save flow unchanged

## File Locations

- **Delete logic**: `apps/admin/src/lib/reorder-blocks.ts` (function `deleteBlock`)
- **Editor integration**: `apps/admin/src/components/page-editor-client.tsx` (handler `handleDeleteBlock`)

## Acceptance Criteria

✅ Delete button visible on each block  
✅ Click delete removes block immediately  
✅ sortOrder normalizes after delete  
✅ Selection clears if deleted block was selected  
✅ `isDirty` flag set  
✅ No confirmation modal  
✅ Works with 0+ blocks remaining  
✅ TypeScript passes  
✅ Build passes  
✅ No linting errors  

## Testing Scenarios

1. **Delete single block** → Block removed, order updated
2. **Delete first block** → Remaining blocks renumbered from 1
3. **Delete last block** → Previous block now last
4. **Delete middle block** → Blocks above/below renumbered
5. **Delete selected block** → Selection clears, inspector empty
6. **Delete all blocks** → Empty list shown
7. **Delete, then add** → New block gets correct sort order
8. **Delete, then reorder** → Reordering works on remaining blocks
