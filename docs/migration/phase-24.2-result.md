# Phase 24.2 Result – Locale-aware Page Count Clarification

**Status**: ✅ Complete  
**Date**: May 7, 2026  
**Branch**: main

## Summary

Phase 24.2 clarifies the admin UX around locale-aware pages by distinguishing between:
- **Active Locale Pages**: Pages in the currently selected locale
- **Page Variants**: All (slug, locale) combinations for the tenant
- **Logical Pages**: Unique slugs across all locales

No data model changes, no persistence changes – only UI clarity and count calculations.

## Problem Statement

Multiple page records can exist for the same slug in different locales:
```
home/de → published
home/en → draft
```

The admin pages list only shows the active locale (e.g., de), making it appear there's only one page, when actually multiple locale variants exist. This confusion arises because:
1. Users see "1 page" in German
2. Switch to English and see "1 page" there too
3. Unsure if they're duplicates or separate records
4. Don't understand the relationship

## Solution

### 1. Loader Enhancement

**File**: `apps/admin/src/lib/load-admin-pages.ts`

Now returns additional counts:
```typescript
{
  pages: CmsPage[]              // Filtered to active locale
  activeLocalePagesCount: number // pages.length
  pageVariantsCount: number      // All (slug, locale) records
  logicalPagesCount: number      // Unique slugs across locales
  // ... other fields
}
```

Implementation:
```typescript
// Load pages for active locale
const pages = await runtime.db.pages.listByTenant({
  tenantId: tenant.tenantId,
  locale: activeLocale,
})

// Load all locale variants
const allLocalePages = await runtime.db.pages.listByTenant({
  tenantId: tenant.tenantId,
  // No locale filter = all locales
})

// Calculate counts
const activeLocalePagesCount = pages.length
const pageVariantsCount = allLocalePages.length
const uniqueSlugs = new Set(allLocalePages.map(p => p.slug))
const logicalPagesCount = uniqueSlugs.size
```

### 2. Dashboard Metrics

**File**: `apps/admin/src/app/(admin)/dashboard/page.tsx`

Before:
```
Tenant ID | Pages | Blocks | Database
demo      | 1     | 2      | memory
```

After:
```
Tenant ID | Pages (Current Locale) | Page Variants | Logical Pages | Blocks | Database
demo      | 1                       | 2             | 1             | 2      | memory
```

Each card has descriptive labels:
- **Pages (Current Locale)**: "Pages in de locale"
- **Page Variants**: "All locale-specific records"
- **Logical Pages**: "Unique slugs across locales"

### 3. Pages List Header

**File**: `apps/admin/src/app/(admin)/pages/page.tsx`

Added info section after locale switcher:
```
Showing pages for locale: de
Total variants: 2
Logical pages: 1
```

Helps user understand:
- What locale they're viewing
- How many variants exist for these pages
- The scope of what they're managing

### 4. Empty State Clarification

**Before**:
```
No pages for this locale (de)
```

**After**:
```
No pages for locale de
Other locale variants may exist. Use locale switcher above to view them.
```

Explains that empty state doesn't mean no pages exist – just none for this specific locale.

### 5. Documentation Update

**File**: `docs/architecture/locale-aware-content-model.md`

Added section: "Page Variants and Counts (Phase 24.2)"

Explains:
- Page record uniqueness: `(tenantId, slug, locale)`
- Terminology: Logical Page vs Page Variant
- Count definitions with examples
- Why lists are filtered per locale
- UI display changes

## Validation

✅ **TypeScript**: `npm run typecheck` → EXIT 0  
✅ **Build**: `npm run build` → EXIT 0  
✅ **ESLint**: `npm run lint` → EXIT 0  
✅ **No Breaking Changes**: All features work  

## File Changes Summary

| File | Type | Change |
|------|------|--------|
| `apps/admin/src/lib/load-admin-pages.ts` | Updated | Added count fields |
| `apps/admin/src/app/(admin)/dashboard/page.tsx` | Updated | New metric cards |
| `apps/admin/src/app/(admin)/pages/page.tsx` | Updated | Counts + descriptions |
| `docs/architecture/locale-aware-content-model.md` | Updated | Phase 24.2 section |

## Data Structures

### Load Response
```typescript
interface LoadAdminPagesResult {
  tenant: AdminTenantContext
  runtimeConfig: RuntimeConfig
  pages: CmsPage[]                  // Active locale only
  localeContext: LocaleContext
  activeLocale: string
  activeLocalePagesCount: number    // NEW
  pageVariantsCount: number         // NEW
  logicalPagesCount: number         // NEW
  error?: boolean
}
```

All fields are serializable (no Runtime objects).

## UI Flow

### User switches locale: /pages?locale=de
```
loadAdminPages(locale=de) called
  ↓
pages = [home/de] → activeLocalePagesCount = 1
allPages = [home/de, home/en] → pageVariantsCount = 2
slugs = {home} → logicalPageCount = 1
  ↓
Display:
  "Showing pages for locale: de"
  "Total variants: 2"
  "Logical pages: 1"
  [table with home/de record]
```

### User switches locale: /pages?locale=en
```
loadAdminPages(locale=en) called
  ↓
pages = [home/en] → activeLocalePagesCount = 1
allPages = [home/de, home/en] → pageVariantsCount = 2
slugs = {home} → logicalPageCount = 1
  ↓
Display:
  "Showing pages for locale: en"
  "Total variants: 2"
  "Logical pages: 1"
  [table with home/en record]
```

## What Stayed the Same

- ❌ Page data model: Unchanged
- ❌ Database schema: No migration
- ❌ Slug handling: Identical behavior
- ❌ Block association: No changes
- ❌ Persistence: Still mock/InMemory
- ❌ Routing: No middleware changes
- ❌ API: No REST endpoints

## What Changed

- ✅ Loader returns additional counts
- ✅ Dashboard displays 3 metrics instead of 1
- ✅ Pages list shows context info
- ✅ Empty state mentions other locales
- ✅ Documentation explains the model

## Known Limitations (Intentional)

- ❌ **No grouped view**: Pages list still per-locale
- ❌ **No translation matrix**: Can't compare side-by-side
- ❌ **No bulk copy**: Can't duplicate from one locale to another
- ❌ **No auto-detect**: Pages must be created per locale manually
- ❌ **No filtering**: Can't hide archived by default

All can be added in future phases.

## Example Scenario

**Tenant: demo**
```
Pages exist:
- home/de (status: published)
- home/en (status: draft)
- about/de (status: published)
```

**Admin viewing in DE**:
```
Dashboard shows:
  Pages (Current Locale): 2
  Page Variants: 3
  Logical Pages: 2

Pages list header:
  Showing pages for locale: de
  Total variants: 3
  Logical pages: 2

Table displays:
  [home / de / Published]
  [about / de / Published]
```

**Admin switches to EN**:
```
Dashboard shows:
  Pages (Current Locale): 1
  Page Variants: 3        ← Same!
  Logical Pages: 2        ← Same!

Pages list header:
  Showing pages for locale: en
  Total variants: 3       ← Same!
  Logical pages: 2        ← Same!

Table displays:
  [home / en / Draft]
```

The variant and logical counts never change – they're constant facts about the tenant. Only the "Current Locale" count changes.

## Summary

Phase 24.2 successfully:
- ✅ Clarifies the distinction between locale filtering and global counts
- ✅ Adds activeLocalePagesCount, pageVariantsCount, logicalPagesCount
- ✅ Updates dashboard with 3 clear metrics
- ✅ Enhances pages list with context info
- ✅ Improves empty state messaging
- ✅ Documents the locale-aware data model
- ✅ Requires no data model, persistence, or routing changes

Users now understand:
- What they're viewing (current locale)
- How many variants exist (total)
- How many distinct pages they're managing (logical)
- Why the list changes when switching locales (per-locale filtering)

---

**Ready for Phase 25: Publish & Archive Operations** ✅
