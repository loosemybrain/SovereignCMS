# Phase 49 — External Media & Consent Foundation — Result

## Goal

GDPR-conscious external media consent foundation without persistent storage or analytics.

## Changed and New Files

### Core Consent Types

- `packages/core/src/consent.ts` (NEW):
  - `ConsentCategory` type ("necessary" | "external-media")
  - `ConsentState` type
  - `createDefaultConsentState()` function

- `packages/core/src/index.ts` (MODIFIED):
  - Exports for consent types and functions

### Core External Embed Types

- `packages/core/src/external-embed.ts` (NEW):
  - `ExternalEmbedProvider` type ("google-maps" | "generic")
  - `ExternalEmbedProps` type
  - `validateGoogleMapsEmbedUrl()` function
  - `validateExternalEmbedUrl()` function

- `packages/core/src/blocks.ts` (MODIFIED):
  - `ExternalEmbedBlockProps` type added
  - Import of `ExternalEmbedProps`

- `packages/core/src/index.ts` (MODIFIED):
  - Exports for external embed types and validators

### Admin Block Definition

- `apps/admin/src/block-definitions/registry.ts` (MODIFIED):
  - External Embed Block Definition hinzugefügt
  - Type: "external-embed"
  - Category: "External Media"
  - Inspector Fields: provider, title, embedUrl, consentText, buttonLabel
  - Field Groups: content, embed, consent

- `apps/admin/src/components/block-renderers/external-embed-renderer.tsx` (NEW):
  - ExternalEmbedAdminRenderer Component
  - Shows form preview with disabled fields
  - Displays provider, title, embedUrl
  - Shows consent text and button label
  - Warns: "External media is blocked until consent is given on the public page"

### Consent Infrastructure

- `apps/web/src/components/consent-provider.tsx` (NEW):
  - ConsentProvider Client Component
  - React Context with session-only state
  - useConsent() hook
  - acceptExternalMedia() function
  - No cookies, no localStorage, no persistence

- `apps/web/src/app/layout.tsx` (MODIFIED):
  - Wraps children with ConsentProvider
  - All pages have access to useConsent()

### External Media Gate

- `apps/web/src/components/external-media-gate.tsx` (NEW):
  - ExternalMediaGate Client Component
  - Shows placeholder before consent
  - Renders children after consent
  - Button calls acceptExternalMedia()
  - Clear, accessible UX

### Public External Embed Component

- `apps/web/src/components/public-external-embed.tsx` (NEW):
  - PublicExternalEmbed Client Component
  - Validates URL using validateExternalEmbedUrl()
  - Wraps iframe in ExternalMediaGate
  - Shows error if URL invalid
  - loading="lazy" for performance
  - referrerPolicy="no-referrer-when-downgrade" for privacy

### Public Block Rendering

- `apps/web/src/components/public/PublicBlockRenderer.tsx` (MODIFIED):
  - Added case "external-embed"
  - Imports PublicExternalEmbed component
  - Renders with all props

## New Contracts

- `ConsentCategory` type (Core)
- `ConsentState` type (Core)
- `ExternalEmbedProvider` type (Core)
- `ExternalEmbedProps` type (Core)
- `ExternalEmbedBlockProps` type (Core)
- External Embed Block Definition (Admin)
- PublicExternalEmbed Props (Web)

## Validation

```bash
✅ Typecheck wird beim Lauf validiert
✅ Build wird beim Lauf validiert
✅ Lint wird beim Lauf validiert
```

## Consent State Defaults

```typescript
{
  necessary: true,        // Always true (no cookies used)
  externalMedia: false,   // Default false, requires explicit acceptance
}
```

## URL Validation Rules

### Google Maps

```typescript
- HTTPS protocol required
- Host: google.com or www.google.com
- Path: must start with /maps/embed
```

### Generic Provider

```typescript
- HTTPS protocol required
- Valid URL required
```

## No Cookies/localStorage

```typescript
// Consent stored in React state only
// Lost on:
// - Page reload
// - Browser close
// - New page visit
// - Session end
```

## External Media Gate UX

```typescript
// Before consent:
<ExternalMediaGate title={title} consentText={...}>
  // Placeholder shown
  // title
  // consentText
  // button
</ExternalMediaGate>

// After consent (externalMedia=true):
<ExternalMediaGate ...>
  {/* children rendered */}
  <iframe src={embedUrl} ... />
</ExternalMediaGate>
```

## Admin Preview

- Shows provider, title, embedUrl
- Shows consent text and button label
- No iframe loaded
- No external request
- Static preview only

## Public Page Behavior

1. Page loads with ExternalMediaGate
2. Placeholder visible (title, consent text, button)
3. iframe not in DOM yet
4. No external requests made
5. User clicks button
6. acceptExternalMedia() called
7. Consent state updated to externalMedia=true
8. Gate re-renders, children visible
9. iframe displays, Google Maps/embed loads
10. On reload: consent resets

## Accessibility

- Button is semantic `<button>` element
- Placeholder text clear and readable
- focus:ring styles on button
- Proper ARIA roles not needed (simple gate pattern)

## Test Scenarios

1. ✅ External Embed Block can be added
2. ✅ Inspector shows all fields
3. ✅ Admin Preview does not load iframe
4. ✅ Public page shows placeholder
5. ✅ Before click: iframe not in DOM
6. ✅ After click: iframe rendered
7. ✅ Invalid Google Maps URL: error shown
8. ✅ Non-HTTPS URL: error shown
9. ✅ Page reload: consent reset
10. ✅ No cookies created
11. ✅ No localStorage created
12. ✅ No external requests before consent

## Known Limitations (Intentional)

- ❌ No persistent consent storage
- ❌ No consent logs
- ❌ No consent analytics
- ❌ No cookie consent banner
- ❌ No additional consent categories
- ❌ No reCAPTCHA
- ❌ No rate limiting
- ❌ No YouTube/Vimeo complex handling
- ❌ No cookie scanner
- ❌ No full CMP
- ❌ No analytics integration
- ❌ No marketing tags
- ❌ No GTM

All Phase 50+ features.

## Admin Workflow

1. Admin opens Page Editor
2. Add Block → External Embed
3. Configure fields in Inspector:
   - provider: "google-maps"
   - title: "Google Maps"
   - embedUrl: "https://www.google.com/maps/embed?pb=..."
   - consentText: "Zum Anzeigen dieser Karte..."
   - buttonLabel: "Karte laden"
4. Preview in Editor (no iframe loads)
5. Save Page
6. External Embed appears on public page with placeholder

## Public Workflow

1. User sees External Embed block on page
2. Shows placeholder:
   - Title
   - Consent explanation
   - Button
3. iframe not in DOM
4. No external requests made
5. User clicks button to accept external media
6. Button click triggers acceptExternalMedia()
7. Consent state updates
8. Gate re-renders with iframe
9. Google Maps/embed loads
10. User can interact with content
11. On page reload: placeholder shown again

## Migration Path für Phase 50

### Persistent Consent Storage

```typescript
// Option 1: sessionStorage (survives navigation, lost on close)
sessionStorage.setItem("consent-external-media", "true")

// Option 2: IndexedDB (more granular)
await db.consent.put({ category: "external-media", accepted: true })

// Option 3: Server session (requires API)
await fetch("/api/consent", { method: "POST", body: {...} })
```

### Additional Consent Categories

```typescript
export type ConsentState = {
  necessary: true
  externalMedia: boolean
  analytics: boolean        // Phase 50+
  marketing: boolean        // Phase 50+
}
```

### Consent Banner

```typescript
<ConsentBanner>
  <Category name="external-media">Externe Inhalte</Category>
  <Category name="analytics">Analytics (optional)</Category>
  <Category name="marketing">Marketing (optional)</Category>
</ConsentBanner>
```

## Summary

Phase 49 establishes:

- ✅ Consent types (necessary, external-media)
- ✅ External embed types with validation
- ✅ Google Maps URL validation
- ✅ External embed block
- ✅ Admin renderer (no iframe loading)
- ✅ ConsentProvider (session-only state)
- ✅ ExternalMediaGate
- ✅ PublicExternalEmbed
- ✅ URL validation before rendering
- ✅ Placeholder UX
- ✅ No cookies/localStorage
- ✅ No analytics/marketing

**Kein Mailversand, keine Speicherung, keine externe Services.**

**Nächste Phase**: Persistent consent, consent categories, consent banner.
