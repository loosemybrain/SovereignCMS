# Phase 52: Controlled Repeater Foundation

## Overview

Phase 52 introduces the first and only controlled repeater type in SovereignCMS: **simple-list**.

This repeater is intentionally small, focused, and deterministic:
- Designed for a single, specific shape: `{ id: string, title: string, body?: string }`
- Used primarily by Feature Grid block
- No generic schema engine
- No recursive/nested repeaters
- No drag-and-drop in this phase
- Not extensible to arbitrary object structures

## Philosophy

The goal is to provide a **controlled, minimal repeater** for common content patterns without building a generic array schema system that would add unnecessary complexity.

### What Phase 52 Does NOT Include

- ❌ Generic schema/form builder
- ❌ Nested repeaters
- ❌ Drag-and-drop reordering
- ❌ Custom validation per item
- ❌ Dynamic field types per item
- ❌ Arbitrary object field support

### Why This Approach

A generic repeater system would require:
- Complex recursive schema validation
- Advanced UI components (drag-drop, nested editors)
- External dependencies for rich form builders
- Runtime object serialization/deserialization

Instead, Phase 52 provides **just enough** for simple lists, proving the pattern works while keeping the implementation intentionally small.

## Simple List Type

### Shape

```typescript
Array<{
  id: string          // Stable identifier for the item
  title: string       // Required display title
  body?: string       // Optional description/content
}>
```

### Usage in Feature Grid

Feature Grid block uses `simple-list` to edit its `items` array:

```typescript
{
  key: "items",
  label: "Items",
  type: "simple-list",
  groupId: "items",
  description: "Add, edit, or remove grid items.",
  minItems: 0,
  maxItems: 20,
}
```

### Admin UI Behavior

The simple-list inspector field:
- Renders each item as a compact card/fieldset
- Title input + body textarea per item
- Remove button (respects minItems constraint)
- Add Item button (respects maxItems constraint)
- Generates stable IDs using `crypto.randomUUID()` or fallback
- Shows helpful constraints if minItems or maxItems are set
- Normalizes malformed items safely
- Never crashes on invalid input

### Public Rendering

Simple list items are never directly rendered as UI. They are used by blocks (currently Feature Grid) to structure content:

- Feature Grid renders items as responsive grid cards
- Each item becomes a card with title + optional body
- Rendering is block-specific, not generic

## Implementation Details

### Field Definition

```typescript
// In inspector field definitions:
{
  key: "items",
  label: "Items",
  type: "simple-list",
  minItems?: number      // Minimum items required
  maxItems?: number      // Maximum items allowed
}
```

### Admin Renderer

Located at: `apps/admin/src/components/inspector/simple-list-renderer.tsx`

- Client-side React component
- Handles add/remove/edit operations
- Respects minItems/maxItems constraints
- Uses semantic HTML with proper ARIA labels
- No external dependencies

### Backward Compatibility

Existing saved Feature Grid blocks may contain `itemsJson` (from Phase 51):

- Admin renderer prefers `items` array
- Falls back to parsing `itemsJson` if `items` is empty
- Shows a small legacy notice if fallback is used
- Public renderer silently prefers `items` over `itemsJson`
- Both renderers handle invalid JSON gracefully

New Feature Grid blocks do NOT create `itemsJson` — only `items`.

### Normalization

The `normalizeSimpleListItems()` utility (in `@sovereign-cms/core`):
- Accepts unknown input
- Returns safe array of valid items
- Discards items without id or title
- Handles missing/malformed data gracefully

## Future Phases

Phase 52 sets the foundation for potential future enhancements:

- **Phase 53+**: Add reordering UI (drag-and-drop or move buttons)
- **Phase 54+**: Add more controlled repeater types if needed (simple-table, etc.)
- **Phase 55+**: Consider controlled field variants (numbers, dates, etc.)

But these will follow the same principle: **intentionally small, not generic**.

## Files Modified

### Core Package
- `packages/core/src/block-utils.ts`: New helper for normalization
- `packages/core/src/index.ts`: Export helper

### Admin App
- `apps/admin/src/components/inspector/field-types.ts`: Added `simple-list` type
- `apps/admin/src/components/inspector/simple-list-renderer.tsx`: New renderer
- `apps/admin/src/components/inspector/inspector-field-renderer.tsx`: Integrated simple-list
- `apps/admin/src/block-definitions/registry.ts`: Migrated Feature Grid to simple-list
- `apps/admin/src/components/block-renderers/feature-grid-renderer.tsx`: Prefers items, fallback to itemsJson

### Web App
- `apps/web/src/components/public/PublicBlockRenderer.tsx`: Prefers items, silent fallback

### Documentation
- `docs/architecture/controlled-repeater-foundation-phase-52.md`: This file
- `docs/migration/phase-52-result.md`: Implementation results

## Design Decisions

### Single Shape

Why only `{ id, title, body }`?

- Feature Grid was the primary target
- This shape covers 90% of simple list use cases
- Adding more fields would start a slippery slope toward a generic builder
- Future blocks needing different shapes can add their own specialized repeater

### No Drag-and-Drop

Why not in Phase 52?

- Drag-and-drop adds UI complexity (libraries, accessibility, touch support)
- Order is not critical for Feature Grid items
- Can be added as a controlled enhancement in a future phase
- Keeps Phase 52 focused on the core repeater pattern

### No Nested Repeaters

Why not recursive?

- Nested repeaters require complex schema handling
- Would necessitate generic form generation
- Feature Grid does not need nested lists
- Blocks needing nested structures can be designed differently

## Conclusion

Phase 52 provides a **minimal, intentional repeater** that solves a real problem (editing simple lists in blocks) without overengineering into a generic system.

This approach makes Phase 52 simple to maintain, easy to reason about, and sets a precedent for future controlled enhancements.
