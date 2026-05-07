# Editor Save Flow (Draft Persistence) – Stabilisiert

## Übersicht

Der Editor speichert Änderungen über eine **isolierte Persistenz-Schicht** – nicht direkt über `runtime.db`. Datenquellen bleiben sauber getrennt.

## initialBlocks Synchronisierung

`useEditorState` nutzt **`useEffect`** zum sauberen Zurücksetzen bei neuem `initialBlocks` (z.B. neue Seite geladen):

```typescript
useEffect(() => {
  setDraftBlocks(initialBlocks)
  setSelectedBlockId(null)
  setIsDirty(false)
  setLastSavedAt(null)
  setSaveError(null)
}, [initialBlocks])
```

Dies vermeidet setState während Render und garantiert konsistenten State.

## Patch-basierte Props-Updates

Inspector sendet nur **Patches**, nicht vollständige Props:

```typescript
// Inspector:
onUpdate({ headline: e.target.value })  // Nur geänderte Felder

// PageEditorClient:
props: mergeProps(block.props, newProps)  // Merge im Handler
```

## mergeProps – Rekursiv

In `apps/admin/src/lib/merge-props.ts`:

```typescript
export function mergeProps(
  oldProps: unknown,
  newProps: unknown,
): Record<string, unknown> {
  // ...
  if (isPlainRecord(oldValue) && isPlainRecord(newValue)) {
    // Recursively merge nested objects
    result[key] = mergeProps(oldValue, newValue)
  } else {
    result[key] = newValue
  }
}
```

Handles nested Objekte, ersetzt Arrays und Primitives.

## Save Contract

`SavePageDraftInput` + `SavePageDraftResult`:

- **Input**: `{ tenantId, pageId, blocks }`
- **Result**: `{ success, savedAt, updatedBlocks? }`
- **Error**: Rote Text-Warnung im Header

## Mock Persistence (Noch immer)

`apps/admin/src/lib/mock-editor-persistence.ts`:

- Speichert **nichts wirklich**
- Simuliert 500ms Verzögerung
- Loggt auf Konsole

## Save Error Handling

State erweitert um `saveError: string | null`:

- Vor Save: `setSaveError(null)`
- Bei Fehler: `setSaveError("Speichern fehlgeschlagen")`
- UI zeigt Fehler in Rot an

## Datenfluss

```
Edit Props
    ↓
Inspector: { headline: "new" }
    ↓
pageEditorClient.updateBlockProps()
    ↓
mergeProps(old.props, { headline: "new" })
    ↓
setDraftBlocks(...), isDirty = true
    ↓
Block-Preview aktualisiert sofort
    ↓
Speichern-Button aktiviert
    ↓
handleSave() → mockEditorPersistence.savePageDraft()
    ↓
[Mock: OK]
    ↓
isDirty = false, lastSavedAt aktualisiert
```

## Wichtig: Keine Runtime Writes

- ✗ Kein `runtime.db.pages.update(...)`
- ✗ Kein `runtime.db.blocks.update(...)`
- ✓ Nur Mock-Konsole
- ✓ Vorbereitet für API in Phase 11+
