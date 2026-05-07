# Inspector Field Registry Architecture

## Overview

The Inspector Field Registry is a simple, extensible system for managing editable block properties without hardcoded logic. It decouples block type definitions from UI rendering.

## Problem Solved

**Before Phase 14:**
```typescript
// Hard-wired logic in PropsEditing component
if (block.type === "hero") {
  return <input ... /> // headline
         <input ... /> // subline
}
if (block.type === "text") {
  return <textarea ... /> // body
}
```

**Issues:**
- Adding new block types requires modifying component logic
- Field UI is tightly coupled to block types
- Difficult to test
- Scales poorly

**After Phase 14:**
```typescript
// Declarative registry
const blockFieldRegistry = {
  hero: [{ key: "headline", ... }, { key: "subline", ... }],
  text: [{ key: "body", ... }],
}

// Generic renderer
const fields = getInspectorFieldsForBlock(blockType)
fields.map(field => <InspectorFieldRenderer field={field} ... />)
```

## Architecture

### Flow

```
Block Selected
    ↓
getInspectorFieldsForBlock(block.type)
    ↓
blockFieldRegistry lookup
    ↓
Return InspectorFieldDefinition[]
    ↓
For each field:
  InspectorFieldRenderer({field, value, onChange})
    ↓
Render text input | textarea | fallback
    ↓
onChange sends patch: { [field.key]: value }
    ↓
updateBlockProps merges into draft
```

### Components

#### 1. Field Types (`field-types.ts`)

Defines the type system:

```typescript
export type InspectorFieldType = "text" | "textarea"

export type InspectorFieldDefinition = {
  key: string              // Property key in block.props
  label: string            // Display label
  type: InspectorFieldType // UI component type
  placeholder?: string     // Input placeholder
}
```

#### 2. Block Field Registry (`block-field-registry.ts`)

Declarative mapping of block types to editable fields:

```typescript
export const blockFieldRegistry: Record<string, InspectorFieldDefinition[]> = {
  hero: [
    { key: "headline", label: "Headline", type: "text", placeholder: "..." },
    { key: "subline", label: "Subline", type: "text", placeholder: "..." },
  ],
  text: [
    { key: "body", label: "Body", type: "textarea", placeholder: "..." },
  ],
}
```

**To add a new block type:**
1. Add entry to `blockFieldRegistry`
2. Define fields with appropriate types
3. Inspector automatically renders them

#### 3. Field Renderer (`inspector-field-renderer.tsx`)

Renders individual fields based on definition:

```typescript
<InspectorFieldRenderer
  field={field}
  value={props[field.key]}
  onChange={(value) => onUpdateProps({ [field.key]: value })}
/>
```

Supports:
- `text` → `<input type="text" />`
- `textarea` → `<textarea />`
- Unknown types → "Unknown field type" message

**Safety:**
- Coerces all values to strings (safe for text/textarea)
- Falls back to empty string for null/undefined
- No validation (by design - defer to later phases)

#### 4. Inspector Component (`editor-inspector.tsx`)

Refactored to use registry:

```typescript
// Get fields from registry
const fields = getInspectorFieldsForBlock(block.type)

// If no fields registered
if (fields.length === 0) {
  return "No inspector fields registered..."
}

// Render each field
return fields.map(field =>
  <InspectorFieldRenderer
    field={field}
    value={props[field.key]}
    onChange={value => onUpdateProps({ [field.key]: value })}
  />
)
```

## Design Decisions

### Why Declarative Registry?

1. **Separation of Concerns**: Field definitions separate from rendering logic
2. **Extensibility**: Add block types without touching component code
3. **Testability**: Can test registry and renderer independently
4. **Scalability**: Handles 2 block types today, 20 block types tomorrow
5. **Future-Proof**: Easy to add validation, conditional fields, etc. later

### Why Only text/textarea?

- Simple to implement and understand
- Covers 90% of initial use cases
- Future phases can add: number, select, date, rich-text, etc.

### Why No Validation?

- Current scope: no DB writes yet
- Validation rules often depend on business logic
- Inspector is just UI layer
- Future phases can add validation rules to field definitions

### Why Patch-Based Updates?

- Small, focused changes reduce bugs
- Merges cleanly with recursive `mergeProps()`
- Supports partial updates (don't overwrite whole props)

## Extension Points

### Adding a New Block Type

**Step 1:** Update `blockFieldRegistry`

```typescript
export const blockFieldRegistry = {
  // ... existing
  image: [
    { key: "src", label: "Image URL", type: "text", placeholder: "https://..." },
    { key: "alt", label: "Alt Text", type: "text", placeholder: "Description" },
    { key: "caption", label: "Caption", type: "textarea" },
  ],
}
```

**Step 2:** Create corresponding block renderer in `block-renderers/`

Inspector automatically renders fields—no additional code needed!

### Adding a New Field Type

**Step 1:** Add to `InspectorFieldType`

```typescript
export type InspectorFieldType = "text" | "textarea" | "select"
```

**Step 2:** Handle in `InspectorFieldRenderer`

```typescript
if (field.type === "select") {
  return (
    <select value={stringValue} onChange={(e) => onChange(e.target.value)}>
      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  )
}
```

**Step 3:** Use in registry

```typescript
{ key: "alignment", label: "Alignment", type: "select", options: ["left", "center", "right"] }
```

## Limitations

### Current

- Only `text` and `textarea` field types supported
- No field validation (strings only)
- No conditional fields (show field only if another field equals X)
- No required fields or error states
- No field ordering (uses registry order)

### By Design

- No DB integration (mock-only)
- No API route integration (mock-only)
- No advanced form features (defer to future)

## Testing Recommendations

### Manual Testing

1. **Hero Block:**
   - Select hero block
   - Verify headline/subline inputs appear
   - Edit each field
   - Verify changes in raw props preview
   - Verify dirty state triggers

2. **Text Block:**
   - Select text block
   - Verify body textarea appears
   - Edit content
   - Verify changes appear in preview
   - Verify save flow works

3. **Unknown Block Type:**
   - Manually add a block with type "unknown"
   - Verify "No inspector fields registered..." message
   - Verify raw props preview still shows

### Unit Testing (Future)

- Test `getInspectorFieldsForBlock()` returns correct definitions
- Test `InspectorFieldRenderer` with each field type
- Test value coercion (null → "", number → "")

## Files

```
apps/admin/src/components/
├── editor-inspector.tsx (refactored)
└── inspector/
    ├── field-types.ts (new)
    ├── block-field-registry.ts (new)
    └── inspector-field-renderer.tsx (new)
```

## Future Enhancements

**Phase 15+:**

1. **Validation Rules**
   - Add `validate?: (value: unknown) => string | null` to `InspectorFieldDefinition`
   - Show error messages in inspector

2. **Conditional Fields**
   - Add `visible?: (props: Record<string, unknown>) => boolean`
   - Render fields conditionally based on other field values

3. **Field Options**
   - `select` type with options array
   - `checkbox` type
   - `radio` type for enums

4. **Rich Text**
   - Replace `textarea` with minimal markdown editor
   - Or basic rich text input for text blocks

5. **Image Upload**
   - Connect to storage adapter
   - Browse/upload images for image blocks

---

**Status:** Phase 14 Complete
**Ready for:** Phase 15 (Additional block types, validation, or other features)
