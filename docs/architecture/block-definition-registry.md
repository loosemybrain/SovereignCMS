# Block Definition Registry Architecture

## Overview

The Block Definition Registry is a centralized system that combines block metadata, default properties, inspector field definitions, and admin renderers into single, cohesive definitions.

## Problem Solved

**Before Phase 15:**

Block information was scattered across multiple registries:

```typescript
// Renderer registry (admin-block-renderer-registry.tsx)
const rendererRegistry = {
  hero: HeroAdminRenderer,
  text: TextAdminRenderer,
}

// Inspector field registry (block-field-registry.ts)
const fieldRegistry = {
  hero: [{ key: "headline", ... }, { key: "subline", ... }],
  text: [{ key: "body", ... }],
}

// Default props (implicit, nowhere)
// Label/category (nowhere)
```

**Issues:**
- Block metadata scattered across multiple files
- Hard to add new block type (multiple places to update)
- No centralized source of truth
- Difficult to query block capabilities
- Default props not defined anywhere
- Scaling problems with 10+ block types

**After Phase 15:**

```typescript
// Central registry (block-definitions/registry.ts)
const adminBlockDefinitions = {
  hero: {
    type: "hero",
    label: "Hero",
    category: "Content",
    defaultProps: { headline: "...", subline: "..." },
    inspectorFields: [...],
    adminRenderer: HeroAdminRenderer,
  },
  // ... more blocks
}
```

## Architecture

### Flow

```
Block Definition Registry
    ↓
listAdminBlockDefinitions() → all metadata
    ↓
getAdminBlockDefinition(type) → specific definition
    ↓
Contains:
├─ label & category
├─ defaultProps
├─ inspectorFields[]
└─ adminRenderer function
```

### Components

#### 1. Block Definition Type (`block-definitions/types.ts`)

```typescript
export type AdminBlockDefinition = {
  type: string                              // Block type identifier
  label: string                             // Human-readable label
  category: string                          // For future grouping
  defaultProps: Record<string, unknown>     // Default props for new blocks
  inspectorFields: InspectorFieldDefinition[] // Editor fields
  adminRenderer: AdminBlockRenderer         // Preview renderer function
}
```

#### 2. Central Registry (`block-definitions/registry.ts`)

Defines all block types with full metadata:

```typescript
export const adminBlockDefinitions: AdminBlockRegistry = {
  hero: {
    type: "hero",
    label: "Hero",
    category: "Content",
    defaultProps: {
      headline: "New Headline",
      subline: "New Subline",
    },
    inspectorFields: [
      { key: "headline", label: "Headline", type: "text", placeholder: "..." },
      { key: "subline", label: "Subline", type: "text", placeholder: "..." },
    ],
    adminRenderer: HeroAdminRenderer,
  },
  // ... more blocks
}
```

**Helper functions:**

```typescript
getAdminBlockDefinition(type: string): AdminBlockDefinition | null
listAdminBlockDefinitions(): AdminBlockDefinition[]
```

#### 3. Renderer Registry (Refactored)

**Before:** Hard-mapped block type to renderer

**After:** Looks up renderer from definition

```typescript
export function renderAdminBlock(block: CmsBlock) {
  const definition = getAdminBlockDefinition(block.type)
  
  if (!definition) {
    return FallbackAdminRenderer(block)
  }
  
  return definition.adminRenderer(block)
}
```

#### 4. Inspector Field Registry (Compatibility Wrapper)

**Before:** Duplicate field definitions

**After:** Wrapper around central registry

```typescript
export function getInspectorFieldsForBlock(blockType: string) {
  const definition = getAdminBlockDefinition(blockType)
  return definition?.inspectorFields ?? []
}
```

**No duplicate data!**

## Design Decisions

### Why Centralize?

1. **Single Source of Truth**: All block metadata in one place
2. **Consistency**: Type, label, fields, renderer always in sync
3. **Extensibility**: Adding new block type is one-step
4. **Discoverability**: Can query what fields/defaults each block has
5. **Future-Proof**: Ready for add block UI, templates, etc.

### Why Keep Category?

Currently unused, but prepared for:
- Future UI to group blocks by category
- Block palette/picker
- Block templates

### Why Store Default Props?

For future "Add Block" UI:
- When user creates new block, use `defaultProps`
- No more hardcoded empty strings
- Consistent initial state

### Why Not Merge with Public Block Definitions?

Public rendering (in `apps/web`) has different needs:
- Different renderer format
- Different metadata
- Different fields

Keep admin and public registries separate for flexibility.

## Extension Example

### Adding a New Block Type: "Callout"

**Step 1:** Create renderer (`apps/admin/src/components/block-renderers/callout-renderer.tsx`)

```typescript
export function CalloutAdminRenderer(block: CmsBlock) {
  const props = asRecord(block.props)
  return <div>Callout: {asString(props.title)}</div>
}
```

**Step 2:** Add to central registry

```typescript
export const adminBlockDefinitions: AdminBlockRegistry = {
  // ... existing blocks
  callout: {
    type: "callout",
    label: "Callout",
    category: "Content",
    defaultProps: {
      title: "New Callout",
      message: "Add message here",
      icon: "info",
    },
    inspectorFields: [
      { key: "title", label: "Title", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "icon", label: "Icon", type: "text" },
    ],
    adminRenderer: CalloutAdminRenderer,
  },
}
```

**Done!** All systems automatically support it:
- Inspector shows 3 fields
- Admin preview renders via CalloutAdminRenderer
- Default props used when creating blocks
- Can query with `getAdminBlockDefinition("callout")`

## Querying Block Information

### Get All Blocks

```typescript
const allBlocks = listAdminBlockDefinitions()
// [{ type: "hero", label: "Hero", ... }, { type: "text", ... }, ...]
```

### Check if Block Type Exists

```typescript
const definition = getAdminBlockDefinition("hero")
if (!definition) {
  console.log("Block type not supported")
}
```

### Get Default Props for New Block

```typescript
const heroDefault = getAdminBlockDefinition("hero")?.defaultProps
// { headline: "New Headline", subline: "New Subline" }
```

### Get Inspector Fields

```typescript
const fields = getAdminBlockDefinition("hero")?.inspectorFields
// [{ key: "headline", ... }, { key: "subline", ... }]
```

## File Structure

```
apps/admin/src/
├── block-definitions/
│   ├── types.ts (new - type definitions)
│   └── registry.ts (new - central registry)
├── components/
│   ├── admin-block-renderer-registry.tsx (refactored)
│   ├── inspector/
│   │   └── block-field-registry.ts (refactored - now wrapper)
│   └── block-renderers/
│       ├── hero-renderer.tsx (unchanged)
│       ├── text-renderer.tsx (unchanged)
│       └── fallback-renderer.tsx (unchanged)
```

## Limitations

### Current

- Registry is hardcoded in code (no dynamic loading)
- Category field unused (prepared for future)
- No block inheritance or composition

### By Design

- No API integration
- No database persistence
- Registry built at compile time

## Future Enhancements

### Phase 16+

1. **Block Picker UI**
   - Browse available blocks
   - Create new blocks with default props
   - Search/filter by category

2. **Block Templates**
   - Pre-configured block instances
   - "Hero Template 1", "Hero Template 2"
   - User selects template, gets defaults

3. **Dynamic Registry**
   - Load block definitions from API
   - Plugin system for custom blocks
   - Runtime block registration

4. **Validation**
   - Add `validate?: (props) => errors` to definition
   - Per-block validation rules

5. **Constraints**
   - Add `maxInstances?: number` per block type
   - `allowedLocations?: "top" | "middle" | "bottom"`

---

**Status:** Phase 15 Complete
**Impact:** Centralized block metadata, easier to add new types
**Ready for:** Phase 16 (Block picker UI, templates, or other features)
