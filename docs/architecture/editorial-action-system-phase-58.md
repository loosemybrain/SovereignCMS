# Editorial Action System — Phase 58

Referenz für **Aktions-Hierarchie**, **Sticky-Verhalten**, **Fokus**, **Tastatur** und **Inspector-Ergonomie** in der SovereignCMS-Admin-Oberfläche. Ergänzt die Surface-Systematik (Phase 57) und die redaktionelle Ausrichtung (Phase 56). Kein Ersatz für Server-Logik oder Datenmodelle.

## 1. Primäre Aktionen

- **Eine primäre Aktion pro Arbeitsregion** (z. B. Seiten-Editor: *Speichern* im oberen Rail; Veröffentlichen/Archiv im Workflow-Footer).
- Primär = höchste sichtbare Gewichtung (Variant `primary`, ausreichend Kontrast, nicht von mehreren konkurrierenden Verläufen umgeben).
- **Speichern** und **Veröffentlichen** bleiben fachlich getrennt, wirken aber **typografisch und räumlich verwandt** (gemeinsames Action-Rail, einheitliche Button-Höhen/Small-Size im Footer).

## 2. Sekundäre Aktionen

- Variant `secondary` / `ghost` für Hilfsaktionen (Verschieben, Kontext, „Danach einfügen“).
- Keine gleiche visuelle Stärke wie Primär; **ruhigere** Flächen (`admin-surface-toolbar-well`).

## 3. Destruktive Aktionen

- Immer **gruppiert und abgesetzt** (eigener Button, `destructive`, nicht in der Mitte einer Icon-Leiste ohne Text).
- Kein Hover-only: immer **Tastatur und Screenreader** bedienbar (`aria-label`).

## 4. Sticky-Philosophie

- **Topbar** (`z-index` höchste Ebene im Haupt-Layout): globale Orientierung.
- **Editor-Action-Rail** (innerhalb des Scrollbereichs): Sticky-Zeile **unterhalb** der Topbar-Höhe — `z-index` niedriger als Topbar, konsistent innerhalb des Main-Scrollports.
- **Inspector-Spalte** (`lg:sticky`): eigener **mittlerer** `z-index`, damit Karten beim vertikalen Scroll nicht mit Rail kollidieren.
- Kein zweites „schwebendes“ Panel-System; nur **CSS-Sticky** auf bestehenden Containern.

## 5. Editorial Focus

- Fokus sichtbar: **`admin-focus-ring`** auf interaktiven Controls; Block-Karten nutzen **`admin-editor-block-selectable`** für klares `:focus-visible` ohne doppelte Ring-Konkurrenz zur Auswahloptik.
- Auswahl (`aria-pressed`) und Tastaturfokus sind **getrennt konzipiert**, aber visuell nicht widersprüchlich.

## 6. Auswahl-Zustände

- **Ausgewählt**: eine klare Kante / dezenter Verlauf (`admin-block-card-selected`), keine zusätzlichen „Glow“-Schichten.
- **Hover (nicht ausgewählt)**: `admin-surface-block-card` — einheitlicher Lift.
- **Einfügemarke**: `admin-insert-target-ring` — klar von Auswahl unterscheidbar.

## 7. Tastatur

- **Skip-Link** „Zum Inspector springen“ am Seiten-Editor (fester Fokus bei `:focus`, kein Hover-only).
- Tab-Reihenfolge: Hauptinhalt → Inspector; keine Fallen in Toolbars (Buttons mit `type="button"`).
- Lange Listen: Fokus in Feldern nicht durch `overflow: hidden` verstecken — Inspector-Scroll mit **`scroll-padding`**.

## 8. Aktions-Gruppierung

- Workflow-Footer: **`admin-editor-workflow-foot`** (Intro + **`admin-editor-workflow-actions`**).
- Block-Toolbar: **`admin-surface-toolbar`** + **`admin-surface-toolbar-well`** für Untergruppen.
- Topbar-Aktionen: **`admin-topbar-actions`** (einheitliche Abstände).
- Seiten-Header-Aktionen: **`admin-page-header-actions`**.

## 9. Toolbar-Dichte

- Padding über **`--admin-toolbar-pad-x` / `--admin-toolbar-pad-y`**; `sm` / `icon`-Buttons dort, wo Platz knapp ist.

## 10. Inspector-Ergonomie

- Abschnitte: **`admin-inspector-section`**, Inhalte **`admin-inspector-stack`** (kompaktere vertikale Rhythmik als früher `space-y-5`).
- **Governance-Hinweise** nach den **Feld-Sektionen**, Validierungssummary weiter oben — Redakteure sehen zuerst bearbeitbare Felder.
- Feldgruppen / Simple-List: **`admin-inspector-field-group`** für wiedererkennbare, ruhige Gruppenflächen.
- Debug/Raw: weiter **`admin-inspector-debug`** — visuell zurückgenommen.

## 11. Badges & Chips

- Badges nur, wo **Status** transportiert wird; keine dekorativen „Chip-Wände“.
- Dichte über zentrale Badge-Tokens (Phase 57); keine zusätzlichen Ringe um Meta-Pills ohne Semantik.

## Verknüpfung

- Umsetzung: `apps/admin/src/styles/admin-surface-system.css`, `admin-visual-governance.css`, `editor-toolbar.tsx`, `page-editor-client.tsx`, `editor-inspector.tsx`, `editor-block-card.tsx`, `inspector-section.tsx`, `admin-field-group.tsx`, `admin-page-header.tsx`, `admin-topbar.tsx`.
