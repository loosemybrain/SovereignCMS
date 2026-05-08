# Admin Design System

## Ziel

Phase 29 konsolidiert ein kleines, wiederverwendbares Admin Design System auf Basis der bestehenden Appearance-Tokens.

## Appearance Tokens vs UI-Komponenten

- **Appearance Foundation (Phase 28)** liefert Theme-Tokens (`--admin-*`) und `data-theme`.
- **Design System (Phase 29)** liefert wiederverwendbare UI-Primitives, die diese Tokens konsistent nutzen.

Damit bleiben Theme-Definition und Komponentenstruktur sauber getrennt.

## Admin UI Primitives

Im Ordner `apps/admin/src/components/admin-ui`:

- `AdminCard`
- `AdminButton`
- `AdminInput`
- `AdminTextarea`
- `AdminSelect`
- `AdminEmptyState`
- `AdminPageHeader`
- `AdminBadge`

Exportiert über:

- `apps/admin/src/components/admin-ui/index.ts`

## Verwendung im Admin

Die zentralen Bereiche nutzen die Primitives bereits schrittweise:

- Dashboard
- Pages Übersicht
- Navigation Übersicht
- Create Forms
- Teile des Editors / Inspectors
- Status-Badge intern über `AdminBadge`

Wichtig: Das ist eine **inkrementelle Migration**, keine Vollumstellung aller Klassen in einem Schritt.

## Scope

Nur Admin:

- Keine Public Website Styles geändert
- Keine Legacy App Änderungen
- Keine Runtime-/Backend-Logikänderung

## Nicht Teil von Phase 29

- Theme Persistenz (User/Tenant)
- Theme Builder
- Shadcn Migration
- Neues CSS Framework

## Ausblick

Phase 30 kann fokussieren auf:

- weitere Token-/Primitive-Abdeckung in Restkomponenten
- konsistente Tabellen-/Form-Patterns
- gezielten A11y-Feinschliff bei Kontrast und Fokuszuständen
