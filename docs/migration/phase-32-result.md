# Phase 32 — Inspector Media Field Foundation — Ergebnis

## Ziel

Erweitern des Inspector Field Systems um einen **Media Field Type**, der es Blocks erlaubt, Medien-Assets auszuwählen.

## Geänderte und neue Dateien

### Core Inspector

- `apps/admin/src/components/inspector/field-types.ts`:
  - `InspectorFieldType` um `"media"` erweitert
  - `InspectorFieldDefinition.mediaType?` hinzugefügt (optional filter)

- `apps/admin/src/components/inspector/inspector-field-renderer.tsx`:
  - Props um `tenantId?: string` erweitert
  - Media field handling: MediaPicker beim Type "media"
  - Object patch support (media returns multi-prop updates)
  - Error handling wenn tenantId fehlt

### Editor Inspector

- `apps/admin/src/components/editor-inspector.tsx`:
  - Props um `tenantId?: string` erweitert
  - Helper Funktion `buildFieldPatch()` für Object Patching
  - PropsEditing um `tenantId` Übergabe
  - Transparente Unterstützung für text/textarea (single) und media (multi-prop)

### Block Definition Registry

- `apps/admin/src/block-definitions/registry.ts`:
  - Hero defaultProps um `mediaAssetId: null`, `mediaUrl: ""`, `mediaAlt: ""`
  - Hero inspectorFields um Media Field erweitert:
    ```typescript
    {
      key: "mediaAssetId",
      label: "Hero Image",
      type: "media",
      mediaType: "image",
    }
    ```

### Block Rendering

- `apps/admin/src/components/block-renderers/hero-renderer.tsx`:
  - Liest `mediaUrl` und `mediaAlt` defensiv
  - Zeigt Image-Preview wenn `mediaUrl` vorhanden
  - Fallback alt text zu headline
  - Zeigt URL Snippet in Metadaten

### Page Editor Integration

- `apps/admin/src/components/page-editor-client.tsx`:
  - EditorInspector erhält `tenantId={tenant.tenantId}`

## Neue Contracts

Keine neuen Contracts. Bestehende werden erweitert:

- `InspectorFieldDefinition` optional `mediaType`
- `InspectorFieldRenderer` optional `tenantId`
- `EditorInspector` optional `tenantId`

## Validierung

```bash
✅ npm run typecheck   # 15 packages, 0 errors
✅ npm run lint        # 0 errors, 0 warnings
✅ npm run build       # Both apps built successfully
✅ npm run clean       # Cache cleaned
```

## Flow: Media Asset Selection

```
Inspector öffnet
  ↓
Hero Block angezeigt
  ↓
MediaPicker rendert im "Hero Image" Field
  ↓
User wählt Bild aus MediaPicker
  ↓
onSelect(asset):
  onChange({
    mediaAssetId: asset.id,
    mediaUrl: asset.url,
    mediaAlt: asset.alt
  })
  ↓
EditorInspector.buildFieldPatch() merged object patch
  ↓
updateBlockProps(blockId, {
  mediaAssetId, mediaUrl, mediaAlt
})
  ↓
draftBlocks aktualisiert
  ↓
HeroAdminRenderer zeigt Bild
  ↓
Raw Props Preview zeigt alle Props
  ↓
Save speichert mit existierendem Flow
```

## Object Patching System

**Problem**: Media Field braucht mehrere Props (`mediaAssetId`, `mediaUrl`, `mediaAlt`)

**Lösung**: Media Field gibt Object zurück:

```typescript
// Text Field:
onChange("text") → { ["field.key"]: "text" }

// Media Field:
onChange({ mediaAssetId, mediaUrl, mediaAlt }) → { mediaAssetId, mediaUrl, mediaAlt }
```

`buildFieldPatch()` macht das transparent:

```typescript
function buildFieldPatch(fieldKey: string, value: unknown) {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value  // Object patch, verwende as-is
  }
  return { [fieldKey]: value }  // Regular field, wrap unter key
}
```

## tenantId Threading

MediaPicker braucht `tenantId` für Tenant-Isolation.

**Flow**:
```
PageEditorClient (page.tenant.tenantId)
  → EditorInspector (prop tenantId)
    → InspectorFieldRenderer (prop tenantId)
      → MediaPicker (uses tenantId)
```

**Wichtig**: Nur String, keine Runtime-Objekte im Client.

## Hero Block Media Integration

### Default Props
```typescript
{
  headline: "New Headline",
  subline: "New Subline",
  mediaAssetId: null,
  mediaUrl: "",
  mediaAlt: "",
}
```

### Inspector Field
```typescript
{
  key: "mediaAssetId",
  label: "Hero Image",
  type: "media",
  mediaType: "image",
}
```

### Admin Preview
- Zeigt Bild wenn `mediaUrl` vorhanden
- Fallback zu headline für alt-text
- Zeigt URL snippet
- Responsive, max-h-32

## Text Block NICHT geändert

- Text Block hat keine Media Fields
- Nur Hero Block bekommt Media Field (Phase 32)
- Andere Blocks können später Media Fields kriegen

## Save Flow UNVERÄNDERT

Media Props sind Teil von Block Props:

```typescript
blocks = [
  {
    id, type: "hero",
    props: {
      headline: "...",
      subline: "...",
      mediaAssetId: "uuid",
      mediaUrl: "https://...",
      mediaAlt: "..."
    }
  }
]

// Bestehender savePageDraft() speichert alles
```

Keine neue Persistenzschicht.

## Bekannte Grenzen (Absichtlich)

- ❌ Kein Upload UI
- ❌ Keine Storage Provider (S3, Supabase, etc.)
- ❌ Keine Image Optimization (Next Image)
- ❌ Keine Gallery (Multi-Select)
- ❌ Keine Public Web Rendering
- ❌ Keine Media in anderen Blocks
- ❌ Keine Image Cropping
- ❌ Keine Drag & Drop

Alles kommt Phase 33+.

## Code Quality

- ✅ TypeScript vollständig getypt
- ✅ ESLint clean (mit img tag comment)
- ✅ Keine Warnungen
- ✅ Tenant isolation enforced
- ✅ Zero Runtime im Client
- ✅ Transparent object patching

## Migration Path für Phase 33

### Public Web Rendering

```typescript
// apps/web/src/components/hero.tsx
const heroProps = block.props
if (heroProps.mediaUrl) {
  return (
    <section>
      <img src={heroProps.mediaUrl} alt={heroProps.mediaAlt} />
      <h1>{heroProps.headline}</h1>
    </section>
  )
}
```

### Media Field in anderen Blocks

```typescript
// Feature Block
defaultProps: {
  mediaAssetId: null,
  headline: "",
  description: "",
},
inspectorFields: [
  { key: "mediaAssetId", label: "Feature Image", type: "media" },
  // ...
]
```

## Summary

Phase 32 etabliert:

- ✅ Media field type im Inspector System
- ✅ MediaPicker Integration in Field Renderer
- ✅ Object Patch System für Multi-Prop Fields
- ✅ Hero Block mit optionalem Image
- ✅ Admin Preview zeigt Bild
- ✅ tenantId Threading (safe)
- ✅ Save Flow unverändert
- ✅ Raw Props zeigt Media Metadata
- ✅ Vollständig dokumentiert

**Nächste Phase**: Public Web Rendering mit Media URLs.
