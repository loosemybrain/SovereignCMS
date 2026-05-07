# Local Block Editing (Draft State)

## Übersicht

Der Admin bietet **lokales Bearbeiten** von Block-Props im Draft-State – ohne sofortiges Persistieren in der Datenbank. Änderungen werden im Speicher verwaltet und sind **sofort im Block-Preview sichtbar**.

## Draft Blocks & Dirty State

- **`draftBlocks`**: Im-Speicher-Kopie der geladenen Blocks, wird beim Bearbeiten aktualisiert
- **`isDirty`**: Flag, das anzeigt, ob lokale Änderungen vorgenommen wurden
- **Initialisierung**: Beim Laden einer neuen Page werden `draftBlocks` neu gesetzt und `isDirty` zurückgesetzt

Siehe `useEditorState(initialBlocks)` in `apps/admin/src/lib/editor-state.ts`.

## Property-Merging

Die Funktion `mergeProps(oldProps, newProps)` in `apps/admin/src/lib/merge-props.ts` kombiniert alte und neue Props-Felder. Sie ersetzt nur die Felder, die neu gesetzt werden, ohne andere zu löschen.

## Inspector & Eingabe-Feldern

`EditorInspector` in `apps/admin/src/components/editor-inspector.tsx` rendert je nach Block-Type unterschiedliche Eingabe-Felder:

- **Hero**: `headline` (Text-Input), `subline` (Text-Input)
- **Text**: `body` (Textarea)
- **Fallback**: Meldung, dass kein Editor für den Typ existiert

Jede Änderung ruft `onUpdateProps(blockId, newProps)` auf, die `updateBlockProps` in `page-editor-client.tsx` triggert.

## Dirty Indicator

Im Header wird **„Ungespeicherte Änderungen"** in Amber angezeigt, wenn `isDirty === true`.

## Keine Persistenz in Phase 9.1

- Kein API-Call beim Speichern (noch kein Save-Button)
- Keine DB-Updates
- Änderungen gehen verloren, wenn die Seite aktualisiert wird
- Vorbereitung für Phase 10 (Persistenz)
