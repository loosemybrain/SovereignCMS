# Phase 10 – Ergebnis (Save Flow Foundation)

## Was geändert wurde

- **`SavePageDraftInput`**, **`SavePageDraftResult`** in `packages/core/src/editor.ts` definiert
- **`EditorPersistence`** Interface in `packages/core/src/editor-persistence.ts`
- **`mockEditorPersistence`** in `apps/admin/src/lib/mock-editor-persistence.ts` (500ms Mock-Speicher)
- **`useEditorState`** erweitert um `isSaving`, `setIsSaving`, `lastSavedAt`, `setLastSavedAt`
- **`handleSave()`** Funktion in `page-editor-client.tsx` mit Mock-Aufruf
- **Save-Button** im Header (aktiv nur wenn `isDirty && !isSaving`)
- **Status-Anzeige** (Speichert..., Ungespeicherte Änderungen, Zuletzt gespeichert...)

## Persistenz-Architektur

```
Editor (PageEditorClient)
    ↓
EditorPersistence Interface
    ↓
Mock Adapter (console.log)
    ↓
[Future] HTTP API
[Future] Runtime.db Direct
```

## Verhalten

1. **Bearbeiten**: Props ändern → `isDirty = true`
2. **Status**: Header zeigt „Ungespeicherte Änderungen"
3. **Speichern**: Button aktiviert → Klick → `handleSave()`
4. **Mock-Speicher**: 500ms Verzögerung, Konsole loggt
5. **Nach Save**: `isDirty = false`, `lastSavedAt` aktualisiert

## Grenzen (Vorsatz für Phase 10)

- ✗ Keine echte Persistierung
- ✗ Keine API Route
- ✗ Keine Supabase
- ✗ Keine Server Actions
- ✓ Isolierte Mock-Schicht
- ✓ Contract-basiert (erweiterbar)

## Nächste Phase (11)

Phase 11 sollte:

1. **API Route** `/api/admin/pages/[pageId]/draft` anlegen
2. **`HttpEditorPersistence`** implementieren
3. **Save-Fehlerbehandlung** mit Notification/Toast
4. **Optionales Rollback**: Bei Fehler können Draft-Blocks auf Server-State zurück

## Dokumentation

- `docs/architecture/editor-save-flow.md` – Architektur-Übersicht
- `docs/migration/phase-10-result.md` – diese Datei
