# Block Reordering – Local Architecture

## Overview

Phase 17 introduces local block reordering in the Admin Editor. Users can move blocks up or down using simple UI controls, without persistence or external libraries like Drag & Drop.

## Design Principles

1. **Local State Only** – All reordering happens in React state (`draftBlocks`)
2. **No Persistence** – Reordered blocks only exist until save (managed by future persistence layer)
3. **No Drag & Drop** – Simple Up/Down buttons with disabled states for first/last blocks
4. **Normalized Sort Order** – After each move, `sortOrder` is recalculated sequentially (1, 2, 3, ...)
5. **Selected Block Stays Selected** – After reordering, the block remains selected and focused

## Key Functions

### `normalizeBlockOrder(blocks: CmsBlock[])`

Recalculates `sortOrder` sequentially after any reordering operation.

- Input: Array of blocks in desired order (may have gaps in sortOrder)
- Output: Array with normalized `sortOrder` (1, 2, 3, ...) and updated timestamps
- Used after `moveBlockUp` and `moveBlockDown`

```typescript
const blocks = [
  { id: "a", sortOrder: 10 },
  { id: "b", sortOrder: 20 },
  { id: "c", sortOrder: 30 },
]
const normalized = normalizeBlockOrder(blocks)
// Result:
// [
//   { id: "a", sortOrder: 1, updatedAt: "2026-05-06T..." },
//   { id: "b", sortOrder: 2, updatedAt: "2026-05-06T..." },
//   { id: "c", sortOrder: 3, updatedAt: "2026-05-06T..." },
// ]
```

### `moveBlockUp(blocks: CmsBlock[], blockId: string)`

Moves a block one position up in the array.

- Returns unchanged array if block is first or not found
- Swaps with previous block
- Normalizes sortOrder
- Used by `handleMoveBlockUp` in editor

### `moveBlockDown(blocks: CmsBlock[], blockId: string)`

Moves a block one position down in the array.

- Returns unchanged array if block is last or not found
- Swaps with next block
- Normalizes sortOrder
- Used by `handleMoveBlockDown` in editor

### `cloneDefaultProps(props: Record<string, unknown>)`

Safely deep clones default props when adding blocks.

- Prefers `structuredClone()` (modern environments)
- Falls back to `JSON.parse(JSON.stringify(...))` for compatibility
- Prevents shared references between multiple blocks

## UI Implementation

### Ordered Rendering

Blocks are rendered in sorted order before display:

```typescript
const orderedBlocks = [...draftBlocks].sort((a, b) => a.sortOrder - b.sortOrder)
// Render orderedBlocks
```

The `draftBlocks` array itself is not sorted – only the render order is controlled.

### Move Up / Move Down Controls

Each block displays two buttons:

- **↑ (Up)**: Disabled if block is first
- **↓ (Down)**: Disabled if block is last

Button clicks trigger:
1. `event.stopPropagation()` – Prevent block selection conflicts
2. `handleMoveBlockUp()` or `handleMoveBlockDown()`
3. Block remains selected
4. `isDirty` flag is set

### Position Display

Each block shows its current `sortOrder` in the UI:

```
Position: 1
Position: 2
Position: 3
```

This is helpful for debugging and understanding the sort state, though optional for future UI refinements.

## State Changes

### Add Block

When a new block is added:

1. Calculate `maxSortOrder` from existing blocks (or 0 if empty)
2. Assign `nextSortOrder = maxSortOrder + 1`
3. Clone default props safely using `cloneDefaultProps()`
4. Add block to `draftBlocks`
5. Set `isDirty(true)`

Example:
```typescript
const maxSortOrder = draftBlocks.length > 0 ? Math.max(...draftBlocks.map((b) => b.sortOrder)) : 0
const nextSortOrder = maxSortOrder + 1 // Always correct, even with gaps
```

### Reorder Block

When a block is moved:

1. Call `moveBlockUp()` or `moveBlockDown()`
2. Function returns new array with normalized `sortOrder`
3. Call `setDraftBlocks()` with result
4. Block stays selected
5. Set `isDirty(true)`

## Data Flow

```
User clicks "Move Up" button
    ↓
handleMoveBlockUp(blockId)
    ↓
moveBlockUp(draftBlocks, blockId) → returns reordered + normalized blocks
    ↓
setDraftBlocks(newBlocks)
    ↓
React re-renders with orderedBlocks.sort(...)
    ↓
Block moved up, still selected, UI updates
```

## Future Persistence

When Phase 11's persistence layer is called, the normalized `orderedBlocks` are passed:

```typescript
const blocksToSave = normalizeBlockOrder(orderedBlocks)
// Ensures sortOrder is always 1, 2, 3, ... before save
```

This maintains consistency even if local edits created gaps.

## File Locations

- **Reorder logic**: `apps/admin/src/lib/reorder-blocks.ts`
- **Editor integration**: `apps/admin/src/components/page-editor-client.tsx`
- **Block definition registry**: `apps/admin/src/block-definitions/registry.ts`

## Limitations (Intentional)

- ❌ No drag & drop (deliberate – too complex for Phase 17)
- ❌ No animations (React just swaps; future CSS transitions optional)
- ❌ No keyboard shortcuts (up/down arrows conflict with form fields)
- ❌ No bulk reordering (one step at a time, by design)
- ❌ No undo/redo (falls under future save flow enhancements)

All of these can be added in subsequent phases without changing the core architecture.
