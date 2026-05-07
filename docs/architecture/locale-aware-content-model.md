# Locale-Aware Content Model

## Overview

Phase 20 prepares the content model for multi-language support by introducing locale awareness throughout the CMS, without implementing actual i18n routing, next-intl, or persistence layer changes.

The key concept: **Content is inherently locale-aware**, not retrofitted with translation maps.

## Content Model

### CmsPage Structure

```typescript
type CmsPage = {
  id: string
  tenantId: TenantId        // Which tenant owns this page
  slug: string              // URL-safe identifier
  locale: Locale            // ISO 639-1 code (e.g., "de", "en")
  title: string             // Page title in this locale
  status: CmsPageStatus     // "draft" | "published" | "archived"
  seo?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}
```

### Unique Constraint

Each page is uniquely identified by:
```
(tenantId, locale, slug)
```

**Example**:
- `(demo, de, home)` → German homepage
- `(demo, en, home)` → English homepage
- Same slug, different locales = separate pages

### Block Association

Blocks are attached to pages via `pageId`:

```typescript
type CmsBlock = {
  id: string
  pageId: string            // FK to CmsPage
  tenantId: string          // Denormalized for safety
  type: string
  sortOrder: number
  props: Record<string, unknown>
  visibility: CmsBlockVisibility
  createdAt: string
  updatedAt: string
}
```

**Important**: Blocks are NOT shared across locales. Each page has its own block set.

## Locale Types

### LocaleCode

```typescript
export type LocaleCode = string // "de", "en", "pl", etc.
```

### SupportedLocale

```typescript
export type SupportedLocale = {
  code: LocaleCode
  label: string             // "Deutsch", "English"
  default?: boolean         // Mark as fallback locale
}
```

### LocaleContext

```typescript
export type LocaleContext = {
  locale: LocaleCode                  // Current active locale
  supportedLocales: SupportedLocale[] // All available locales
  defaultLocale: LocaleCode           // Fallback if none specified
}
```

## Runtime Configuration

### Config Keys

```
DEFAULT_LOCALE=de
SUPPORTED_LOCALES=de,en,pl
```

### RuntimeConfig Enhancement

```typescript
export type RuntimeConfig = {
  appEnv: "local" | "development" | "staging" | "production"
  databaseAdapter: DatabaseAdapterKind
  storageAdapter: StorageAdapterKind
  authAdapter: AuthAdapterKind
  defaultLocale: string
  supportedLocales: string[]
}
```

### Validation

- `defaultLocale` must be in `supportedLocales`
- Empty locale codes are rejected
- Comma-separated parsing is robust (trims whitespace)

## Content Structure (Multi-Locale)

### Example Dataset

**German Content**:
```
Tenant: demo
  └─ Page (home, de) [Startseite]
     ├─ Block (hero) [headline: "SovereignCMS"]
     └─ Block (text) [body: "Diese Seite..."]
```

**English Content**:
```
Tenant: demo
  └─ Page (home, en) [Home]
     ├─ Block (hero) [headline: "SovereignCMS"]
     └─ Block (text) [body: "This page..."]
```

**Separate pages**, not translations.

## Design Decisions

### 1. Why Not Translation Maps?

Translation maps map source content to target locales:
- ❌ Couples locales tightly
- ❌ Hard to maintain different structures per locale
- ❌ Requires sync strategy (what if one locale diverges?)

Our approach:
- ✅ Each locale is autonomous
- ✅ Can have different block structures
- ✅ No dependency chain

### 2. Why Not next-intl?

next-intl is for routing and UI translation, not content modeling:
- ❌ Adds Next.js-specific abstraction
- ❌ Routing is tightly coupled to translation
- ❌ Later multi-locale query logic would fight the framework

Our approach:
- ✅ Content model is framework-agnostic
- ✅ Runtime just loads by locale param
- ✅ Easy to switch rendering later

### 3. Why No Persist in Phase 20?

- No API changes needed
- No schema migration required
- Admin UI can already filter/display by locale
- Persistence layer (Phase 11+) just passes locale to DB
- Future multi-locale create/delete handled by editors

## Admin Interface Updates

### Pages List

**Shows**:
- Title, Slug, Locale, Status, Updated
- Current active locale (badge)
- Supported locales (display-only)

**No switcher yet** – Future phase.

### Page Detail

**Shows**:
- Page slug and locale
- Supported locales list
- Block editor (for this locale's blocks)

**No locale selection** – Editor works on current locale.

## Database Adapter Interface

### PageRepository

```typescript
interface PageRepository {
  findBySlug(input: {
    tenantId: string
    slug: string
    locale: string
  }): Promise<CmsPage | null>

  listByTenant(input: {
    tenantId: string
    locale?: string  // Optional filter
  }): Promise<CmsPage[]>
}
```

### In-Memory Adapter

Includes demo data:
- German home: `/en/home` → English page
- English home: `/de/home` → German page

Both with appropriate blocks (hero + text).

## Loaders Enhanced

### loadAdminPages()

```typescript
async function loadAdminPages(input?: {
  host?: string
  locale?: string
}): Promise<{
  tenant: ...
  runtimeConfig: RuntimeConfig
  pages: CmsPage[]
  locale: string                 // Current active locale
  supportedLocales: string[]     // Available locales
  error?: boolean
}>
```

**Behavior**:
- Uses `input.locale` if provided
- Falls back to `runtime.config.defaultLocale`
- Always returns `locale` and `supportedLocales`

### loadAdminPageDetail()

```typescript
async function loadAdminPageDetail(input: {
  host?: string
  slug: string
  locale?: string
}): Promise<{
  tenant: ...
  runtimeConfig: RuntimeConfig
  page: CmsPage | null
  blocks: CmsBlock[]
  locale: string
  supportedLocales: string[]
  error?: boolean
  notFound?: boolean
}>
```

## Routing Notes (NOT changed in Phase 20)

Current routing is **NOT locale-aware**:
- `/pages` → shows default locale pages
- `/pages/home` → shows default locale page

**Future phases** may add:
- `/de/pages` → filter by locale
- Query params: `/pages?locale=de`
- Route param: `/pages/[slug]/[locale]`

**For now**: Locale is implicit (defaultLocale).

## Content Querying Logic

### Single Page by Slug

```typescript
const page = await db.pages.findBySlug({
  tenantId: "demo",
  locale: "de",
  slug: "home"
})
// Returns German page with slug "home"
```

### All Pages for Tenant & Locale

```typescript
const pages = await db.pages.listByTenant({
  tenantId: "demo",
  locale: "de"
})
// Returns all German pages
```

### All Pages for Tenant (All Locales)

```typescript
const pages = await db.pages.listByTenant({
  tenantId: "demo"
  // locale undefined
})
// Returns all pages regardless of locale
```

## Future Enhancements

### Phase 21: Multi-Locale Admin UI
- Locale switcher in sidebar
- Query params or route params for locale selection
- Filtering by locale in page list

### Phase 22: Multi-Locale Content Creation
- Create page UI with locale selector
- Copy page to other locale (optional)
- Duplicate detection

### Phase 23: Multi-Locale Persistence
- Save operations respect current locale
- Block persistence per-locale-page
- Validation of unique (tenant, locale, slug)

### Phase 24: Public Multi-Locale Routing
- Implement next-intl or custom routing
- `/de/page`, `/en/page`
- Fallback chain: requested locale → default locale

## Constraints (Phase 20)

- ❌ No next-intl integration
- ❌ No locale routing yet
- ❌ No locale create/delete UI
- ❌ No persistence changes (mocked still)
- ❌ No block content translation
- ❌ No SEO locale handling yet

All of these are additive – no backwards compatibility issues.

## File Locations

| File | Purpose |
|------|---------|
| `packages/core/src/locale.ts` | Locale type definitions |
| `packages/runtime/src/config.ts` | Locale config loading |
| `packages/db/src/in-memory-adapter.ts` | Demo multi-locale data |
| `apps/admin/src/lib/load-admin-pages.ts` | Pages loader with locale + counts |
| `apps/admin/src/lib/load-admin-page-detail.ts` | Page detail loader with locale |
| `apps/admin/src/app/(admin)/pages/page.tsx` | Pages list UI (shows locale) |
| `apps/admin/src/app/(admin)/pages/[slug]/page.tsx` | Page detail UI (shows locale) |
| `.env.example` | Locale config template |

## Page Variants and Counts (Phase 24.2)

### Page Record Uniqueness

Each page is uniquely identified by `(tenantId, slug, locale)`:
- **Same slug, different locales** = different page records
- **Same locale, different tenants** = different page records
- No "shared" pages across locales

**Example**:
```
demo/home/de → Page Record 1 (German)
demo/home/en → Page Record 2 (English)
```

### Terminology

| Term | Meaning | Example |
|------|---------|---------|
| **Logical Page** | Unique slug (concept) | "home" |
| **Page Variant** | Specific (slug, locale) record | "home/de" or "home/en" |
| **Page Record** | Persisted row in database | PageID, blocks, status |

### Counts

The admin interface now distinguishes:

#### activeLocalePagesCount
- Pages available for **current active locale**
- When user is viewing locale=de, counts pages where locale=de
- Reset when locale switcher changes

#### pageVariantsCount
- Total number of (slug, locale) records for the tenant
- Remains constant regardless of active locale
- Helps user understand "how many total page variants exist"

#### logicalPagesCount
- Count of unique slugs across all locales
- Example: If slugs are [home/de, home/en, about/de, about/en] → logicalPageCount=2
- Helps user understand "how many distinct pages I'm managing"

### Admin List Filtering

The pages list is **always filtered to active locale**:
- URL: `/admin/pages?locale=de`
- Displays: Only pages where locale="de"
- Other locales: Accessible via locale switcher

**Why not show all locales in one table?**
1. Clearer mental model: "I'm editing German pages now"
2. Simpler block editing: One locale context at a time
3. Smaller tables: Better for performance
4. Foundation for future locale-specific workflows

### UI Display

#### Dashboard
Before:
```
Pages: 1
```

After:
```
Pages (Current Locale): 1
Page Variants: 2
Logical Pages: 1
```

#### Pages List Header
Before:
```
Title | Slug | Locale | Status
```

After:
```
Showing pages for locale: de
Total variants: 2
Logical pages: 1

Title | Slug | Locale | Status
```

#### Empty State
Before:
```
No pages for this locale
```

After:
```
No pages for locale de
Other locale variants may exist. Use locale switcher above to view them.
```

## TypeScript Safety

All locale operations are fully typed:
- `LocaleCode` prevents typos
- `SupportedLocale[]` guarantees shape
- Query functions type-check locale param
- Invalid configs throw at load time

## Testing Scenarios

1. **Load German pages** → `loadAdminPages({ locale: "de" })`
2. **Load English home page** → `loadAdminPageDetail({ slug: "home", locale: "en" })`
3. **List all pages** → `loadAdminPages()` uses default locale
4. **Invalid locale** → Graceful: still loads, uses default
5. **Config validation** → Errors if default not in supported list
