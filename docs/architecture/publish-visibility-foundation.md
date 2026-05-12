# Publish Visibility Foundation (Phase 35)

## Overview

Phase 35 introduces **controlled public visibility** based on content status.

Public rendering now respects content lifecycle:
- **Published pages**: Always visible to public
- **Draft pages**: Visible only with preview query parameter (preview=1 or preview=true)
- **Archived pages**: Never visible to public

No authentication, tokens, cookies, or middleware required. Preview is query-parameter based.

## Architecture

### Preview Context Types

**Location**: `packages/core/src/preview.ts`

```typescript
export type PreviewMode = "disabled" | "enabled"

export type PreviewContext = {
  mode: PreviewMode
}

export function createPreviewContext(input?: {
  preview?: string | string[] | undefined
}): PreviewContext {
  // Returns enabled if preview=1 or preview=true
  // Otherwise returns disabled
}
```

**Usage**:
- Extract from Next.js searchParams
- Pass through public resolutions
- Available in public page view

### Public Page Visibility Rules

**Location**: `packages/runtime/src/public-page-resolution.ts`

**Updated ResolvPublicPageInput**:
```typescript
export type ResolvePublicPageInput = {
  tenantId: string
  locale: string
  slug: string
  preview: PreviewContext  // ← New
}
```

**Resolution Logic**:
```typescript
// Archived: never visible
if (page.status === "archived") return null

// Published: always visible
if (page.status === "published") return page

// Draft: visible only in preview mode
if (page.status === "draft" && preview.mode === "enabled") return page

// All other cases: not visible
return null
```

### Public Navigation Visibility Rules

**Location**: `packages/runtime/src/public-navigation-resolution.ts`

**Updated resolveNavigation Input**:
```typescript
async resolveNavigation(params: {
  tenantId: string
  locale: string
  preview: PreviewContext  // ← New
}): Promise<NavigationItem[]>
```

**Filter Logic**:
```typescript
// Item visibility
if (!isPubliclyVisible(item.status, preview)) return false

if (item.type === "external") {
  // External link must have href
  return Boolean(item.href)
}

if (item.type === "page") {
  // Referenced page must exist and also be publicly visible
  return Boolean(page && isPubliclyVisible(page.status, preview))
}
```

**Alignment Rule**:
- For `page` navigation entries, both layers must pass:
  - Navigation item status visibility
  - Referenced page status visibility
- This prevents links to hidden draft pages when preview is disabled.

### Public Page Loader

**Location**: `apps/web/src/lib/load-public-page.ts`

**Updated Input**:
```typescript
export async function loadPublicPage(input: {
  host: string
  slug: string
  locale: string
  searchParams?: Record<string, string | string[] | undefined>  // ← New
}): Promise<PublicPagePayload | null>
```

**Flow**:
1. Create PreviewContext from searchParams.preview
2. Resolve tenant by host
3. Call publicPageResolution.resolvePage() with preview context
4. Call publicNavigationResolution.resolveNavigation() with preview context
5. Return consolidated payload with previewContext

**Updated PublicPagePayload**:
```typescript
export type PublicPagePayload = {
  tenant: TenantContext
  locale: string
  page: PageRecord
  blocks: BlockInstance[]
  navigation: NavigationItem[]
  seo: PublicSeoViewModel
  previewContext: PreviewContext  // ← New
}
```

### Preview Context Factory

**Location**: `packages/core/src/preview.ts`

```typescript
const previewContext = createPreviewContext({
  preview: searchParams?.preview
})

// Returns:
// { mode: "enabled" } if preview=1 or preview=true
// { mode: "disabled" } otherwise
```

### Public Preview Badge

**Location**: `apps/web/src/components/public-preview-badge.tsx`

```typescript
export function PublicPreviewBadge({ previewEnabled }: Props) {
  if (!previewEnabled) return null
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-amber-500 text-amber-950 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
        Preview Mode
      </div>
    </div>
  )
}
```

**Appearance**:
- Amber badge in top-right corner (fixed position)
- Only visible when preview enabled
- Non-intrusive but clear indication

### Public Navigation Enhanced

**Location**: `apps/web/src/components/public-navigation.tsx`

**Updated Props**:
```typescript
type Props = {
  items: PublicNavigationItemViewModel[]
  previewEnabled?: boolean  // ← New
}
```

**Link Generation**:
- Internal page links use slug-based href from runtime view model (`/{locale}/{page.slug}`)
- With preview: `{href}?preview=1`
- pageId is no longer rendered as a public URL

External links unchanged (no query params).

### Public Page View Enhanced

**Location**: `apps/web/src/components/public/PublicPageView.tsx`

**Updated Rendering**:
1. Show PublicPreviewBadge if preview enabled
2. Pass previewEnabled to PublicNavigation
3. Show "Draft" badge on page title if draft + preview
4. Render page content normally

### Public Page Route Enhanced

**Location**: `apps/web/src/app/[[...slug]]/page.tsx`

**Updated Props**:
```typescript
type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>  // ← New
}
```

**Implementation**:
1. Extract searchParams from request
2. Read runtime config for `supportedLocales` and `defaultLocale`
3. Parse locale + slug using `resolvePublicLocaleAndSlug()`
4. Pass normalized values to `loadPublicPage({ host, locale, slug, searchParams })`

### Public Blocks Visibility

**Location**: `apps/web/src/lib/load-public-page.ts`

Public rendering only returns blocks with `visibility === "visible"`.
`scheduled` handling is intentionally not part of this phase.

### Shared Visibility Helper

**Location**: `packages/runtime/src/public-visibility.ts`

`isPubliclyVisible(status, preview)` centralizes public status checks:
- `published` => visible
- `draft` => visible only in preview mode
- `archived` => never visible

## Data Flow: Publish Visibility

```
User requests: https://example.com/en/about
  ↓
Page route extracts slug="about", locale="en"
No searchParams (preview disabled)
  ↓
loadPublicPage({ host, slug, locale, searchParams: {} })
  ↓
createPreviewContext({ preview: undefined })
  → PreviewContext { mode: "disabled" }
  ↓
publicPageResolution.resolvePage({
  tenantId, locale, slug, 
  preview: { mode: "disabled" }
})
  ↓
If page.status === "published":
  → returns page
If page.status === "draft":
  → returns null (not preview)
If page.status === "archived":
  → returns null (never)
  ↓
If null → notFound()
If page → render with navigation

User requests: https://example.com/en/about?preview=1
  ↓
Page route extracts slug="about", locale="en"
searchParams: { preview: "1" }
  ↓
loadPublicPage({ host, slug, locale, searchParams: { preview: "1" } })
  ↓
createPreviewContext({ preview: "1" })
  → PreviewContext { mode: "enabled" }
  ↓
publicPageResolution.resolvePage({
  tenantId, locale, slug,
  preview: { mode: "enabled" }
})
  ↓
If page.status === "published":
  → returns page (always visible)
If page.status === "draft":
  → returns page (visible in preview)
If page.status === "archived":
  → returns null (never)
  ↓
publicNavigationResolution.resolveNavigation({
  tenantId, locale,
  preview: { mode: "enabled" }
})
  ↓
Filter items by status:
  published → included
  draft → included (preview enabled)
  archived → excluded
  ↓
Render with:
  - PublicPreviewBadge visible
  - Navigation links with ?preview=1
  - Draft badge on page title
```

## Visibility Matrix

| Content Status | Preview Disabled | Preview Enabled |
|---|---|---|
| **Published** | ✅ Visible | ✅ Visible |
| **Draft** | ❌ Hidden | ✅ Visible |
| **Archived** | ❌ Hidden | ❌ Hidden |

## Query Parameter Formats

Supported preview query parameters:
- `?preview=1`
- `?preview=true`
- `?preview=yes` (treats as string, becomes disabled)

Only `1` or `true` enable preview mode.

## Security Considerations

**This phase is NOT production-secure**:
- Query parameter is visible in URL
- No authentication required
- Anyone can access preview mode
- Not rate-limited
- No audit logging

**Phase 36+ will add**:
- Preview tokens
- Auth-based preview access
- Preview sessions
- Audit logging
- Rate limiting

**Current use**: Demo/staging only.

## Known Limitations (Intentional)

- ❌ No authentication/authorization
- ❌ No preview tokens
- ❌ No preview sessions
- ❌ No share links
- ❌ No cookies
- ❌ No middleware
- ❌ No rate limiting
- ❌ No audit logging
- ❌ No caching layer
- ❌ No ISR/revalidation

All Phase 36+ features.

## Type Safety

- `PreviewContext` is strict typed
- `PreviewMode` is literal union type
- `createPreviewContext` handles null/undefined safely
- No Record<string, unknown> for preview models

## Testing Scenarios

1. **Published page, no preview**: Page visible
2. **Draft page, no preview**: notFound()
3. **Archived page, no preview**: notFound()
4. **Published page, preview=1**: Page visible + badge
5. **Draft page, preview=1**: Page visible + badge + draft indicator
6. **Archived page, preview=1**: notFound() (never visible)
7. **Navigation without preview**: Only published items
8. **Navigation with preview=1**: Published + draft items
9. **Navigation links maintain preview**: ?preview=1 persisted in href
10. **External nav links unchanged**: No query params added

## Demo Data Setup

InMemory database should include:
- German home: published
- English home: draft
- Additional published page
- Additional draft page

Users can test:
```
/de/home → visible (published)
/en/home → not found (draft, no preview)
/en/home?preview=1 → visible (draft, preview enabled)
```

## File Summary

| File | Purpose |
|------|---------|
| `packages/core/src/preview.ts` | PreviewContext type, createPreviewContext factory |
| `packages/core/src/index.ts` | Export preview types and factory |
| `packages/runtime/src/public-page-resolution.ts` | Visibility rules for pages |
| `packages/runtime/src/public-navigation-resolution.ts` | Visibility rules for navigation |
| `apps/web/src/lib/load-public-page.ts` | Preview context creation, loader integration |
| `apps/web/src/components/public-preview-badge.tsx` | Preview mode indicator |
| `apps/web/src/components/public-navigation.tsx` | Preview query param preservation |
| `apps/web/src/components/public/PublicPageView.tsx` | Preview badge + draft indicator rendering |
| `apps/web/src/app/[[...slug]]/page.tsx` | Search params passthrough |

## Summary

Phase 35 establishes:

- ✅ Published-by-default visibility
- ✅ Draft preview via query parameter
- ✅ Archived content never visible
- ✅ PreviewContext and factory
- ✅ Preview visibility rules in resolutions
- ✅ Preview badge UI
- ✅ Preview query propagation in navigation
- ✅ Draft status indicators
- ✅ No authentication/tokens
- ✅ No middleware or cookies
- ✅ Type-safe preview models

**Public default**: Published content only
**Preview access**: Simple query parameter (?preview=1)
**Visibility matrix**: Clear status-based rules

**Ready for Phase 36**: Auth-based preview, preview tokens, preview sessions, audit logging.
