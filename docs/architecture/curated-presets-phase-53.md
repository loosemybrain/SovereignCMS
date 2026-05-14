# Phase 53: Curated Block Preset Foundation

**Status**: ✅ IMPLEMENTED  
**Focus**: Static block presets for faster content creation

## Overview

Phase 53 introduces a **static preset system** for block types. Presets are curated default configurations that editors can select when creating blocks. The system:

- **Static**: TypeScript files only, no database or configuration system
- **Type-Safe**: Full TypeScript type checking for preset props
- **Non-Mutating**: Presets are cloned when applied, props never modified
- **Admin-Only**: Preset selection UI exists only in the admin app
- **Optional**: Editors can still create blocks manually without presets

## Architecture

### BlockPreset Generic Type

```typescript
export type BlockPreset<T extends Record<string, unknown>> = {
  id: string                    // Unique identifier
  name: string                  // Human-readable name
  description: string           // Purpose and use case
  props: T                       // Pre-configured props (type-safe)
}
```

The generic parameter `T` maintains full type safety—presets for Hero blocks use `HeroBlockProps`, presets for Feature Grid use `FeatureGridBlockProps`, etc.

### Core Package Integration

- File: `packages/core/src/block-presets.ts`
- Exports:
  - `BlockPreset<T>` type
  - `BLOCK_PRESETS` object containing all presets grouped by block type
  - `getPresetsForBlockType(blockType: string)` helper
  - `getPresetById(presetId: string)` helper
- Integrated into `packages/core/src/index.ts`

### Admin Integration

When a user adds a block from the palette:

1. **BlockPalette Component** displays presets grouped by block type
2. Each block type shows:
   - 2-3 curated presets with names and descriptions
   - "Leerer Block" (empty block) option for manual creation
3. User clicks a preset or empty block button
4. **PageEditorClient.addBlock()** receives optional `presetId` parameter
5. If preset provided, preset props are cloned; otherwise, definition defaults used
6. New block created with cloned props

## Available Presets

### Hero Block (3 presets)

| ID | Name | Description |
|----|------|-------------|
| `hero-simple` | Simple Headline | Minimal hero with headline and subline, no background |
| `hero-with-image` | Hero with Background | Hero with background image, headline, and subline |
| `hero-minimal` | Minimal Headline | Small, focused hero with short headline only |

### Text Block (3 presets)

| ID | Name | Description |
|----|------|-------------|
| `text-paragraph` | Single Paragraph | Single paragraph of text content |
| `text-multiline` | Multiple Paragraphs | Multiple paragraphs with formatting support |
| `text-snippet` | Text Snippet | Brief text snippet for quick messaging |

### CTA Block (3 presets)

| ID | Name | Description |
|----|------|-------------|
| `cta-single-button` | Single Button | Call-to-action with one primary button |
| `cta-dual-buttons` | Dual Buttons | Call-to-action with primary and secondary buttons |
| `cta-left-aligned` | Left-Aligned CTA | Left-aligned call-to-action section |

### Feature Grid Block (3 presets)

| ID | Name | Description |
|----|------|-------------|
| `grid-2col-4items` | 2-Column Grid (4 Items) | Two-column grid with 4 features |
| `grid-3col-6items` | 3-Column Grid (6 Items) | Three-column grid with 6 features |
| `grid-4col-8items` | 4-Column Grid (8 Items) | Four-column grid with 8 features |

**Important**: Feature Grid presets use the `items` array (not `itemsJson`) with UUID-like IDs.

### Image + Text Block (3 presets)

| ID | Name | Description |
|----|------|-------------|
| `imgtext-image-left` | Image Left | Image positioned on the left with text on the right |
| `imgtext-image-right` | Image Right | Image positioned on the right with text on the left |
| `imgtext-minimal` | Minimal Image Text | Simple image and text without call-to-action |

## How Presets Work

### Preset Application

1. User selects a preset from BlockPalette
2. `onAddBlock(blockType, presetId)` is called
3. In `PageEditorClient.addBlock()`:
   - `getPresetById(presetId)` retrieves the preset
   - Preset props are used instead of definition defaults
   - Props are cloned via `cloneDefaultProps()` (never mutated)
4. New block created with preset props
5. Block appears in editor, ready for editing

### Props Cloning

Presets use `cloneDefaultProps()` utility (existing from earlier phases) to safely clone props. This ensures:
- Presets are never modified when applied
- Each block gets independent prop objects
- Mutations to one block don't affect presets or other blocks

### Manual Block Creation

The "Leerer Block" (empty block) button works exactly as before:

```typescript
onAddBlock(blockType) // no presetId
```

Definition defaults are used instead of preset props.

## Files Created

- `packages/core/src/block-presets.ts`: Preset definitions and helpers
- `docs/architecture/curated-presets-phase-53.md`: This file
- `docs/migration/phase-53-result.md`: Implementation completion report

## Files Modified

- `packages/core/src/blocks.ts`: Added `HeroBlockProps` and `TextBlockProps` types
- `packages/core/src/index.ts`: Exported preset types and helpers
- `apps/admin/src/components/page-editor-client.tsx`: Updated `addBlock()` to accept optional `presetId`
- `apps/admin/src/components/editor/block-palette.tsx`: UI showing presets per block type

## What Phase 53 Does NOT Include

❌ **Dynamic Preset Creation**: Presets are static TypeScript, not user-configurable  
❌ **Preset Versioning**: No mechanism to evolve presets over time  
❌ **Preset Customization UI**: Editors cannot modify or create new presets  
❌ **Preset Import/Export**: No system to share presets across tenants  
❌ **Preset Templates**: No template inheritance or composition  
❌ **Runtime Impact**: Presets exist only in admin, zero effect on public rendering  

## Design Decisions

### Why Static Presets?

- **Simplicity**: TypeScript file, no database or API needed
- **Type Safety**: Generic `BlockPreset<T>` maintains prop type checking
- **Immutability**: Props cloned on apply, never mutated
- **Version Control**: Presets in git, easy to audit and change
- **No Dependencies**: No external libraries or frameworks

### Why 2-3 Presets Per Type?

- Enough variety to cover common use cases
- Not so many that editors are overwhelmed by choice
- Easy to expand in future phases if needed

### Why "Leerer Block" Still Available?

- Editors may want custom configurations not covered by presets
- Presets suggest patterns but don't enforce them
- Maintains flexibility while encouraging best practices

## Validation Results

- ✅ `npm run typecheck`: 15/15 packages successful
- ✅ `npm run lint`: 0 violations
- ✅ `npm run build`: All packages built successfully

## Next Steps

Future phases may introduce:

- **Phase 54+**: Preset customization UI for advanced editors
- **Phase 55+**: Preset import/export for multi-tenant scenarios
- **Phase 56+**: Additional presets based on usage patterns

## Conclusion

Phase 53 provides a lightweight, type-safe preset system that helps editors create blocks faster. Presets are optional—the "Leerer Block" option maintains full flexibility. The static TypeScript approach ensures simplicity, clarity, and version control integration.

All hard rules followed. Existing functionality preserved. Zero runtime impact.
