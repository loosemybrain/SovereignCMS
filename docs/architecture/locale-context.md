# Locale Context Architecture

## Overview

Phase 20.1 hardens the locale foundation by centralizing locale context creation and ensuring consistent, type-safe locale handling throughout the runtime and admin interface.

## Key Changes

### 1. Locale Utilities (`packages/core/src/locale-utils.ts`)

Provides utility functions for locale validation and resolution:

```typescript
// Check if locale is supported
isSupportedLocale(locale: string, supportedLocales: SupportedLocale[]): boolean

// Get default locale from list
getDefaultLocale(supportedLocales: SupportedLocale[]): string

// Resolve locale with fallback
resolveLocale(
  requestedLocale: string | undefined,
  supportedLocales: SupportedLocale[]
): string
```

**Rules**:
- `isSupportedLocale`: Checks if code exists in array
- `getDefaultLocale`: Prefers explicit default, falls back to first, then "de"
- `resolveLocale`: Uses requested if valid, else uses default

### 2. RuntimeConfig Type Upgrade

#### Before
```typescript
supportedLocales: string[]  // ["de", "en"]
```

#### After
```typescript
import type { SupportedLocale } from "@sovereign-cms/core"

supportedLocales: SupportedLocale[]  // [{ code: "de", label: "DE", default: true }, ...]
```

**Benefits**:
- Type-safe: Compiler catches invalid structures
- Metadata: Each locale has label and default flag
- Consistent: No parsing needed downstream

### 3. Locale Config Parsing

ENV input:
```
SUPPORTED_LOCALES=de,en
DEFAULT_LOCALE=de
```

Transformation in `loadRuntimeConfig()`:
```typescript
// Input strings: ["de", "en"]
// Output array:
[
  { code: "de", label: "DE", default: true },
  { code: "en", label: "EN", default: false },
]
```

**Validation**:
- `defaultLocale` must be in locale codes
- Whitespace trimmed
- Empty codes filtered
- Fallback to "de" if missing

### 4. Locale Context Factory (`packages/runtime/src/locale-context.ts`)

Central point for creating `LocaleContext`:

```typescript
export function createLocaleContext(input: {
  locale: string
  supportedLocales: SupportedLocale[]
  defaultLocale: string
}): LocaleContext
```

**Usage**:
```typescript
const localeContext = createLocaleContext({
  locale: "en",
  supportedLocales: runtime.config.supportedLocales,
  defaultLocale: runtime.config.defaultLocale,
})
```

**Consistency**: All loaders use this function.

### 5. Unified Loader Returns

#### Before
```typescript
locale: string
supportedLocales: string[]
```

#### After
```typescript
localeContext: LocaleContext
```

**Benefits**:
- Single source of truth
- Type-safe: All locale info together
- Extensible: Can add to LocaleContext without changing signatures
- Serializable: LocaleContext is pure data

### 6. Admin UI Consistency

Both Pages List and Page Detail now display:

```typescript
Current Locale:        [de]
Supported Locales:     [de] [en]
```

Display is consistent across both views.

## Data Flow

```
ENV vars
  ↓
loadRuntimeConfig()
  ├─ Parse SUPPORTED_LOCALES → string[]
  ├─ Build SupportedLocale[]
  └─ Return RuntimeConfig with supportedLocales: SupportedLocale[]
  ↓
Admin Loader
  ├─ Get locale from param or config.defaultLocale
  ├─ createLocaleContext({ locale, supportedLocales, defaultLocale })
  └─ Return localeContext in response
  ↓
Admin UI
  ├─ Display localeContext.locale
  ├─ List localeContext.supportedLocales
  └─ Render consistent
```

## Type Safety

### Example: Invalid Locale Handling

```typescript
// Loader receives:
loadAdminPages({ locale: "xyz" })

// Inside:
const localeContext = createLocaleContext({
  locale: "xyz",
  supportedLocales: [
    { code: "de", label: "DE", default: true },
    { code: "en", label: "EN" }
  ],
  defaultLocale: "de",
})

// resolveLocale() checks: "xyz" in supportedLocales?
// No → returns defaultLocale "de"

// Result:
// {
//   locale: "de",  // Invalid request → fallback
//   supportedLocales: [...],
//   defaultLocale: "de"
// }
```

### Example: Valid Locale

```typescript
loadAdminPages({ locale: "en" })

// resolveLocale() checks: "en" in supportedLocales?
// Yes → returns "en"

// Result:
// {
//   locale: "en",  // Kept as-is
//   supportedLocales: [...],
//   defaultLocale: "de"
// }
```

## Extensibility

Future features can add to `LocaleContext` without changing signatures:

```typescript
// Phase 21 example:
export type LocaleContext = {
  locale: LocaleCode
  supportedLocales: SupportedLocale[]
  defaultLocale: LocaleCode
  // Future:
  // fallbackLocale?: LocaleCode
  // direction?: "ltr" | "rtl"
}
```

## Constraints (Intentional)

- ❌ **No middleware**: No locale routing interception
- ❌ **No next-intl**: No framework integration
- ❌ **No URL rewriting**: `/pages` stays `/pages`, not `/de/pages`
- ❌ **No persistence changes**: Loaders still mock
- ❌ **No UI switcher**: Display-only for now

All phase 20.1-appropriate – future phases add these.

## File Locations

| File | Purpose |
|------|---------|
| `packages/core/src/locale-utils.ts` | Locale utility functions |
| `packages/core/src/locale.ts` | Locale types |
| `packages/runtime/src/config.ts` | Config loading + SupportedLocale parsing |
| `packages/runtime/src/locale-context.ts` | LocaleContext factory |
| `apps/admin/src/lib/load-admin-pages.ts` | Pages loader using localeContext |
| `apps/admin/src/lib/load-admin-page-detail.ts` | Page detail loader using localeContext |
| `apps/admin/src/app/(admin)/pages/page.tsx` | Pages list UI |
| `apps/admin/src/app/(admin)/pages/[slug]/page.tsx` | Page detail UI |

## Testing

### Config Parsing
```typescript
const config = loadRuntimeConfig({
  SUPPORTED_LOCALES: "de, en, pl",  // with spaces
  DEFAULT_LOCALE: "en",
})

// Result:
// supportedLocales: [
//   { code: "de", label: "DE", default: false },
//   { code: "en", label: "EN", default: true },
//   { code: "pl", label: "PL", default: false },
// ]
```

### Locale Resolution
```typescript
resolveLocale("fr", config.supportedLocales)
// → "en" (invalid locale → default)

resolveLocale("de", config.supportedLocales)
// → "de" (valid → kept)

resolveLocale(undefined, config.supportedLocales)
// → "en" (undefined → default)
```

### Admin Loaders
```typescript
loadAdminPages({ locale: "pl" })
// → Pages in Polish

loadAdminPages()
// → Pages in default locale (en)

loadAdminPageDetail({ slug: "home", locale: "fr" })
// → Falls back to default, then loads German home
```

## Performance

- ✅ No runtime overhead: Pure data transformations
- ✅ No extra network calls: Locale resolution is local
- ✅ Type-checked at compile time: No runtime validation library needed
- ✅ Predictable: Fallback chain is clear and deterministic

## Migration Guide (For Future)

When moving to next-intl or custom i18n:

1. **LocaleContext stays**: Already defines all needed data
2. **Config parsing stays**: Already builds SupportedLocale[]
3. **Loaders adapt**: Still return localeContext, but may pull from middleware/cookies
4. **UI adapts**: Still consumes localeContext, but may trigger navigation

No breaking changes needed.
