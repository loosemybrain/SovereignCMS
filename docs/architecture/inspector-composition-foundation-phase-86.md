# Inspector Composition Foundation (Phase 86)

## Zweck

Phase 86 führt **statische Inspector-Composition-Contracts** in `@sovereign-cms/core` ein. Sie beschreiben, welche **semantischen Inspector-Gruppen** pro Blocktyp existieren dürfen — ohne Felder, ohne UI-Generierung, ohne Schema-Engine.

Ziele:

- Redakteure sehen, welche Bereiche (Inhalt, Medien, Governance, Vorschau, …) für einen Blocktyp relevant sind.
- Editor Surfaces (Phase 80) können optional auf Inspector-Gruppen gemappt werden.
- Admin-Hints liefern **reine UX-Guidance** — keine Enforcement-, Sicherheits- oder Publish-Blocking-Logik.

## Abgrenzung

| Schicht | Rolle |
|---------|--------|
| **BLOCK_EDITOR_CONTRACTS** (80) | Welche Editor Surfaces ein Block nutzen darf |
| **BLOCK_INSPECTOR_COMPOSITION_CONTRACTS** (86) | Welche Inspector-Gruppen semantisch geordnet sind |
| **BLOCK_GOVERNANCE_CONTRACTS** (81) | Veröffentlichungsrelevante Concerns |
| **Preview Isolation** (82) | Vorschau vs. öffentliche Runtime |
| **Runtime Validation** (83) | Statische Laufzeit-Semantik pro Blocktyp |
| **Runtime Composition / Boundary** (84–85) | Transiente Composition und defensive Grenzen |

Inspector Composition **ersetzt keine** dieser Verträge und **generiert keinen Inspector**.

## Warum keine Schema Engine

- Felder und Renderer bleiben explizit pro Blocktyp registriert (`block-field-registry`, Inspector-Komponenten).
- Contracts sind **deklarativ und statisch** — deterministisch, ohne JSON-Schema, ohne Reflection.
- Automatische Tab- oder Feld-Erzeugung würde versteckte Fallbacks und UI-Framework-Abhängigkeiten einführen.

## Warum keine automatische Inspector-Generierung

Der Inspector bleibt handgebaut. Gruppen dienen nur der **semantischen Harmonisierung** und Hinweis-Aggregation — nicht der Layout-Erzeugung. Neue Blöcke erhalten Gruppen durch einen expliziten Eintrag in `BLOCK_INSPECTOR_COMPOSITION_CONTRACTS`, analog zu Editor- und Governance-Contracts.

## Unknown Blocks

- Kein Contract → `undefined`
- `getBlockInspectorGroups` → `[]`
- `hasBlockInspectorGroup` / `isInspectorGroupAllowed` → `false`
- Keine Inferenz aus Feldern oder Props

## Editor-Surface-Mapping

`mapEditorSurfaceToInspectorGroup(surface)` mappt z. B. `external-media` → `media`. Es erzeugt **keine** zusätzlichen Gruppen; unbekannte Surfaces → `undefined`.

## Admin-Hints

`block-inspector-composition-hints.ts` leitet höchstens **einen** Gruppen-Hinweis ab (Priorität: governance → preview → media → …), mit Deduplizierung gegen Capability-, Surface-, Governance-, Preview- und Runtime-Validation-Hints.

Integration: `editor-selected-block-context.tsx`, `publish-governance-panel.tsx` — rein informativ.

## Anti-Patterns (verboten)

- Automatische Inspector-Generierung
- JSON-getriebene UI / schema-based field rendering
- Runtime Reflection
- UI Plugin Registry / Dynamic Form Engine
- Inspector-Logik in Public Renderern
- Governance Enforcement oder Publish Blocking aus Inspector-Gruppen
- Globale Runtime Policy Engine
