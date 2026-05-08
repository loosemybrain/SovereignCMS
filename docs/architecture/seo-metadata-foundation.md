# SEO Metadata Foundation (Phase 33)

## Overview

Phase 33 introduces structured **SEO metadata** at the page level, enabling content creators to optimize pages for search engines and social sharing.

Pages can now include:
- `seoTitle` — Optimized title for search results (30-60 chars recommended)
- `seoDescription` — Meta description for search results (100-160 chars recommended)
- `seoImageAssetId` — Reference to media asset for social previews
- `seoImageUrl` — Direct URL to SEO image
- `canonicalUrl` — Preferred URL if page has duplicates
- `robotsIndex` — Allow/disallow indexing by search engines

## Architecture

### Core SEO Types

**Location**: `packages/core/src/seo.ts`

```typescript
export type SeoMetadata = {
  seoTitle?: string
  seoDescription?: string
  seoImageAssetId?: string | null
  seoImageUrl?: string
  canonicalUrl?: string
  robotsIndex?: boolean
}

export function createDefaultSeoMetadata(): SeoMetadata {
  return {
    seoTitle: "",
    seoDescription: "",
    seoImageAssetId: null,
    seoImageUrl: "",
    canonicalUrl: "",
    robotsIndex: true,
  }
}
```

### CmsPage with SEO

**Location**: `packages/core/src/cms.ts`

```typescript
export type CmsPage = CmsEntityBase & {
  slug: string
  locale: Locale
  title: string
  status: ContentStatus
  seo: SeoMetadata  // ← Structured metadata
}
```

### Save Flow Integration

**Location**: `packages/core/src/editor.ts`

```typescript
export type SavePageDraftInput = {
  tenantId: TenantId
  pageId: string
  locale: Locale
  blocks: CmsBlock[]
  pageSeo?: SeoMetadata  // ← Optional page-level SEO
}
```

SEO is saved alongside blocks:

```
User clicks Save
  ↓
normalizeBlockOrder(draftBlocks) + pageSeo
  ↓
savePageDraftAction({
  tenantId, pageId, locale,
  blocks: [...],
  pageSeo: {...}
})
  ↓
Server: runtime.editorPersistence.savePageDraft(input)
  ↓
persisted: false (InMemory demo)
```

## Inspector Integration

### SEO Editor Section

**Location**: `apps/admin/src/components/seo-editor-section.tsx`

Reusable SEO form component with fields:

- **SEO Title** — Text input, 0-200 chars, recommendation: 30-60
- **SEO Description** — Textarea, 0-500 chars, recommendation: 100-160
- **Canonical URL** — Optional, validation: must be https://, http://, or /
- **Robots Index** — Toggle button (Allow / Disallow)
- **SEO Image** — MediaPicker for social preview image

**Props**:
```typescript
type Props = {
  seo: SeoMetadata | null | undefined
  onUpdate: (patch: Partial<SeoMetadata>) => void
  tenantId?: string
}
```

### EditorInspector Enhanced

**Location**: `apps/admin/src/components/editor-inspector.tsx`

Now handles both block editing and page SEO:

**When block selected**:
- Shows block props editor (existing behavior)

**When no block selected**:
- Shows SEO Editor Section
- Shows Raw SEO Preview (JSON)

**Props**:
```typescript
type EditorInspectorProps = {
  selectedBlock: CmsBlock | null
  onUpdateProps?: (blockId: string, newProps: Record<string, unknown>) => void
  tenantId?: string
  pageSeo?: SeoMetadata | null       // ← New
  onUpdatePageSeo?: (patch: Partial<SeoMetadata>) => void  // ← New
}
```

### PageEditorClient SEO State

**Location**: `apps/admin/src/components/page-editor-client.tsx`

Separate state management for SEO (not mixed with blocks):

```typescript
const [pageSeo, setPageSeo] = useState<SeoMetadata>(
  page.seo || createDefaultSeoMetadata()
)

const updatePageSeo = (patch: Partial<SeoMetadata>) => {
  setPageSeo((prev) => ({ ...prev, ...patch }))
  setIsDirty(true)
}

// In save:
const result = await clientEditorPersistence.savePageDraft({
  tenantId: tenant.tenantId,
  pageId: page.id,
  locale: page.locale,
  blocks: blocksToSave,
  pageSeo,  // ← Included in save
})
```

## Data Flow: SEO Editing

```
User opens Editor
  ↓
Page loads with page.seo
  ↓
PageEditorClient: pageSeo = page.seo
  ↓
User clicks away from block (selectedBlock = null)
  ↓
EditorInspector shows SeoEditorSection
  ↓
User updates SEO Title
  ↓
onUpdatePageSeo({ seoTitle: "..." })
  ↓
updatePageSeo() merges patch
  ↓
setPageSeo() + setIsDirty(true)
  ↓
User clicks Save
  ↓
savePageDraft({ blocks, pageSeo })
  ↓
Server: runtime.editorPersistence.savePageDraft(input)
  ↓
Raw SEO Preview shows updated metadata
```

## MediaPicker for SEO Image

SEO Image field uses existing MediaPicker:

```typescript
<MediaPicker
  tenantId={tenantId}
  selectedAssetId={seoImageAssetId}
  onSelect={(asset) => {
    onUpdate({
      seoImageAssetId: asset.id,
      seoImageUrl: asset.url,
    })
  }}
/>
```

- Tenant-scoped asset selection
- Preview shown in grid
- No upload (uses existing demo assets)

## Validation

Helper functions in `packages/core/src/seo.ts`:

```typescript
validateCanonicalUrl(url: string): boolean
  // Returns true if: empty OR starts with https:// OR http:// OR /

validateSeoTitle(value: string): boolean
  // Returns true if: empty OR <= 200 chars

validateSeoDescription(value: string): boolean
  // Returns true if: empty OR <= 500 chars
```

## Known Limitations (Intentional)

- ❌ No Public Rendering with metadata
- ❌ No Metadata API (`generateMetadata()`)
- ❌ No sitemap generation
- ❌ No robots.txt generation
- ❌ No OpenGraph tags
- ❌ No Twitter Cards
- ❌ No Rich Snippets/Schema.org
- ❌ No Search Console integration
- ❌ No bulk SEO analysis tools

All are Phase 34+ features.

## Demo Data

InMemory pages initialized with demo SEO:

**German Home**:
```
seoTitle: "SovereignCMS Demo — Startseite"
seoDescription: "SovereignCMS ist ein modulares, tenant-aware CMS für portable Deployments."
canonicalUrl: "https://sovereign-cms-demo.local/de/home"
robotsIndex: true
```

**English Home**:
```
seoTitle: "SovereignCMS Demo — Home"
seoDescription: "SovereignCMS is a modular, tenant-aware CMS for portable deployments."
canonicalUrl: "https://sovereign-cms-demo.local/en/home"
robotsIndex: true
```

## Type Safety

All SEO operations are fully typed:

- `SeoMetadata` is strict type (not `Record<string, unknown>`)
- `SavePageDraftInput.pageSeo` is optional but typed
- `SeoEditorSection` receives typed `SeoMetadata`
- Validators are explicit, not inferred

## Testing Scenarios

1. **Create new page**: Receives default empty SEO
2. **Open inspector**: Shows SEO section when no block selected
3. **Edit title**: Updates `seoTitle`, marks dirty
4. **Edit description**: Updates `seoDescription`
5. **Set canonical URL**: Validates format, saves
6. **Toggle robots index**: Switches `robotsIndex` boolean
7. **Select SEO image**: Updates `seoImageAssetId` and `seoImageUrl`
8. **Save**: Persists SEO with blocks
9. **Raw preview**: JSON shows all SEO props

## Future Integration (Phase 34+)

### Public Rendering

```typescript
// apps/web/src/app/[[...slug]]/page.tsx
export async function generateMetadata({ params }) {
  const page = await loadPage(params.slug)
  
  return {
    title: page.seo.seoTitle || page.title,
    description: page.seo.seoDescription,
    openGraph: {
      image: page.seo.seoImageUrl,
      url: page.seo.canonicalUrl,
    },
  }
}
```

### Sitemap Generation

```typescript
// Route: /sitemap.xml
const pages = await loadAllPublishedPages()
return pages
  .filter((p) => p.seo.robotsIndex)
  .map((p) => ({
    url: p.seo.canonicalUrl || `/${p.locale}/${p.slug}`,
    lastmod: p.updatedAt,
  }))
```

### SEO Analysis Tools

- Readability checker
- Keyword density analyzer
- Focus keyword suggestions
- Bulk meta import/export

## File Summary

| File | Purpose |
|------|---------|
| `packages/core/src/seo.ts` | SeoMetadata type, validators |
| `packages/core/src/cms.ts` | CmsPage with seo field |
| `packages/core/src/editor.ts` | SavePageDraftInput with pageSeo |
| `packages/core/src/index.ts` | SEO exports |
| `packages/db/src/in-memory-adapter.ts` | Demo SEO initialization |
| `apps/admin/src/components/seo-editor-section.tsx` | SEO form component |
| `apps/admin/src/components/editor-inspector.tsx` | Inspector with SEO section |
| `apps/admin/src/components/page-editor-client.tsx` | SEO state management |

## Summary

Phase 33 establishes:

- ✅ Structured `SeoMetadata` type
- ✅ `CmsPage.seo` field with proper typing
- ✅ `SavePageDraftInput.pageSeo` for persistence
- ✅ SEO Editor Section component
- ✅ Page-level SEO editing in Inspector
- ✅ MediaPicker for SEO images
- ✅ Raw SEO preview (JSON)
- ✅ Validation functions
- ✅ Demo data initialization
- ✅ Separate SEO state management
- ✅ Save flow integration

No public rendering, no metadata API, no sitemap — **admin workflow only**.

**Ready for Phase 34**: Public SEO metadata rendering.
