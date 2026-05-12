# Phase 37 — Editor Workflow Consolidation — Ergebnis

## Geaenderte Dateien

- `apps/admin/src/components/page-editor-client.tsx`
- `apps/admin/src/components/block-palette.tsx` (auf neue Editor-Palette umgeleitet)
- `apps/admin/src/components/editor/editor-toolbar.tsx` (neu)
- `apps/admin/src/components/editor/block-toolbar.tsx` (neu)
- `apps/admin/src/components/editor/editor-block-card.tsx` (neu)
- `apps/admin/src/components/editor/block-palette.tsx` (neu)
- `apps/admin/src/components/editor-inspector.tsx` (visuelle/semantische Trennung aus 36.x beibehalten)
- `docs/architecture/editor-workflow-consolidation.md` (neu)

## Konsolidierung

- Save-Bereich aus `PageEditorClient` in `EditorToolbar` ausgelagert.
- Blockaktionen in `BlockToolbar` standardisiert.
- Blockdarstellung in `EditorBlockCard` vereinheitlicht.
- Palette klarer strukturiert und mit Insert-Hinweis erweitert.

## Insert Position UX

- Neuer lokaler State `insertAfterBlockId`.
- "Insert after" pro Block setzt die Einfuegeposition.
- Palette zeigt den aktiven Einfuegemodus und erlaubt Reset.
- Add-Block-Logik fuegt nach Zielblock oder am Ende ein.
- Reihenfolge bleibt nach Insert ueber `normalizeBlockOrder` konsistent.

## Bekannte Grenzen

- Kein Drag & Drop
- Kein Autosave
- Kein Undo/Redo
- Keine kollaborative Bearbeitung
- Keine Upload-/Publishing-Workflow-Erweiterung

## Empfehlung fuer Phase 38

- Feineres visuelles Feedback fuer Insert-Zielposition im Block-Stack.
- Optional spaeter: behutsame DnD-Einfuehrung auf Basis der jetzt getrennten Block-Komponenten.
