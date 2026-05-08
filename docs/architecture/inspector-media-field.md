# Inspector Media Field Foundation (Phase 32)

## Overview

Phase 32 extends the Inspector Field System to support media asset selection within block editor fields.

Blocks can now reference media assets (images, documents, etc.) directly through the Inspector, enabling UI blocks to incorporate visuals.

## Architecture

### Field Type System Extended

**Location**: `apps/admin/src/components/inspector/field-types.ts`

```typescript
export type InspectorFieldType = "text" | "textarea" | "media"

export type InspectorFieldDefinition = {
  key: string
  label: string
  type: InspectorFieldType
  placeholder?: string
  mediaType?: "image" | "document" | "video" | "other"  // ← New
}
```

### Media Field Rendering

**Location**: `apps/admin/src/components/inspector/inspector-field-renderer.tsx`

When field type is "media":

1. Validates `tenantId` is available (required for MediaPicker)
2. Extracts `selectedAssetId` from current prop value
3. Renders `<MediaPicker>` with tenant scope
4. On asset selection, returns **object patch**:

```typescript
{
  mediaAssetId: asset.id,
  mediaUrl: asset.url,
  mediaAlt: asset.alt ?? asset.title,
}
```

#### Object Patching

Media fields are special: they return multi-prop updates, not single-field updates.

**Before (text field)**:
```typescript
onChange("new value") → { [fieldKey]: "new value" }
```

**After (media field)**:
```typescript
onChange({ mediaAssetId, mediaUrl, mediaAlt }) → { mediaAssetId, mediaUrl, mediaAlt }
```

Helper function `buildFieldPatch()` in `EditorInspector` handles both cases transparently.

### Block Definition Registry

**Location**: `apps/admin/src/block-definitions/registry.ts`

Hero block extended with media field:

```typescript
{
  type: "hero",
  defaultProps: {
    headline: "New Headline",
    subline: "New Subline",
    mediaAssetId: null,      // ← New
    mediaUrl: "",            // ← New
    mediaAlt: "",            // ← New
  },
  inspectorFields: [
    // ... existing text fields ...
    {
      key: "mediaAssetId",
      label: "Hero Image",
      type: "media",
      mediaType: "image",    // ← Filter to images only
    },
  ],
}
```

### Inspector Integration

**Location**: `apps/admin/src/components/editor-inspector.tsx`

Enhanced to handle media field updates:

```typescript
function buildFieldPatch(fieldKey: string, value: unknown): Record<string, unknown> {
  // If value is object (media patch), return as-is
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  
  // Regular fields wrap under field key
  return { [fieldKey]: value }
}
```

Props passed down:
- `tenantId` — required for MediaPicker
- All field types use same renderer interface

### Hero Admin Renderer

**Location**: `apps/admin/src/components/block-renderers/hero-renderer.tsx`

Defensively reads media props:

```typescript
const mediaUrl = asString(props.mediaUrl)
const mediaAlt = asString(props.mediaAlt)

// If image selected, show preview
if (mediaUrl) {
  <img src={mediaUrl} alt={mediaAlt || headline} />
}
```

- No Next Image optimization (unnecessary for demo)
- Fallback alt text to headline if not set
- Shows truncated URL in metadata

### PageEditorClient Flow

**Location**: `apps/admin/src/components/page-editor-client.tsx`

Passes `tenantId` down the component tree:

```
PageEditorClient (knows tenant)
  ↓
EditorInspector (receives tenantId)
  ↓
InspectorFieldRenderer (uses tenantId for MediaPicker)
  ↓
MediaPicker (tenant-aware asset selection)
```

No Runtime object leakage — only tenantId string passed.

## Data Flow: Media Selection

```
User opens Inspector → Block selected
  ↓
Hero block shows Inspector Fields
  ↓
"Hero Image" field renders MediaPicker
  ↓
User selects image in MediaPicker
  ↓
MediaPicker.onSelect(asset) fires
  ↓
InspectorFieldRenderer.onChange({
  mediaAssetId: asset.id,
  mediaUrl: asset.url,
  mediaAlt: asset.alt
})
  ↓
EditorInspector.buildFieldPatch() handles object patch
  ↓
updateBlockProps(blockId, {
  mediaAssetId, mediaUrl, mediaAlt
})
  ↓
draftBlocks[id].props updated
  ↓
HeroAdminRenderer re-renders with image
  ↓
Raw Props Preview shows:
{
  "headline": "...",
  "subline": "...",
  "mediaAssetId": "uuid",
  "mediaUrl": "https://...",
  "mediaAlt": "description"
}
```

## Save Flow (Unchanged)

Media props are **part of block props**, so they're saved with existing flow:

```
User clicks Save
  ↓
normalizeBlockOrder(draftBlocks)
  ↓
clientEditorPersistence.savePageDraft({
  blocks: [
    {
      id, type, props: {
        headline, subline, mediaAssetId, mediaUrl, mediaAlt
      }
    }
  ]
})
  ↓
Server Action → runtime.editor.savePageDraft()
  ↓
persisted: false (in-memory demo)
```

## Known Limitations (Intentional)

- ❌ No actual upload UI
- ❌ No storage provider integration
- ❌ No image optimization (Next Image)
- ❌ No gallery (multi-image selection)
- ❌ No public rendering yet (Phase 33)
- ❌ No media field in Text block (Hero only)
- ❌ No image cropping/editing
- ❌ No drag & drop reordering of media

All can be added in future phases.

## Type Safety

All operations are fully typed:

```typescript
// InspectorFieldDefinition includes mediaType
// MediaPicker typed with MediaAsset
// Object patch is Record<string, unknown>
// buildFieldPatch is type-safe for both patterns
```

## Testing Scenarios

1. **Create Hero block**: Has `mediaAssetId: null`, renders empty preview
2. **Open Inspector**: Shows MediaPicker in "Hero Image" field
3. **Select image**: `mediaAssetId`, `mediaUrl`, `mediaAlt` populate
4. **Hero preview updates**: Shows image above headline
5. **Raw Props Preview**: Shows full media props object
6. **Save and reload**: Media props persist in draft

## Future Integration (Phase 33+)

### Public Rendering

```typescript
// apps/web/src/components/hero.tsx
const heroProps = page.blocks[0].props
if (heroProps.mediaUrl) {
  return (
    <div>
      <img src={heroProps.mediaUrl} alt={heroProps.mediaAlt} />
      <h1>{heroProps.headline}</h1>
    </div>
  )
}
```

### More Blocks with Media

```typescript
// Gallery block
defaultProps: {
  mediaAssetIds: [],  // Multi-select (future)
}

// Feature block
defaultProps: {
  mediaAssetId: null,
  headline: "",
  description: "",
}
```

### Image Optimization

```typescript
// Only if storage is real
import Image from "next/image"

<Image
  src={heroProps.mediaUrl}
  alt={heroProps.mediaAlt}
  width={1200}
  height={600}
/>
```

## File Summary

| File | Purpose |
|------|---------|
| `apps/admin/src/components/inspector/field-types.ts` | Added `media` field type |
| `apps/admin/src/components/inspector/inspector-field-renderer.tsx` | Media field UI with MediaPicker |
| `apps/admin/src/components/editor-inspector.tsx` | Object patch handling |
| `apps/admin/src/block-definitions/registry.ts` | Hero block media fields |
| `apps/admin/src/components/block-renderers/hero-renderer.tsx` | Media preview |
| `apps/admin/src/components/page-editor-client.tsx` | tenantId forwarding |

## Security & Isolation

- ✅ tenantId explicitly passed to MediaPicker
- ✅ No Runtime in client
- ✅ Server Actions validate tenantId
- ✅ In-memory demo (no persistence)
- ✅ No global state leakage

## Summary

Phase 32 establishes:

- ✅ Media field type in Inspector
- ✅ MediaPicker integrated in field editor
- ✅ Object patch system for multi-prop fields
- ✅ Hero block with optional image
- ✅ Admin preview shows selected image
- ✅ tenantId threading (no Runtime leak)
- ✅ Existing save flow unchanged
- ✅ Raw props display media metadata

No upload, no storage provider, no public rendering — admin UI only.

**Ready for Phase 33**: Public renderer integration.
