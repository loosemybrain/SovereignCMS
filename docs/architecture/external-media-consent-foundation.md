# External Media & Consent Foundation (Phase 49)

## Overview

Phase 49 introduces a **GDPR-conscious external media consent system** that prevents external content (Google Maps, embeds) from loading until users explicitly consent.

The system is:
- **Consent-based**: External media blocked until explicit acceptance
- **Session-only**: Consent state lives in React state, not persistent
- **No cookies**: No cookie storage or tracking
- **No localStorage**: No persistent consent storage
- **Validation-first**: URLs validated before rendering
- **Accessible**: Clear UX, proper button semantics
- **No analytics**: No GTM, no marketing tags, no tracking

## Architecture

### Consent Types

**Location**: `packages/core/src/consent.ts`

```typescript
export type ConsentCategory = "necessary" | "external-media"

export type ConsentState = {
  necessary: true
  externalMedia: boolean
}

export function createDefaultConsentState(): ConsentState {
  return {
    necessary: true,
    externalMedia: false,
  }
}
```

**Default State**:
- `necessary`: Always `true` (cookies not used anyway)
- `externalMedia`: Default `false` (requires explicit acceptance)

### External Embed Types

**Location**: `packages/core/src/external-embed.ts`

```typescript
export type ExternalEmbedProvider = "google-maps" | "generic"

export type ExternalEmbedProps = {
  provider: ExternalEmbedProvider
  title: string
  embedUrl: string
  consentText?: string
  buttonLabel?: string
}
```

**Validation Functions**:
- `validateGoogleMapsEmbedUrl(value: string): boolean`
  - Validates HTTPS protocol
  - Checks for `google.com` or `www.google.com`
  - Ensures `/maps/embed` path
- `validateExternalEmbedUrl(input): boolean`
  - Dispatches to provider-specific validator
  - Generic validator requires HTTPS

### External Embed Block Props

**Location**: `packages/core/src/blocks.ts`

```typescript
export type ExternalEmbedBlockProps = ExternalEmbedProps
```

**Configuration in Block Definition**:
- `provider`: "google-maps" or "generic"
- `title`: Display title
- `embedUrl`: Full HTTPS URL
- `consentText`: Consent explanation (optional)
- `buttonLabel`: Button label (optional)

### Consent Provider

**Location**: `apps/web/src/components/consent-provider.tsx`

**Type**: Client Component

```typescript
type ConsentContextValue = {
  consentState: ConsentState
  acceptExternalMedia: () => void
}
```

**Features**:
- React Context for consent state
- Session-only state (no persistence)
- `useConsent()` hook for consumption
- Throws error if used outside provider

**No**:
- Cookie storage
- localStorage
- Supabase/Database
- API calls
- Persistence across sessions/reloads

### External Media Gate

**Location**: `apps/web/src/components/external-media-gate.tsx`

**Type**: Client Component

**Props**:
```typescript
type Props = {
  title: string
  consentText: string
  buttonLabel: string
  children: ReactNode
}
```

**Behavior**:
- If `consent.externalMedia === false`:
  - Render placeholder with title
  - Show consent explanation text
  - Display clickable button
  - Button calls `acceptExternalMedia()`
- If `consent.externalMedia === true`:
  - Render children (iframe, embed, etc.)

**UX**:
- Clear, non-intrusive design
- Button styled like action button
- Accessible semantics
- No auto-loading

### Public External Embed Component

**Location**: `apps/web/src/components/public-external-embed.tsx`

**Type**: Client Component

**Props**: `ExternalEmbedProps`

**Flow**:
1. Validate URL using `validateExternalEmbedUrl()`
2. If invalid:
   - Show error message
   - No iframe rendered
3. If valid:
   - Wrap in `ExternalMediaGate`
   - Render iframe with:
     - `loading="lazy"` for performance
     - `referrerPolicy="no-referrer-when-downgrade"` for privacy
     - `allowFullScreen` for maps
     - Responsive aspect ratio (16:9)

**Important**:
- iframe only rendered inside gate children
- No external request before consent
- URL validation happens before rendering

### Admin External Embed Renderer

**Location**: `apps/admin/src/components/block-renderers/external-embed-renderer.tsx`

**Features**:
- Shows provider, title, embedUrl
- Displays consent text and button label
- Warning: "External media is blocked until consent is given on the public page"
- No iframe loaded in admin
- No external requests

### Block Definition

**Location**: `apps/admin/src/block-definitions/registry.ts`

```typescript
"external-embed": {
  type: "external-embed"
  label: "External Embed"
  category: "External Media"
  defaultProps: {
    provider: "google-maps",
    title: "Google Maps",
    embedUrl: "",
    consentText: "Zum Anzeigen dieser externen Karte...",
    buttonLabel: "Externe Karte laden",
  }
  inspectorFields: [
    provider (text), title, embedUrl, consentText, buttonLabel
  ]
  adminRenderer: ExternalEmbedAdminRenderer
}
```

### App Layout Integration

**Location**: `apps/web/src/app/layout.tsx`

```typescript
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ConsentProvider>{children}</ConsentProvider>
      </body>
    </html>
  )
}
```

**All child pages** have access to `useConsent()` hook.

### Public Block Renderer Integration

**Location**: `apps/web/src/components/public/PublicBlockRenderer.tsx`

```typescript
case "external-embed": {
  const props = (block.props ?? {}) as ExternalEmbedBlockProps
  return <PublicExternalEmbed {...props} />
}
```

## Data Flow: External Embed Submission

```
Admin adds "External Embed" block
  ↓
Admin configures (provider, title, embedUrl, consent text)
  ↓
Admin preview shows (no iframe loaded)
  ↓
Public page renders block
  ↓
PublicExternalEmbed validates embedUrl
  ↓
If invalid → Show error message
If valid → Render ExternalMediaGate with iframe as children
  ↓
User sees placeholder:
  - Title
  - Consent text
  - Button label
  ↓
User clicks button
  ↓
acceptExternalMedia() sets externalMedia=true
  ↓
ExternalMediaGate re-renders children
  ↓
iframe displays (Google Maps, embed, etc.)
  ↓
No further requests needed (iframe handles itself)
```

## Consent & Privacy

**Session-Only Consent**:
- Stored in React state only
- Lost on page reload
- Lost on browser close
- Lost on new page visit

**No**:
- Cookie storage
- localStorage persistence
- Database storage
- Consent logs
- Tracking pixels
- Analytics tags
- Marketing tags
- GTM integration

**GDPR Compliant**:
- Explicit consent required
- No pre-checked boxes
- No dark patterns
- Clear opt-in only
- No consent hiding

## Type Safety

- All props typed (`ExternalEmbedProps`)
- Validation functions return boolean
- Error messages on invalid URLs
- No `Record<string, unknown>` generics
- Strong enum for provider types

## Known Limitations (Intentional)

- ❌ No persistent consent (Phase 50)
- ❌ No consent logs
- ❌ No consent analytics
- ❌ No cookie consent banner
- ❌ No consent categories beyond external-media
- ❌ No reCAPTCHA integration
- ❌ No rate limiting
- ❌ No YouTube/Vimeo complex handling
- ❌ No cookie scanner
- ❌ No full CMP (Consent Management Platform)
- ❌ No analytics integration
- ❌ No marketing tags
- ❌ No GTM

All Phase 50+ features.

## Testing Scenarios

1. **Admin block addition**: External Embed block appears in palette
2. **Admin inspector**: All fields editable, validation works
3. **Admin preview**: No iframe loads, consent notice shown
4. **Public page - before consent**:
   - Placeholder visible
   - Button clickable
   - iframe not in DOM
   - No external requests
5. **Public page - after consent**:
   - Placeholder removed
   - iframe rendered
   - Maps/embed displays
6. **URL validation**:
   - Valid Google Maps URL: iframe renders
   - Invalid URL: error message shown
   - Non-HTTPS: error message
7. **Session isolation**:
   - Reload page: consent reset
   - Close tab: consent lost
   - New page: consent reset

## Admin Workflow

1. Admin opens page editor
2. Clicks "Add Block" → selects "External Embed"
3. Inspector shows fields: provider, title, embedUrl, consent text, button label
4. Admin fills in Google Maps embed URL
5. Admin customizes consent text and button label
6. Admin preview shows configuration (no iframe)
7. Saves page
8. Public page shows placeholder until user accepts

## Public Workflow

1. User visits public page
2. User sees external embed block with placeholder
3. Placeholder shows:
   - Title ("Google Maps")
   - Consent text explanation
   - Button ("Load Content" or custom)
4. User clicks button to accept external media
5. iframe appears, Google Maps loads
6. User can interact with map
7. On reload: consent resets, placeholder shows again

## Future Integration (Phase 50+)

### Persistent Consent Storage

```typescript
// Store in sessionStorage (survives navigation within session)
// NOT localStorage (persists across sessions - requires explicit user choice)
const consent = sessionStorage.getItem("consent-external-media")

// Or: IndexedDB for more fine-grained control
// Or: Server-side session storage (requires API)
```

### Consent Analytics (if needed)

```typescript
// Log only to browser console, not external services
console.info("[consent] External media accepted", { timestamp })

// No third-party analytics
// No GTM integration
// No marketing pixels
```

### Multiple Consent Categories

```typescript
export type ConsentState = {
  necessary: true
  externalMedia: boolean
  analytics: boolean
  marketing: boolean
}
```

### Persistent Consent Banner

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
- ✅ External embed block definition
- ✅ Admin preview (no iframe loading)
- ✅ ConsentProvider with session-only state
- ✅ ExternalMediaGate component
- ✅ PublicExternalEmbed component
- ✅ URL validation before rendering
- ✅ Placeholder UX (clear, accessible)
- ✅ No cookies/localStorage
- ✅ No analytics/marketing
- ✅ Type-safe implementation

**No mail delivery, no persistence, no analytics, no tracking.**

**Ready for Phase 50**: Persistent consent, consent categories, consent analytics, consent banner.
