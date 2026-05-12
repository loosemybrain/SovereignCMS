# Admin Accessibility Hardening (Phase 36.1)

## Fokus dieser Phase

Phase 36.1 haertet die bereits eingefuehrte Accessibility-Basis gezielt nach, ohne neue Feature-Architektur einzufuehren.

## Editor Announcements

- Neuer Hook: `apps/admin/src/lib/use-editor-announcements.ts`
- Neue Live Region: `apps/admin/src/components/editor-live-region.tsx`
- Im `PageEditorClient` werden zentrale Aktionen fuer Screenreader angekuendigt:
  - Block selected
  - Block added
  - Block moved up/down
  - Block deleted
  - Save success / Save failed

## Semantische Regionen

Im `PageEditorClient`:

- Preview-Bereich: `role="region"`, `aria-label="Page blocks preview"`
- Inspector-Bereich: `role="region"`, `aria-label="Inspector"`
- Blockliste: `role="list"` + `role="listitem"` pro Block
- Blockauswahl bleibt keyboard-bedienbar (Enter/Space)

## MediaPicker Hardening

Im `MediaPicker`:

- Assetliste bleibt semantisch als Liste strukturiert
- Asset-Zustand wird ueber `aria-selected` und sichtbaren Text kommuniziert
- Select-Buttons sind echte Buttons mit `aria-pressed`
- Loading bleibt `aria-live="polite"`
- Error bleibt `role="alert"`
- Empty State bleibt klar textlich kommuniziert

## Inspector Semantik

`EditorInspector` wurde ohne visuelles Redesign semantisch klarer strukturiert:

- Section-Struktur mit `aria-labelledby`
- eindeutige Headings fuer:
  - Block Info
  - Block Fields
  - SEO Metadata
  - Raw Props Preview
  - Raw SEO Preview

## Grenzen (bewusst)

- Kein Focus Trap System
- Keine Arrow-Key-Navigation fuer komplexe Picker-Patterns
- Kein voller BITV/WCAG-Audit
- Keine externen Accessibility Libraries
