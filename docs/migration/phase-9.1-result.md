# Phase 9.1 – Ergebnis (Local Block Editing)

## Was geändert wurde

- **`useEditorState`** erweitert: `isDirty`, `setIsDirty`, `useEffect` zum Zurücksetzen bei neuen `initialBlocks`
- **`mergeProps`** Utility erstellt für rekursives Merging von Props
- **`EditorInspector`** vollständig neu: Input-Felder für Hero (`headline`, `subline`) und Text (`body`), mit `onUpdateProps` Callback
- **`page-editor-client.tsx`**: `updateBlockProps` Funktion, die Draft-Blocks mutiert und `isDirty` setzt
- **Dirty Indicator** im Header (Amber-Text bei Änderungen)

## Unterstützte Bearbeitungstypen

| Blocktyp | Editierbare Props |
| -------- | ------------------|
| `hero`   | `headline`, `subline` |
| `text`   | `body` |

Andere Typen: Fallback-Meldung im Inspector.

## Verhalten

1. **Auswahl**: Klick auf Block in der Liste → Inspector wird aktualisiert
2. **Bearbeitung**: Input-Felder ändern → `updateBlockProps` wird aufgerufen → `draftBlocks` wird mutiert → `isDirty = true`
3. **Anzeige**: Block Preview im Edit-Block zeigt neue Props sofort (via `renderAdminBlock`)
4. **Dirty Indicator**: Header zeigt **„Ungespeicherte Änderungen"** in Amber

## Grenzen (Vorsatz)

- **Keine Persistenz**: Änderungen werden bei Seiten-Reload verworfen
- **Keine API-Calls**: Kein Save-Button, kein Speichern in DB
- **Keine Validierung**: Keine Schema-Validierung der Props
- **Kein Undo/Redo**: Nur lokale Bearbeitung ohne History

## Nächste Phase (10)

Phase 10 sollte ein **Save-Button** mit API-Integration einführen, der:
1. `draftBlocks` gegen die DB speichert
2. Nach erfolgreichem Save `isDirty = false` setzt
3. Fehlerbehandlung mit Notification

## Dokumentation

- `docs/architecture/block-editing-local.md` – Architektur-Übersicht
- `docs/migration/phase-9.1-result.md` – diese Datei
