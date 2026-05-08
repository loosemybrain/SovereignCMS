# Media Picker Foundation (Phase 31)

## Overview

Phase 31 introduces **MediaPicker**, a reusable admin-only component for selecting media assets within the CMS admin interface.

## What MediaPicker Does

**MediaPicker** is a client-side React component that:

1. Loads tenant-aware media assets via `clientMediaPersistence.listMediaAssets()`
2. Displays assets in a grid layout with previews
3. Allows the user to select a single asset via `onSelect` callback
4. Manages local selection state
5. Handles loading and error states

## Architecture

### Component Location

```
apps/admin/src/components/media-picker.tsx
```

### Props

```typescript
type Props = {
  tenantId: string                              // Tenant to load assets for
  selectedAssetId?: string | null               // Pre-selected asset ID
  onSelect: (asset: MediaAsset) => void         // Selection callback
}
```

### State

- `assets: MediaAsset[]` — Loaded assets for the tenant
- `isLoading: boolean` — Loading state
- `error: string | null` — Error message if loading fails
- `selectedId: string | null` — Currently selected asset ID (local state)

### Data Flow

```
Mount
  ↓
useEffect
  ↓
clientMediaPersistence.listMediaAssets({ tenantId })
  ↓
setAssets(result)
  ↓
Render grid
  ↓
User clicks asset
  ↓
setSelectedId + onSelect callback
```

### No Server Actions in Component

MediaPicker **only calls** `clientMediaPersistence.listMediaAssets()` via Server Action:

```typescript
// Client side (in effect):
const result = await clientMediaPersistence.listMediaAssets({ tenantId })

// Server Action delegates to:
// apps/admin/src/actions/load-media-assets.ts
// which calls runtime.mediaPersistence.listMediaAssets()
```

**Important**: No fetch, no localStorage, no direct runtime in client.

## UI Layout

### Grid Display

Assets are shown in a **2-column responsive grid**:

- **Selected State**: Blue border, blue background highlight
- **Hover State**: Border lightens on hover (unselected)
- **Asset Card Contents**:
  - Image preview (for `type === "image"`)
  - Type placeholder (for non-image types)
  - Title (truncated)
  - Asset type badge
  - Alt text (if available)
  - "Selected" button (disabled, shown when selected)

### States

#### Loading

```
Loading media assets...
```

#### Error

```
[Red box]
Failed to load media assets
```

#### Empty

```
[Gray box]
No media assets found for this tenant
```

#### Assets Loaded

Grid of asset cards with selection.

## Image Previews

For assets with `type === "image"`:

```typescript
<img
  src={asset.url}
  alt={asset.alt || asset.title}
  className="max-h-24 max-w-full object-contain"
/>
```

- Uses native `img` tag
- `alt` text is semantic (or fallback to title)
- No Next.js Image optimization (unnecessary for in-memory demo)
- No external image libraries

For non-image types:

```
[document]
[video]
[other]
```

## Type Validation

MediaPicker does **not** validate asset types itself. Validation happens at the Server Action layer:

**Location**: `apps/admin/src/actions/create-media-asset.ts`

```typescript
if (!isMediaAssetType(input.type)) {
  throw new Error("Invalid media asset type")
}
```

**Exported from**: `@sovereign-cms/core`

- `MEDIA_ASSET_TYPES` — array of valid types
- `isMediaAssetType()` — type guard function

## Demo Integration

### MediaPickerDemo Component

**Location**: `apps/admin/src/components/media-picker-demo.tsx`

A client-side wrapper that:

1. Renders MediaPicker
2. Maintains local state: `selectedAsset: MediaAsset | null`
3. Shows details of the selected asset in a card below

**Usage on `/media` route**:

```typescript
<MediaPickerDemo tenantId={tenant.tenantId} />
```

Integrated below the Asset List table to demonstrate the picker in action.

## Known Limitations (Intentional)

- ❌ **No block integration**: MediaPicker is admin-only, not yet in Inspector
- ❌ **No field type**: No "media" field type in Inspector yet
- ❌ **No storage integration**: Assets are demo data only
- ❌ **No actual upload**: No file upload UI
- ❌ **No public rendering**: Web app doesn't use MediaPicker
- ❌ **No multi-select**: Single asset selection only
- ❌ **No search/filter**: All tenant assets shown
- ❌ **No sorting**: Assets shown in load order
- ❌ **No pagination**: All assets in one grid
- ❌ **No drag/drop**: Click-only selection

All can be added in future phases.

## Future Integration (Phase 32+)

### In-Inspector Media Field

```typescript
// Future block definition:
{
  type: "hero",
  // ...
  inspectorFields: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "imageId", label: "Hero Image", type: "media" },  // ← Future
    // ...
  ],
}
```

### In-Block Props

```typescript
type HeroBlockProps = {
  headline: string
  imageId: string  // ← Selected from MediaPicker
}
```

### Save Flow

```
User selects image in Inspector MediaField
  ↓
Inspector calls onSelect callback
  ↓
Block props.imageId = asset.id
  ↓
Editor saves block with imageId
  ↓
Public renderer resolves imageId → asset.url
```

## Security & Isolation

- ✅ MediaPicker receives `tenantId` explicitly
- ✅ Server Actions validate `tenantId`
- ✅ Runtime enforces tenant isolation
- ✅ No global state or cross-tenant leakage
- ✅ No sensitive data in URL params
- ✅ No localStorage usage

## Testing Scenarios

1. **Load empty tenant**: MediaPicker shows empty state
2. **Load tenant with assets**: Grid displays all assets
3. **Select asset**: Selected state updates, onSelect callback fires
4. **Network error**: Error state shown
5. **Re-render with new selectedAssetId**: Preview highlights correct asset

## File Summary

| File | Purpose |
|------|---------|
| `packages/core/src/media.ts` | Type guards: `MEDIA_ASSET_TYPES`, `isMediaAssetType` |
| `packages/core/src/index.ts` | Exports for type guards |
| `apps/admin/src/components/media-picker.tsx` | Main MediaPicker component |
| `apps/admin/src/components/media-picker-demo.tsx` | Demo wrapper + details display |
| `apps/admin/src/actions/create-media-asset.ts` | Enhanced with `isMediaAssetType` validation |
| `apps/admin/src/app/(admin)/media/page.tsx` | Integrated MediaPickerDemo |

## Implementation Notes

### Why Client Component?

- MediaPicker needs to manage selection state
- User interactions (clicks) are client-side
- useEffect hook for loading is client-side
- Callback-based design fits client architecture

### Why Not Next Image?

- Assets in demo are URL-based (external URLs or data URLs)
- No optimization needed for in-memory demo
- Keeps component simple and dependency-light
- Full Next Image support can be added later when storage is real

### Why Grid Layout?

- Scanning many assets is easier in grid vs list
- Preview visibility is higher priority than metadata density
- Responsive 2-column layout works for admin interface
- Foundation for future drag/drop or multi-select

## Summary

Phase 31 establishes:

- ✅ Type guard validation for MediaAssetType
- ✅ MediaPicker reusable component
- ✅ Client-side asset selection with local state
- ✅ Server Action integration via clientMediaPersistence
- ✅ Image previews for image-type assets
- ✅ Demo integration on /media route
- ✅ Admin-only (no public rendering)
- ✅ Foundation for Inspector media field (Phase 32+)

No block integration, no storage provider, no actual upload — just a clean selection UI for future use.
