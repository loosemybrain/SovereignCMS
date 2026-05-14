# Phase 58 — Editorial Workflow & Action Cohesion — Result

## Summary

Phase 58 verbessert **redaktionellen Workflow**, **Aktions-Hierarchie**, **Sticky-Schichtung**, **Inspector-Ergonomie**, **Auswahl/Fokus** und **Tastatur-Skip** in der Admin-App — ohne neue CMS-Features, ohne Backend-/Server-Action-Änderungen, ohne neue Dependencies und ohne Änderungen an der Public-App oder an Auth-Guards.

## Governance-Dokumente

- **`docs/architecture/editorial-action-system-phase-58.md`** — maßgebliche Regeln zu Primär/Sekundär/Destructive, Sticky, Fokus, Tastatur, Toolbar-Dichte, Inspector.
- **`docs/architecture/editorial-workflow-phase-58.md`** — verweist auf das obige Dokument (Kontext aus erster Welle).

## Workflow & Aktionen

- **Speichern / Veröffentlichen:** Primäraktion *Speichern* im Editor-Rail als `size="sm"` mit gemeinsamer visueller Dichte zum Workflow-Footer (`admin-editor-save-primary`); Veröffentlichen/Archiv unverändert in der Logik, klarer getrennt unterhalb.
- **Topbar / Seiten-Header:** `admin-topbar-actions`, `admin-page-header-actions` für gleichmäßige Aktionsabstände; Topbar-`z-index` über Token (`--admin-z-sticky-topbar`), ohne Tailwind-`z-20`-Konflikt.
- **Destructive in Toolbars:** Klasse `admin-toolbar-destructive-quiet` (Block-Toolbar, Simple-List) — weiterhin destruktiv, optisch etwas ruhiger im Kontext `admin-surface-toolbar`.

## Sticky & Scroll

- **CSS-Variablen** in `admin-surface-system.css`: `--admin-z-sticky-table-head`, `--admin-z-sticky-editor-toolbar`, `--admin-z-sticky-inspector-column`, `--admin-z-sticky-topbar`, `--admin-z-skip-link`.
- **Editor-Rail:** Sticky-Zeile nutzt `--admin-z-sticky-editor-toolbar` (über `admin-visual-governance.css`).
- **Inspector-Spalte:** `admin-inspector-sticky-col` mit `--admin-z-sticky-inspector-column`; Scrollbereich `admin-inspector-scroll` mit `scroll-padding`.
- **Skip-Link:** `admin-skip-to-inspector` — „Zum Inspector springen“ (`#inspector-panel`) am Seiten-Editor.

## Inspector

- **`admin-inspector-stack`** statt großer `space-y-5`-Abstände; **`admin-inspector-section`** an Sektionswrappern.
- **Governance-Hinweise** (`Inhaltshinweise`) nach den Feld-Sektionen; Validierungssummary weiter oben.
- **Block-Info** und Leerzustände auf Deutsch; Debug-Sektionen klar als „Debug: Rohdaten …“ benannt.
- **Feldgruppen:** `admin-inspector-field-group` auf `AdminFieldGroup`.
- **Simple List:** `admin-inspector-simple-list-item`, kompaktere Abstände, deutschsprachige Labels und ARIA.

## Auswahl & Fokus (Editor)

- Block-Karte: **`admin-editor-block-selectable`** mit dediziertem `:focus-visible` (Governance); kein zusätzlicher `ring-1` bei Auswahl — weniger konkurrierende Umrandungen; linker Akzent ohne Glow.
- Visuelle Verbindung Block ↔ Inspector bleibt über Auswahlzustand + Inspector-Inhalt.

## Seiten-Polish (weniger „CRUD“-Anmutung)

- **Dashboard, Einstellungen, Navigation, Fußzeile, Medien:** Eyebrows/Titel/Beschreibungen und einige Section-Titel redaktioneller formuliert (nur Text, gleiche Datenquellen).

## Nicht geändert (Hard Rules)

- Keine Server Actions, keine API-Routes, keine Migrationen, kein `RuntimeConfig` in Client Components, keine Public-Rendering-Änderungen, keine neuen Blocktypen/Presets/Templates/AI/Command-Palette/tw-animate-css/@vercel/analytics.

## Validierung

| Befehl              | Exit | Anmerkung |
|---------------------|------|-----------|
| `npm run typecheck` | **0** | 15 Pakete (Turbo). |
| `npm run lint`      | **0** | Weiterhin 2 Admin-Warnungen (`admin-avatar` `<img>`, `create-media-asset-form` ungenutzte Konstante). |
| `npm run build`     | **0** | `apps/web` und `apps/admin` erfolgreich. |

Datum der letzten Validierung: 2026-05-11.
