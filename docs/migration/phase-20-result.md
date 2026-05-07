# Phase 20 Result – Locale-Aware Page Model Preparation

**Status**: ✅ Complete  
**Date**: May 7, 2026  
**Branch**: main

## Summary

Phase 20 introduces **locale awareness** throughout the CMS content model without implementing routing changes, next-intl, or persistence layer modifications. Pages are now inherently multi-locale, with proper type definitions and runtime configuration.

## Changes

### 1. Locale Type Definitions

#### New File: `packages/core/src/locale.ts`

```typescript
export type LocaleCode = string
export type SupportedLocale = {
  code: LocaleCode
  label: string
  default?: boolean
}
export type LocaleContext = {
  locale: LocaleCode
  supportedLocales: SupportedLocale[]
  defaultLocale: LocaleCode
}
```

**Exported from**: `packages/core/src/index.ts`

### 2. RuntimeConfig Enhanced

#### File: `packages/runtime/src/config.ts`

**Added fields**:
- `defaultLocale: string`
- `supportedLocales: string[]`

**Config parsing**:
- `DEFAULT_LOCALE=de` → default locale
- `SUPPORTED_LOCALES=de,en,pl` → comma-separated list
- Validation: `defaultLocale` must be in `supportedLocales`
- Robust: Trims whitespace, filters empty codes

### 3. Environment Configuration

#### File: `.env.example`

**Added**:
```
DEFAULT_LOCALE=de
SUPPORTED_LOCALES=de,en
```

### 4. In-Memory Adapter Enhanced

#### File: `packages/db/src/in-memory-adapter.ts`

**Demo data**:
- German home page (`locale: "de"`, `title: "Startseite"`)
- English home page (`locale: "en"`, `title: "Home"`)
- Each has separate blocks (hero + text) in respective languages
- Proper blocksByPageId mapping for both

### 5. Admin Loaders Extended

#### File: `apps/admin/src/lib/load-admin-pages.ts`

**Changes**:
- Optional `locale?: string` parameter
- Falls back to `runtime.config.defaultLocale`
- Returns `locale` and `supportedLocales` in response
- Uses `runtime.db.pages.listByTenant({ tenantId, locale })`

#### File: `apps/admin/src/lib/load-admin-page-detail.ts`

**Changes**:
- Optional `locale?: string` parameter
- Falls back to `runtime.config.defaultLocale`
- Returns `locale` and `supportedLocales` in response
- Loads page via `findBySlug(tenantId, locale, slug)`

### 6. Admin UI Updates

#### File: `apps/admin/src/app/(admin)/pages/page.tsx`

**New**:
- Locale info card showing:
  - Current active locale (badge)
  - All supported locales (display list)
- Passes `locale` and `supportedLocales` to page

#### File: `apps/admin/src/app/(admin)/pages/[slug]/page.tsx`

**New**:
- Shows locale in page header metadata
- Displays supported locales list
- Passes `locale` and `supportedLocales` to editor

## Data Structure

### Unique Content Constraints

Content uniquely identified by:
```
(tenantId, locale, slug)
```

**Examples**:
- `(demo, de, home)` = German home
- `(demo, en, home)` = English home
- Same slug, different locales = different pages

### Blocks

Blocks are **per-page** (not shared across locales):
- German home page has German blocks
- English home page has English blocks
- No cross-locale references

## Integration

### PageRepository Interface

```typescript
interface PageRepository {
  findBySlug(input: {
    tenantId: string
    slug: string
    locale: string
  }): Promise<CmsPage | null>

  listByTenant(input: {
    tenantId: string
    locale?: string
  }): Promise<CmsPage[]>
}
```

### In-Memory Implementation

Already supports locale filtering:
- `listByTenant({ tenantId: "demo", locale: "de" })`
- `findBySlug({ tenantId: "demo", locale: "en", slug: "home" })`

## Admin UI Behavior

### Pages List
- Shows current locale (de by default)
- Displays all supported locales
- Lists pages for current locale only
- **No locale switcher** (future phase)

### Page Detail
- Shows locale metadata
- Lists supported locales
- Edits blocks for current locale only
- **No locale switcher** (future phase)

## What's NOT Included (Intentional)

- ❌ **Locale Routing**: `/de/pages`, `/en/pages` not implemented
- ❌ **next-intl**: No framework integration yet
- ❌ **Locale Switcher UI**: Display-only for now
- ❌ **Multi-Locale Create**: Can't create pages in other locales from UI
- ❌ **Content Translation**: No copy/sync between locales
- ❌ **Persistence Changes**: Still mocked; DB layer unchanged
- ❌ **SEO Locale Hints**: No hreflang or locale metadata yet

All future phases – no breaking changes required.

## Why This Approach?

### Content Model Over i18n Framework

- ✅ Framework-agnostic: Works with any router
- ✅ Each locale is autonomous: No translation deps
- ✅ Clean separation: Content + localization
- ✅ Extensible: Easy to add variants later

### No Translation Maps

- ✅ Simpler mental model
- ✅ Scales better: 10k pages × 5 locales = 50k page records (not a map)
- ✅ Preserves structure: Different block counts OK
- ✅ No sync headaches

### No next-intl Yet

- ✅ Content model complete without routing layer
- ✅ Can add next-intl later without refactoring
- ✅ Tests routing independently from content
- ✅ Clearer separation of concerns

## Validation

✅ **TypeScript**: `npm run typecheck` → EXIT 0  
✅ **Build**: `npm run build` → EXIT 0  
✅ **ESLint**: `npm run lint` → EXIT 0  
✅ **No Breaking Changes**: Existing features unaffected  

## File Changes Summary

| File | Type | Change | Focus |
|------|------|--------|-------|
| `packages/core/src/locale.ts` | New | Locale types | Core |
| `packages/core/src/index.ts` | Updated | Export locale types | Core |
| `packages/runtime/src/config.ts` | Updated | Locale config | Runtime |
| `.env.example` | Updated | Env template | Config |
| `packages/db/src/in-memory-adapter.ts` | Updated | Demo de/en pages | DB |
| `apps/admin/src/lib/load-admin-pages.ts` | Updated | Locale param + return | Admin |
| `apps/admin/src/lib/load-admin-page-detail.ts` | Updated | Locale param + return | Admin |
| `apps/admin/src/app/(admin)/pages/page.tsx` | Updated | Locale UI | Admin |
| `apps/admin/src/app/(admin)/pages/[slug]/page.tsx` | Updated | Locale UI | Admin |
| `docs/architecture/locale-aware-content-model.md` | New | Architecture doc | Docs |

## Demo Data

### In-Memory Adapter Now Serves

**German** (de):
- Page: home → "Startseite"
- Blocks: hero (SovereignCMS / Mandanten-Laufzeit) + text (German description)

**English** (en):
- Page: home → "Home"
- Blocks: hero (SovereignCMS / Multi-tenant Runtime) + text (English description)

### Access Pattern

```
GET /admin/pages → loads default locale (de)
GET /admin/pages/home → loads de/home page
```

Future: `/admin/pages?locale=en` for different locale.

## Next Steps (Not Phase 20)

### Phase 21: Multi-Locale Admin UI
- Locale switcher in sidebar
- Query params: `/admin/pages?locale=en`
- Filtering by locale in list

### Phase 22: Multi-Locale Content Creation
- Create page UI with locale selector
- Optional: Copy page to other locale
- Duplicate detection

### Phase 23+: Routing Integration
- next-intl or custom middleware
- `/de/page`, `/en/page` URLs
- Fallback chain

## Testing Scenarios

✅ **Load German pages** → `loadAdminPages()` loads de/home  
✅ **Load English page detail** → `loadAdminPageDetail({ slug: "home", locale: "en" })`  
✅ **Supported locales displayed** → Admin UI shows [de, en]  
✅ **Config validation** → Errors if defaultLocale not in supportedLocales  
✅ **Demo data** → Both German and English pages present  
✅ **TypeScript safety** → All locale operations type-checked  

## Architecture Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Content-based, not translation-based | Simplicity, autonomy per locale |
| No translation maps | Scales better, no sync issues |
| Blocks per-page (not shared) | Preserves structure independence |
| Optional locale param (falls back) | Backwards compatible |
| Display-only locales (no switcher) | UI follows data model setup |
| No routing changes yet | Separate concern, additive in later phases |

---

**Ready for Phase 21: Multi-Locale Admin UI** ✅

The content model is now fully locale-aware. Pages, blocks, and runtime config all understand multiple locales. Future phases can layer on routing, UI switching, and advanced features without architectural changes.
