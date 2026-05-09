# Public Rendering Foundation (Phase 34)

## Overview

Phase 34 introduces structured **public page rendering** that leverages the multi-tenant platform infrastructure: pages, navigation, media, and SEO metadata.

The public app now:
- Resolves pages using the Runtime
- Renders navigation items with locale awareness
- Displays hero media assets
- Maps SEO metadata to viewable form
- Filters archived content from public view
- Keeps draft content visible (for demo purposes)

No Metadata API, ISR, image optimization, CDN, or complex internationalization yet.

## Architecture

### Public Page Resolution

**Location**: `packages/runtime/src/public-page-resolution.ts`

```typescript
export function createPublicPageResolution(input: { db: DatabaseAdapter }) {
  return {
    async resolvePage(params: ResolvePublicPageInput): Promise<CmsPage | null> {
      // Find page by tenant, locale, slug
      // Exclude archived pages
      // Return page or null
    },
  }
}
```

**Behavior**:
- Queries by tenantId, locale, slug
- Returns null if not found
- Excludes archived pages (status: "archived")
- Permits published and draft pages (published/draft visible for now)

### Public Navigation Resolution

**Location**: `packages/runtime/src/public-navigation-resolution.ts`

```typescript
export function createPublicNavigationResolution(input: { db: DatabaseAdapter }) {
  return {
    async resolveNavigation(params: {
      tenantId: string
      locale: string
    }): Promise<NavigationItem[]> {
      // Load navigation items for tenant + locale
      // Exclude archived items
      // Return flat list (no nesting)
    },
  }
}
```

**Behavior**:
- Queries by tenantId and locale
- Filters out archived items
- Returns flat list (no nested navigation structure)
- Ordered by sortOrder

### SEO Metadata Mapping

**Location**: `packages/runtime/src/public-seo-mapping.ts`

```typescript
export type PublicSeoViewModel = {
  title: string
  description: string
  canonicalUrl: string
  robotsIndex: boolean
  imageUrl: string
}

export function mapSeoMetadataToPublicViewModel(
  seo: SeoMetadata | null | undefined
): PublicSeoViewModel {
  // Map CMS SEO fields to public viewmodel
  // Handle null/undefined gracefully
  // Trim whitespace
}
```

**Purpose**:
- Bridges admin SeoMetadata type to public rendering
- No Metadata API integration (yet)
- Purely structural mapping

### Runtime Extension

**Location**: `packages/runtime/src/runtime.ts`

SovereignRuntime now includes:

```typescript
export type SovereignRuntime = {
  // ... existing properties
  publicPageResolution: ReturnType<typeof createPublicPageResolution>
  publicNavigationResolution: ReturnType<typeof createPublicNavigationResolution>
}
```

Created during `createRuntime()`:

```typescript
const publicPageResolution = createPublicPageResolution({ db })
const publicNavigationResolution = createPublicNavigationResolution({ db })
```

### Public Page Loader

**Location**: `apps/web/src/lib/load-public-page.ts`

```typescript
export type PublicPagePayload = {
  tenant: TenantContext
  locale: string
  page: PageRecord
  blocks: BlockInstance[]
  navigation: NavigationItem[]
  seo: PublicSeoViewModel
}

export async function loadPublicPage(input: {
  host: string
  slug: string
  locale: string
}): Promise<PublicPagePayload | null> {
  // Resolve tenant by host
  // Resolve page via publicPageResolution
  // Load blocks by page
  // Resolve navigation via publicNavigationResolution
  // Map SEO to viewmodel
  // Return consolidated payload or null
}
```

**Flow**:
1. Resolve tenant from host header
2. Use publicPageResolution to find page (null → return null)
3. Load blocks by page ID
4. Load navigation items
5. Map SEO metadata
6. Return serializable payload

### Public Navigation Component

**Location**: `apps/web/src/components/public-navigation.tsx`

```typescript
export function PublicNavigation({ items, locale }: Props) {
  // Render flat navigation list
  // Page items → href="/{locale}/{slug}"
  // External items → href=item.href, target="_blank"
  // Simple horizontal layout
  // No Admin UI primitives
}
```

**Features**:
- Locale-aware page links
- External link support
- No nested menus
- Simple horizontal layout
- Separate from admin navigation styling

### Public Block Rendering

**Location**: `apps/web/src/components/public/PublicBlockRenderer.tsx`

**Hero Block Extended**:
- Renders mediaUrl as image if present
- Uses mediaAlt or headline as fallback alt text
- Image positioned above headline/subline
- No image optimization (yet)

```typescript
case "hero": {
  const mediaUrl = block.props.mediaUrl
  if (mediaUrl) {
    // Render img tag with alt
  }
  // Render headline and subline
}
```

### Public Page View

**Location**: `apps/web/src/components/public/PublicPageView.tsx`

**Extended Props**:
- `navigation` — NavigationItem[]
- `locale` — string
- `seo` — PublicSeoViewModel

**Rendering**:
1. PublicNavigation at top
2. Page article with seo.description
3. Block list below

**No changes**:
- No generateMetadata()
- No Metadata API
- No layout modifications

### Public Page Route

**Location**: `apps/web/src/app/[[...slug]]/page.tsx`

**Current behavior**:
- Uses loadPublicPage() for consolidated loading
- Extracts slug from URL segments
- Hard-coded locale: "de" (simplified for now)
- Returns notFound() if page not resolved

**No changes**:
- No locale detection middleware
- No next-intl integration
- No preview mode
- No ISR/revalidation

## Data Flow: Public Page Rendering

```
User requests: https://example.com/en/about
  ↓
Page route extracts slug="about", locale="de" (currently hardcoded)
  ↓
loadPublicPage({ host, slug, locale })
  ↓
Resolve tenant by host
  ↓
publicPageResolution.resolvePage({ tenantId, locale, slug })
  ↓
Page found (not archived) → returns CmsPage with seo
  ↓
Load blocks by page.id
  ↓
publicNavigationResolution.resolveNavigation({ tenantId, locale })
  ↓
Navigation items loaded (non-archived)
  ↓
mapSeoMetadataToPublicViewModel(page.seo)
  ↓
Return PublicPagePayload
  ↓
PublicPageView renders:
  - PublicNavigation
  - Page title + seo.description
  - Blocks (including hero with media)
```

## Archived Content Handling

- **Archived pages**: Return notFound()
- **Archived navigation items**: Filtered from resolveNavigation()
- **Logic**: status: "archived" → invisible

## Draft Content Handling

- **Draft pages**: Currently visible (status: "draft" allowed)
- **Draft navigation items**: Currently visible
- **Rationale**: Phase 34 demo mode; publish gating deferred to Phase 35+

## Known Limitations (Intentional)

- ❌ No `generateMetadata()` integration
- ❌ No Metadata API (next/head)
- ❌ No OG tags
- ❌ No Twitter cards
- ❌ No robots.txt generation
- ❌ No sitemap generation
- ❌ No Search Console integration
- ❌ No ISR/revalidation
- ❌ No image optimization
- ❌ No CDN integration
- ❌ No multi-tenant domain routing (yet)
- ❌ No next-intl integration
- ❌ No auth/preview mode
- ❌ No publish gating

All Phase 35+ features.

## Type Safety

- `PublicSeoViewModel` is typed struct (not Record<string, unknown>)
- `PublicPagePayload` fully typed
- No Runtime objects leak to client components
- All resolution functions typed

## Testing Scenarios

1. **Resolve published page**: Page loads with blocks, nav, SEO
2. **Resolve draft page**: Page loads (draft currently visible)
3. **Archived page**: notFound() returned
4. **Missing page**: notFound() returned
5. **Navigation rendering**: Flat list, no nesting
6. **Hero with media**: Image renders if mediaUrl present
7. **SEO mapping**: Non-empty viewmodel available
8. **Locale parameter**: Currently hardcoded "de" (simplification)

## Future Integration (Phase 35+)

### Metadata API Integration

```typescript
// apps/web/src/app/[[...slug]]/page.tsx
export async function generateMetadata({ params }) {
  const data = await loadPublicPage(...)
  
  return {
    title: data.seo.title,
    description: data.seo.description,
    openGraph: {
      image: data.seo.imageUrl,
      url: data.seo.canonicalUrl,
    },
  }
}
```

### Publish Gating

```typescript
// In public-page-resolution
filter((page) => page.status === "published")
```

### Multi-Tenant Domain Routing

```typescript
// In page route: extract from subdomain or path
const locale = detectLocaleFromRoute(params)
const data = await loadPublicPage({ host, slug, locale })
```

### ISR / Revalidation

```typescript
export const revalidate = 60 // seconds
```

### Image Optimization

```typescript
// Replace img with next/image
<Image
  src={mediaUrl}
  alt={mediaAlt}
  width={800}
  height={600}
/>
```

## File Summary

| File | Purpose |
|------|---------|
| `packages/runtime/src/public-page-resolution.ts` | Resolve pages by tenant/locale/slug, exclude archived |
| `packages/runtime/src/public-navigation-resolution.ts` | Resolve navigation items by tenant/locale, flat list |
| `packages/runtime/src/public-seo-mapping.ts` | Map SeoMetadata → PublicSeoViewModel |
| `packages/runtime/src/runtime.ts` | SovereignRuntime extended with public resolutions |
| `packages/runtime/src/index.ts` | Export public resolution utilities |
| `apps/web/src/lib/load-public-page.ts` | Consolidated public page loader |
| `apps/web/src/components/public-navigation.tsx` | Public navigation component |
| `apps/web/src/components/public/PublicBlockRenderer.tsx` | Extended with hero media rendering |
| `apps/web/src/components/public/PublicPageView.tsx` | Extended with nav, locale, SEO |
| `apps/web/src/app/[[...slug]]/page.tsx` | Public route using loadPublicPage |

## Summary

Phase 34 establishes:

- ✅ Public page resolution via Runtime
- ✅ Public navigation resolution via Runtime
- ✅ SEO metadata mapping layer
- ✅ Consolidated public page loader
- ✅ Public navigation component
- ✅ Hero media rendering in public
- ✅ Archived content filtering
- ✅ Locale-aware page/navigation loading
- ✅ Separate public UI from admin UI
- ✅ Type-safe public viewmodels
- ✅ No Runtime objects to client
- ✅ No Metadata API integration

**Admin workflow**: Edit pages, add blocks, set navigation, configure SEO
**Public workflow**: View pages, navigate, see hero media, see metadata preview

**Ready for Phase 35**: Metadata API integration, publish gating, ISR/revalidation.
