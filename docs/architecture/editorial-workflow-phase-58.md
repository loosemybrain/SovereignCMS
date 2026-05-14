# Editorial workflow & action cohesion (Phase 58)

**Erweiterte Governance:** siehe [`editorial-action-system-phase-58.md`](./editorial-action-system-phase-58.md) (Aktions-Hierarchie, Sticky, Fokus, Tastatur, Inspector).

## Intent

Phase 58 aligns the **page editor** around a coherent **editorial workflow**: Speichern (Entwurf) oben, Status-Metadaten in der Mitte, **Veröffentlichung / Archiv / Wiederherstellen** unten — mit einheitlicher deutscher Redaktionssprache, klarer Beschriftung der Workflow-Zone und konsistenten Screenreader-Texten.

## Rules

- **Keine Änderung** der Übergangslogik (`getAvailableActionsForStatus`, Persistence, Server Actions).
- **Keine Änderung** der englischen Kern-Labels in `@sovereign-cms/core` (`getContentStatusLabel`, `getTransitionActionLabel`) — die Admin-Oberfläche mappt für die Editor-Ansicht in `apps/admin/src/lib/editor-action-labels.ts`.
- Visuelle Kohärenz über die Klassen **`admin-editor-workflow-foot`**, **`admin-editor-workflow-intro`**, **`admin-editor-workflow-actions`** in `admin-surface-system.css`.

## Copy & hierarchy

1. **Oben (Toolbar-Sticky):** „Entwurf und Speichern“ + erklärender Satz; primärer Button **Speichern** mit `aria-label`.
2. **Meta-Panel:** deutsche Spaltenüberschriften (zuletzt gespeichert, Stand nach Speichern, Seitenstatus mit **deutscher Statusanzeige**).
3. **Footer:** Überschrift „Veröffentlichung“, Kurztext zum nächsten Schritt; Aktionsbuttons mit **`aria-label`** = sichtbarer Text (`getEditorTransitionActionLabel`).

## Block-Karten

- Auswahl- und Einfüge-Aktionen: deutsche `aria-label` und Button-Text **„Danach einfügen“**.

## Referenz

- Implementierung: `editor-toolbar.tsx`, `page-editor-client.tsx`, `editor-block-card.tsx`, `editor-action-labels.ts`, `admin-surface-system.css` (Phase-58-Abschnitt).
