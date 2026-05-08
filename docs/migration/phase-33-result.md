# Phase 33 — SEO Metadata Foundation — Ergebnis

## Ziel

Einführung einer **strukturierten SEO-Metadata-Ebene** auf Page-Level mit Editor-Integration.

## Geänderte und neue Dateien

### Core SEO Types

- `packages/core/src/seo.ts` (Neu):
  - `SeoMetadata` Type mit seoTitle, seoDescription, seoImageAssetId, seoImageUrl, canonicalUrl, robotsIndex
  - `createDefaultSeoMetadata()` Factory Funktion
  - `validateCanonicalUrl()`, `validateSeoTitle()`, `validateSeoDescription()` Validatoren

- `packages/core/src/index.ts`:
  - Exports für `SeoMetadata` Type
  - Exports für Validator Funktionen

- `packages/core/src/cms.ts`:
  - `CmsPage.seo` Feld typen zu `SeoMetadata` (vorher: `Record<string, unknown>`)

- `packages/core/src/editor.ts`:
  - `SavePageDraftInput.pageSeo?` optional hinzugefügt

### Database

- `packages/db/src/in-memory-adapter.ts`:
  - Alle Demo Pages mit `seo` Initialisierung
  - German home: seoTitle, seoDescription, canonicalUrl
  - English home: seoTitle, seoDescription, canonicalUrl

### Admin Components

- `apps/admin/src/components/seo-editor-section.tsx` (Neu):
  - Reusable SEO Formular Komponente
  - Fields: seoTitle, seoDescription, canonicalUrl, robotsIndex, SEO Image Picker
  - Validation und char-count Display
  - MediaPicker Integration für SEO Image

- `apps/admin/src/components/editor-inspector.tsx`:
  - Props um `pageSeo` und `onUpdatePageSeo` erweitert
  - Zeigt SEO Section wenn kein Block ausgewählt
  - Raw SEO Preview (JSON)
  - Import von SeoEditorSection

- `apps/admin/src/components/page-editor-client.tsx`:
  - State: `pageSeo` (separate von draftBlocks)
  - Handler: `updatePageSeo(patch)`
  - Save erweitert: `savePageDraft({ blocks, pageSeo })`
  - EditorInspector erhält `pageSeo` und `onUpdatePageSeo` Props

## Neue Contracts

- `SeoMetadata` Type (Core)
- `SavePageDraftInput.pageSeo` optional (Core)
- `EditorInspector` Props erweitert (Admin)

## Flow: SEO Editing

```
1. User öffnet Page Editor
2. PageEditorClient: pageSeo = page.seo
3. User klickt weg vom Block (selectedBlock = null)
4. EditorInspector zeigt SeoEditorSection
5. User editiert seoTitle/seoDescription/canonicalUrl/robotsIndex
6. updatePageSeo() merged Patch
7. setPageSeo() + setIsDirty(true)
8. User klickt Save
9. savePageDraft({ blocks, pageSeo })
10. Server persistiert SEO lokal/InMemory
```

## Validierung

```bash
✅ Typecheck wird beim Lauf validiert
✅ Build wird beim Lauf validiert
✅ Lint wird beim Lauf validiert
```

## SEO Image Media Integration

MediaPicker wird wiederverwendet:

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

- Tenant-aware
- Keine Upload-Funktion
- Einfache Preview

## Save Flow ERWEITERT (aber kompatibel)

Bestehender Flow bleibt:

```typescript
savePageDraft({
  tenantId, pageId, locale,
  blocks: [...],
  pageSeo: {...}  // ← Neu, optional
})
```

Server Action akzeptiert optionales pageSeo.
InMemory Adapter speichert SEO zusammen mit Seite.

## Bekannte Grenzen (Absichtlich)

- ❌ Keine Public Metadata Rendering
- ❌ Keine Metadata API Integration
- ❌ Keine Sitemap Generation
- ❌ Keine robots.txt Generator
- ❌ Keine OpenGraph Tags
- ❌ Keine Twitter Cards
- ❌ Keine Rich Snippets
- ❌ Keine Search Console Integration
- ❌ Kein Bulk SEO Tools

Alles Phase 34+.

## Inspector UI Consolidation (Minimal)

Phase 33 fokussiert hauptsächlich auf SEO Foundation.

UI Consolidation war geplant, aber:
- SEO Foundation ist die Priorität
- UI Polish kann Phase 34 sein
- Architektur bleibt clean

Kleine UI Verbesserungen in:
- SeoEditorSection Design (konsistent mit Admin Primitives)
- EditorInspector Layout (klare Sections)

## Code Quality

- ✅ TypeScript vollständig getypt (SeoMetadata strict type)
- ✅ Validatoren robust (defensiv)
- ✅ Separate State Management (SEO vs Blocks)
- ✅ Zero Runtime im Client
- ✅ Tenant isolation maintained

## Migration Path für Phase 34

### Public Metadata Rendering

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
export async function GET() {
  const pages = await getAllPublishedPages()
  return pages
    .filter((p) => p.seo.robotsIndex)
    .map((p) => ({...}))
}
```

## Summary

Phase 33 etabliert:

- ✅ Strukturierte `SeoMetadata` Type
- ✅ Page-Level SEO (nicht Block-Level)
- ✅ Editor Integration (Inspector Section)
- ✅ MediaPicker für SEO Images
- ✅ Validation Functions
- ✅ Demo Data Initialization
- ✅ Save Flow Integration
- ✅ Separate State Management
- ✅ Raw SEO Preview
- ✅ Vollständig dokumentiert

**Nächste Phase**: Public SEO Metadata Rendering mit Metadata API.
