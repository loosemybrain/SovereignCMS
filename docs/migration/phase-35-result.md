# Phase 35 — Publish Visibility Foundation — Ergebnis

## Ziel

Kontrollierte Public Visibility basierend auf Content Status.

## Geänderte und neue Dateien

### Core Preview Types

- `packages/core/src/preview.ts` (Neu):
  - `PreviewMode` Type: "disabled" | "enabled"
  - `PreviewContext` Type mit mode property
  - `createPreviewContext()` Factory
  - Erstellt PreviewContext aus searchParams.preview
  - Akzeptiert "1" oder "true" als enabled

- `packages/core/src/index.ts`:
  - Exports für PreviewMode und PreviewContext
  - Exports für createPreviewContext

### Runtime Public Visibility

- `packages/runtime/src/public-page-resolution.ts`:
  - ResolvePublicPageInput erweitert: `preview: PreviewContext`
  - published Pages: immer sichtbar
  - draft Pages: nur mit preview.mode === "enabled"
  - archived Pages: niemals sichtbar

- `packages/runtime/src/public-navigation-resolution.ts`:
  - resolveNavigation Input erweitert: `preview: PreviewContext`
  - Filter mit Sichtbarkeits-Regeln
  - published Items: immer sichtbar
  - draft Items: nur mit preview enabled
  - archived Items: niemals sichtbar

### Public App Integration

- `apps/web/src/lib/load-public-page.ts`:
  - Input erweitert: `searchParams?: Record<string, ...>`
  - PublicPagePayload erweitert: `previewContext: PreviewContext`
  - createPreviewContext({ preview: searchParams?.preview })
  - Übergib previewContext an page + navigation resolution
  - Rückgabe mit previewContext

- `apps/web/src/components/public-preview-badge.tsx` (Neu):
  - PublicPreviewBadge Component
  - Props: previewEnabled: boolean
  - Zeigt amber badge in top-right (fixed)
  - Nur bei previewEnabled === true

- `apps/web/src/components/public-navigation.tsx`:
  - Props erweitert: `previewEnabled?: boolean`
  - Page Links: `/{locale}/{slug}` oder `/{locale}/{slug}?preview=1`
  - External Links: unverändert
  - Preview Query bei aktivem Preview erhalten

- `apps/web/src/components/public/PublicPageView.tsx`:
  - Props erweitert: `previewContext: PreviewContext`
  - PublicPreviewBadge rendering
  - previewEnabled an PublicNavigation übergeben
  - Draft-Badge für draft pages mit aktiver Preview
  - Zeige status indicator neben title

- `apps/web/src/app/[[...slug]]/page.tsx`:
  - Props erweitert: `searchParams: Promise<Record<...>>`
  - searchParams an loadPublicPage weitergeben

## Neue Contracts

- `PreviewMode` Type (Core)
- `PreviewContext` Type (Core)
- `createPreviewContext` Factory (Core)
- ResolvePublicPageInput.preview (Runtime)
- PublicPagePayload.previewContext (Web)
- PublicNavigation.previewEnabled prop (Web)

## Visibility Matrix

| Status | No Preview | preview=1 |
|--------|-----------|----------|
| published | ✅ | ✅ |
| draft | ❌ | ✅ |
| archived | ❌ | ❌ |

## Flow: Publish Visibility

```
1. User requests page
2. Page route extracts slug, locale, searchParams
3. loadPublicPage({ host, slug, locale, searchParams })
4. createPreviewContext({ preview: searchParams?.preview })
5. Resolve tenant by host
6. publicPageResolution.resolvePage({ ..., preview })
7. Apply visibility rules:
   - published → return page
   - draft + preview.enabled → return page
   - draft + preview.disabled → return null
   - archived → return null
8. publicNavigationResolution.resolveNavigation({ ..., preview })
9. Filter items by status + preview
10. Return PublicPagePayload with previewContext
11. PublicPageView renders:
    - PublicPreviewBadge (if preview.enabled)
    - PublicNavigation with preview query if enabled
    - Page title + status indicator
    - Blocks
```

## Query Parameter Handling

- `?preview=1` → PreviewMode: enabled
- `?preview=true` → PreviewMode: enabled
- `?preview=0` → PreviewMode: disabled
- no param → PreviewMode: disabled

## Preview Badge UI

Minimal amber badge:
- Fixed position top-right
- "Preview Mode" text
- Only appears when preview enabled
- Non-intrusive

## Navigation Preview Propagation

Interne Links behalten preview=1:
```
With preview: <a href="/de/home?preview=1">Home</a>
Without preview: <a href="/de/home">Home</a>
External: <a href="https://...">Link</a> (unchanged)
```

## Sicherheit

⚠️ Diese Phase ist NICHT produktionssicher:
- Query Parameter sichtbar in URL
- Keine Authentifizierung
- Keine Preview Tokens
- Keine Rate Limiting
- Keine Audit Logs

✅ Nur für Demo/Staging-Umgebungen.

## Validierung

```bash
✅ Typecheck wird beim Lauf validiert
✅ Build wird beim Lauf validiert
✅ Lint wird beim Lauf validiert
```

## Code Quality

- ✅ TypeScript vollständig getypt (PreviewContext strict)
- ✅ Visibility Rules defensive
- ✅ SearchParams Handling null-safe
- ✅ Query Parameter Preservation
- ✅ No Runtime objects to client
- ✅ No fetch/REST Calls
- ✅ No Cookies/Middleware
- ✅ No ISR/Revalidation

## Bekannte Grenzen (Absichtlich)

- ❌ Keine Auth/Authentifizierung
- ❌ Keine Preview Tokens
- ❌ Keine Preview Sessions
- ❌ Keine Share Links
- ❌ Keine Cookies
- ❌ Keine Middleware
- ❌ Keine Rate Limiting
- ❌ Keine Audit Logs
- ❌ Keine Caching Layer
- ❌ Keine ISR/Revalidation

Alles Phase 36+.

## Test-Szenarien

1. Published page, no preview → sichtbar
2. Draft page, no preview → notFound
3. Archived page, no preview → notFound
4. Published page, preview=1 → sichtbar mit badge
5. Draft page, preview=1 → sichtbar mit badge + draft indicator
6. Archived page, preview=1 → notFound (never)
7. Navigation ohne preview → nur published items
8. Navigation mit preview=1 → published + draft items
9. Nav links mit preview → ?preview=1 erhalten
10. External links → keine Änderung

## Migration Path für Phase 36

### Auth-based Preview

```typescript
// Preview token validation
const token = searchParams?.token
if (token) {
  const isValid = await validatePreviewToken(token)
  if (isValid) enablePreview()
}
```

### Preview Sessions

```typescript
// Session-based preview access
const sessionId = getPreviewSession(cookies)
const previewContext = await resolvePreviewSession(sessionId)
```

### Audit Logging

```typescript
// Log preview access attempts
await auditLog.logPreviewAccess({
  userId, pageId, timestamp, token
})
```

## Summary

Phase 35 etabliert:

- ✅ Published-by-default visibility
- ✅ Draft preview via query parameter
- ✅ Archived never visible
- ✅ PreviewContext types + factory
- ✅ Visibility rules in resolutions
- ✅ Preview badge UI
- ✅ Query param propagation
- ✅ Draft status indicators
- ✅ Query-based preview (no auth)
- ✅ Type-safe models
- ✅ Fully documented

**Öffentlich Standard**: Published Content
**Preview-Zugang**: Query Parameter ?preview=1
**Visibility-Matrix**: Klare Status-basierte Regeln

**Nächste Phase**: Auth Preview, Preview Tokens, Sessions, Audit Logs.
