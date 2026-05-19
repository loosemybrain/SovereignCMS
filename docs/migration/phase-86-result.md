# Phase 86 – Inspector Composition Foundation

## Status

Abgeschlossen. `npm run typecheck` und `npm run lint` erfolgreich.

## Neue Dateien

| Pfad | Inhalt |
|------|--------|
| `packages/core/src/block-inspector-composition-contracts.ts` | Gruppen-Contracts für alle 7 Blocktypen, Helper, Surface-Mapping |
| `apps/admin/src/lib/block-inspector-composition-hints.ts` | Editorial Hints mit Deduplizierung |
| `docs/architecture/inspector-composition-foundation-phase-86.md` | Architektur und Anti-Patterns |
| `docs/migration/phase-86-result.md` | Dieses Dokument |

## Geänderte Dateien

| Pfad | Änderung |
|------|----------|
| `packages/core/src/index.ts` | Export Inspector-Composition-Typen und -Helper |
| `apps/admin/src/lib/admin-i18n/types.ts` | `inspectorCompositionHints` |
| `apps/admin/src/lib/admin-i18n/messages/en.ts` | EN-Hinweistexte pro Gruppe |
| `apps/admin/src/lib/admin-i18n/messages/de.ts` | DE-Hinweistexte pro Gruppe |
| `apps/admin/src/components/editor/editor-selected-block-context.tsx` | Inspector-Composition-Hint |
| `apps/admin/src/components/admin-ui/publish-governance-panel.tsx` | Inspector-Composition-Kontext-Hint |

## Neue Typen / Helper

- `BlockInspectorGroup`, `BlockInspectorCompositionContract`, `BLOCK_INSPECTOR_COMPOSITION_CONTRACTS`
- `getBlockInspectorCompositionContract`, `getBlockInspectorGroups`, `hasBlockInspectorGroup`, `isInspectorGroupAllowed`
- `mapEditorSurfaceToInspectorGroup`
- Admin: `getBlockInspectorCompositionHintKey`, `buildInspectorCompositionHintExclusions`, Mapping-Helper

## Admin-Nutzung

- Ein Hinweis pro Blockkontext (nach Runtime-Validation), dedupliziert gegen bestehende Hint-Schichten.
- Keine Änderung an `editor-inspector.tsx`, Feld-Registry oder Inspector-Sections.

## Bewusst nicht umgesetzt

- Keine dynamische Tab-/Sektions-Erzeugung
- Keine Schema- oder JSON-UI-Engine
- Keine Renderer-Änderungen
- Keine Inspector-Enforcement- oder Publish-Blocking-Logik
## Ausgeführte Checks

```text
npm run typecheck  → 15/15 erfolgreich
npm run lint       → 0 Fehler
npm run build      → erfolgreich (web + admin)
npm run sprint:finish -- --phase 86 → erfolgreich
```

## Sprint-Artefakte

- `artifacts/phase-zips/SovereignCMS-86-nur-Aenderungen.zip`
- `artifacts/phase-zips/SovereignCMS-86-repo-slim.zip`
