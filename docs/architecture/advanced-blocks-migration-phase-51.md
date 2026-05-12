# Phase 51: Controlled Advanced Blocks Migration

## Overview

Phase 51 introduces three new advanced content blocks to the SovereignCMS architecture: **CTA**, **Feature Grid**, and **Image + Text**. This migration is intentionally controlled and minimal, adding only essential functionality without importing legacy complexity or creating unnecessary abstraction layers.

## Philosophy

This phase follows these principles:

- **No legacy code imports**: All implementations are written from scratch following current CMS patterns.
- **Stable, small prop contracts**: Each block type has a minimal, intentional set of properties.
- **Existing infrastructure only**: Uses existing inspector fields, admin renderers, and public block renderer patterns.
- **Future-proof constraints**: Deliberate limitations (e.g., no array editor) preserve flexibility for controlled expansion in future phases.

## Block Types

### 1. CTA Block

**Purpose**: Display a call-to-action section with headline, supporting text, and one or two action buttons.

**Props**:

```typescript
type CtaBlockProps = {
  eyebrow?: string           // Small text above headline
  headline?: string           // Main heading (required-ish)
  body?: string              // Supporting text
  primaryLabel?: string       // Primary button text
  primaryHref?: string        // Primary button link
  secondaryLabel?: string     // Secondary button text (optional)
  secondaryHref?: string      // Secondary button link
  align?: "left" | "center"   // Horizontal alignment
}
```

**Admin Preview**: Static card showing headline, body, and disabled button mock-ups.

**Public Rendering**: Semantic section with clickable links (only rendered if href exists).

**Default Props**:

```json
{
  "eyebrow": "Next Step",
  "headline": "Ready to move forward?",
  "body": "Add a clear call to action for this section.",
  "primaryLabel": "Get started",
  "primaryHref": "#",
  "secondaryLabel": "",
  "secondaryHref": "",
  "align": "center"
}
```

### 2. Feature Grid Block

**Purpose**: Display a responsive grid of feature/benefit cards with flexible column count.

**Props**:

```typescript
type FeatureGridItem = {
  id: string
  title: string
  body?: string
}

type FeatureGridBlockProps = {
  headline?: string
  intro?: string
  columns?: 2 | 3 | 4
  items: FeatureGridItem[]
}
```

**Admin Preview**: Static grid showing items with title and optional body.

**Public Rendering**: Responsive grid that adapts from 1 column (mobile) to 2/3/4 columns (desktop).

**Array Handling**: In this phase, array editing is intentionally limited. Admins can edit items as JSON in a textarea field. This constraint prevents introducing a generic array field system now while preserving the option to add a controlled repeater in a future phase.

**Default Props**:

```json
{
  "headline": "Feature Grid",
  "intro": "Highlight important benefits or content areas.",
  "columns": 3,
  "items": [
    {"id": "feature-1", "title": "Feature one", "body": "Describe the first feature."},
    {"id": "feature-2", "title": "Feature two", "body": "Describe the second feature."},
    {"id": "feature-3", "title": "Feature three", "body": "Describe the third feature."}
  ]
}
```

### 3. Image + Text Block

**Purpose**: Display an image alongside text content with flexible positioning and optional CTA button.

**Props**:

```typescript
type ImageTextBlockProps = {
  headline?: string
  body?: string
  imageUrl?: string          // Full HTTPS URL only
  imageAlt?: string          // Accessibility text
  imagePosition?: "left" | "right"
  ctaLabel?: string          // Optional button text
  ctaHref?: string           // Button link
}
```

**Admin Preview**: Static card showing thumbnail (if imageUrl exists) and text content.

**Public Rendering**: Two-column responsive layout with image and text side-by-side (stacks on mobile). Only renders img tag if imageUrl is non-empty.

**Default Props**:

```json
{
  "headline": "Image and Text",
  "body": "Combine a visual with supporting content.",
  "imageUrl": "",
  "imageAlt": "",
  "imagePosition": "right",
  "ctaLabel": "",
  "ctaHref": ""
}
```

## Implementation Details

### Core Types (packages/core/src/blocks.ts)

New prop types are exported via the core package for reuse across admin and web apps.

### Admin Implementation

**Renderer Files**:

- `apps/admin/src/components/block-renderers/cta-renderer.tsx`
- `apps/admin/src/components/block-renderers/feature-grid-renderer.tsx`
- `apps/admin/src/components/block-renderers/image-text-renderer.tsx`

Each renderer:

- Accepts a `CmsBlock` through the existing admin pattern
- Reads props defensively using helper functions (asRecord, asString, asArray, asNumber)
- Renders a clean, static preview without external dependencies
- Never crashes on missing or malformed props

**Block Definitions** (apps/admin/src/block-definitions/registry.ts):

Each block definition includes:

- Block type, label, and category
- Field groups for organizing inspector fields
- Inspector fields for text, textarea, select inputs
- Default props for new block instances
- Admin renderer component reference

### Web Implementation

**Public Renderer** (apps/web/src/components/public/PublicBlockRenderer.tsx):

New switch cases render each block type:

- **CTA**: Section with center/left-aligned content and conditional button rendering
- **Feature Grid**: Responsive grid with responsive column counts (1 → 2/3/4)
- **Image + Text**: Two-column layout with image position flexibility

All rendering:

- Uses semantic HTML (section, h2, p, a, img)
- Never loads external resources except images from provided URLs
- Uses only native HTML elements and Tailwind CSS
- Remains server-compatible (no Client Component needed)

## Constraints (Intentional)

1. **No preset library**: Preset variants can be added in a future controlled phase.
2. **No dynamic schema system**: Props are statically typed; no generic builder schemas.
3. **No animation system**: Pure semantic markup with accessible, responsive layouts.
4. **No recursive/nested blocks**: Blocks cannot contain other blocks.
5. **No array editor GUI**: Feature Grid items edited as JSON textarea (preserves flexibility for controlled repeater in future).
6. **No external libraries**: All rendering uses native HTML and Tailwind CSS.
7. **No runtime objects in Client Components**: Block props passed to public components are plain data.

## Backward Compatibility

✅ All existing blocks continue to work:

- `hero`
- `text`
- `contact-form`
- `external-embed`

No existing code was modified to break these blocks.

## Next Steps

Future phases may introduce:

- **Phase 52+**: Controlled preset library for popular CTA/grid configurations
- **Phase 53+**: Controlled array/repeater field editor for admins
- **Phase 54+**: Additional block types (testimonials, FAQ, etc.) following the same minimal approach

## Files Modified

### Core

- `packages/core/src/blocks.ts`: Added CtaBlockProps, FeatureGridItem, FeatureGridBlockProps, ImageTextBlockProps
- `packages/core/src/index.ts`: Exported new prop types

### Admin

- `apps/admin/src/block-definitions/registry.ts`: Added three block definitions with inspector fields
- `apps/admin/src/components/block-renderers/cta-renderer.tsx`: New
- `apps/admin/src/components/block-renderers/feature-grid-renderer.tsx`: New
- `apps/admin/src/components/block-renderers/image-text-renderer.tsx`: New

### Web

- `apps/web/src/components/public/PublicBlockRenderer.tsx`: Added three switch cases for public rendering

## Testing

All implementations pass:

- `npm run typecheck`: No TypeScript errors
- `npm run lint`: No ESLint violations
- `npm run build`: Successful build

## Validation

✅ Admin block palette includes CTA, Feature Grid, Image + Text  
✅ New blocks can be added and edited in the editor  
✅ Inspector shows all editable fields  
✅ Admin previews render without crashes  
✅ Public renderer handles all three block types  
✅ No runtime objects passed to client components  
✅ No legacy code imported  
✅ No API routes added  
✅ Existing blocks remain functional
