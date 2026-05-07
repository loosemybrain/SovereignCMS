# Add Block Foundation Architecture

## Overview

The Add Block Foundation enables users to add new blocks to pages in the admin editor. Blocks are created with sensible defaults from the Block Definition Registry and can be edited immediately without any persistence to database or API.

## Architecture

### Components

#### BlockPalette (`apps/admin/src/components/block-palette.tsx`)

Displays available block types grouped by category.

**Features:**
- Lists all block types from `listAdminBlockDefinitions()`
- Groups by category
- One button per block type
- Calls `onAddBlock(blockType)` when clicked

**UI:**
- Category headers
- Block labels with type identifier
- Hover/active states

#### PageEditorClient (`apps/admin/src/components/page-editor-client.tsx`)

Extended with `addBlock(blockType: string)` handler.

**Flow:**
```
User clicks "Add Block" in palette
↓
addBlock(blockType) called
↓
getAdminBlockDefinition(blockType)
↓
Create CmsBlock with:
├─ id: local-<random-uuid>
├─ tenantId, pageId (from page)
├─ type (from definition)
├─ sortOrder (length + 1)
├─ props: definition.defaultProps ← KEY!
├─ visibility: "visible"
├─ timestamps
↓
Add to draftBlocks
↓
setSelectedBlockId(newBlock.id)
↓
setIsDirty(true)
↓
Inspector shows new block immediately
↓
User edits in inspector
↓
Live preview updates
```

## Key Features

### 1. Default Props from Definition

New blocks use `definition.defaultProps`:

```typescript
hero: {
  defaultProps: {
    headline: "New Headline",
    subline: "New Subline",
  },
}

text: {
  defaultProps: {
    body: "New Text",
  },
}
```

**Benefit:** No hardcoded values in component. Changing defaults is one place.

### 2. Automatic Selection

New block is automatically selected:
- Inspector shows fields immediately
- User can edit right away
- No extra clicks needed

### 3. Dirty State

Adding a block marks page as dirty:
```typescript
setIsDirty(true)
```

- Save button becomes enabled
- "Unsaved changes" indicator shows
- Save flow works normally

### 4. Local ID Generation

Temporary IDs for new blocks:
```typescript
id: `local-${crypto.getRandomValues(...).reduce(...)}`
```

**Characteristics:**
- Doesn't conflict with server IDs
- Clearly marked as temporary
- Survives editing and save mock
- Will be replaced when real persistence added

### 5. Integration with Existing Features

**Inspector:**
- Shows fields for new block immediately
- Allows editing
- Patches merge correctly

**Block Preview:**
- Renders via `renderAdminBlock()`
- Uses registered renderer
- Shows live updates

**Save Flow:**
- Mock save includes new blocks
- `draftBlocks` array sent to `savePageDraft()`
- No special handling needed

## Data Flow

```
Block Definition Registry
├─ Types & Labels
├─ Categories
├─ Default Props ← Used here
└─ Renderers
    ↓
BlockPalette
├─ Lists definitions
├─ Groups by category
└─ Button per type
    ↓
PageEditorClient.addBlock()
├─ Lookup definition
├─ Create CmsBlock
├─ Use defaultProps
├─ Add to draftBlocks
└─ Select & mark dirty
    ↓
EditorInspector
├─ Show fields
├─ Allow editing
└─ Call updateBlockProps()
    ↓
renderAdminBlock()
├─ Lookup renderer
└─ Show preview
    ↓
Save Flow
├─ Include draftBlocks
└─ Mark as dirty
```

## Limitations

### Current

- No block deletion UI
- No block reordering
- No block duplication
- No undo/redo
- No validation on new blocks
- Palette always visible (no drawer/modal)
- No search/filter on blocks

### By Design

- No database writes
- No API routes
- No Server Actions
- No real persistence
- No localStorage

### Future

- Block deletion in Phase 17
- Block reordering (drag/drop) in Phase 18
- Undo/redo in Phase 19
- Validation in Phase 20

## Example: Adding a Block

1. **User sees Block Palette** with:
   - "Content" category
   - "Hero" button
   - "Text" button

2. **User clicks "Hero"**
   - `addBlock("hero")` called
   - Definition retrieved
   - New CmsBlock created:
     ```typescript
     {
       id: "local-abc123def456...",
       tenantId: "demo",
       pageId: "home",
       type: "hero",
       sortOrder: 3,
       props: {
         headline: "New Headline",  // from defaultProps
         subline: "New Subline",    // from defaultProps
       },
       visibility: "visible",
       createdAt: "2026-05-06T...",
       updatedAt: "2026-05-06T...",
     }
     ```
   - Block added to draftBlocks
   - Block selected automatically
   - Page marked dirty

3. **Inspector shows hero fields**
   - Headline input: "New Headline"
   - Subline input: "New Subline"
   - User edits values

4. **Block preview updates** live

5. **User clicks Save**
   - Mock save includes new block
   - Dirty state cleared
   - Last saved timestamp shows

## Security

- No dangerous operations
- Props come from definition (safe defaults)
- IDs are just strings (local-*)
- No code execution
- No API exposure

## Performance

- Add block is O(1)
- Array append: O(n) where n = num blocks
- Palette render: O(m) where m = num block types (typically 2-10)
- No performance degradation

## Testing Checklist

**Manual Testing:**
- [ ] Navigate to page detail
- [ ] See Block Palette above blocks list
- [ ] Click "Hero" button
- [ ] New hero block appears with default props
- [ ] Block automatically selected
- [ ] Inspector shows headline/subline fields
- [ ] Default values appear in inputs
- [ ] Edit headline → block updates in preview
- [ ] Dirty state shows "Unsaved changes"
- [ ] Click Save → mock save works
- [ ] Add another block (Text)
- [ ] Text block appears below hero
- [ ] Both blocks selectable
- [ ] Edit each independently
- [ ] Save includes both blocks

## Integration Points

### Block Definition Registry
- Used to get definitions and defaults
- Defines labels and categories

### Inspector Field Registry
- Shows fields for new block immediately
- Uses existing `updateBlockProps` flow

### Block Renderers
- Render new blocks via existing `renderAdminBlock()`
- No special handling needed

### Editor State
- `draftBlocks` includes new blocks
- `selectedBlockId` points to new block
- Dirty state management works normally

### Save Flow
- New blocks included in `draftBlocks`
- Mock save handles them normally
- Later phases will persist to API/DB

## Files

```
apps/admin/src/
├── components/
│   ├── block-palette.tsx (new)
│   └── page-editor-client.tsx (updated - added addBlock handler)
├── block-definitions/
│   └── registry.ts (used for defaults)
├── lib/
│   └── editor-state.ts (unchanged - draftBlocks handles new blocks)
```

---

**Status:** Phase 16 Complete
**Scope:** Add block foundation (no deletion, reordering, undo)
**Ready for:** Phase 17 (block deletion) or any other features
