# Reusable Editor Patterns (Phase 39)

## Zweck

Die Editor-UI wird mit wiederverwendbaren Pattern-Komponenten modularisiert, damit Inspector-, Status- und Hint-Darstellungen konsistent bleiben und nicht erneut auseinanderlaufen.

## Abgrenzung zu `admin-ui`

- **`admin-ui` Primitives**: generische Bausteine (`AdminCard`, `AdminButton`, `AdminInput`, ...)
- **`editor/patterns`**: editor-spezifische Kompositionsbausteine auf Basis der Primitives

## Neue Pattern-Komponenten

- `EditorSection`
  - semantische Section mit Heading, optionaler Beschreibung und optionalen Actions
- `EditorPanel`
  - leichter visueller Container mit Varianten (`default`, `muted`, `accent`, `danger`)
- `InspectorSection`
  - strukturierter Inspector-Abschnitt mit `aria-labelledby`
- `FieldGroupPanel`
  - standardisierte Darstellung fuer Feldgruppen im Inspector
- `EditorHint`
  - konsistente Hinweis-Komponente mit Tones (`info`, `warning`, `success`, `danger`)
- `EditorStatusPanel`
  - wiederverwendbare Statusdarstellung als semantische `dl`-Liste
- `EditorValidationSummary`
  - nicht-blockierende Fehlerzusammenfassung fuer lokal validierte Felder

## Migration in dieser Phase

- `EditorInspector` nutzt `InspectorSection`, `FieldGroupPanel`, `EditorValidationSummary`, `EditorHint`
- `EditorToolbar` nutzt `EditorHint` und `EditorStatusPanel`
- `PageEditorClient` nutzt `EditorSection` fuer Status- und Blockbereiche
- `BlockPalette` nutzt `EditorHint` fuer Insert-Position-Hinweise

## Accessibility

Patterns halten bestehende Accessibility-Regeln aufrecht:

- klare Section-Headings und `aria-labelledby`
- Alerts bei kritischen Hinweisen (`danger`)
- lesbare Statusdarstellung statt reiner Farbkommunikation
- Validation Summary kann optional Feldanker (`fieldId`) nutzen, um direkt zu betroffenen Feldern zu springen

## Debug-Bereiche

- Raw Props und Raw SEO bleiben bewusst erhalten.
- Sie sind als **Debug Preview** gekennzeichnet und visuell zurueckgenommen.

## Wichtig

Editor Patterns sind bewusst **keine Feature-Systeme**:

- keine Accordions/Tabs in Phase 39.1
- keine neue Validation-Engine
- keine Workflow-Automatisierung

## Nicht Teil dieser Phase

- keine neuen Editor-Features (kein DnD, kein Autosave, kein Undo/Redo)
- keine neue Validation-Engine
- keine Public-App-Aenderungen
