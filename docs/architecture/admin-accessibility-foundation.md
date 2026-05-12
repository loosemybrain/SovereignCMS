# Admin Accessibility Foundation (Phase 36)

## Zielbild

Accessibility wird als Plattform-Eigenschaft des Adminbereichs behandelt. Statt punktueller Fixes werden die zentralen UI-Primitives und Kern-Flows gehaertet, damit neue Features automatisch mit besseren Accessibility-Standards starten.

## Kernprinzipien

- **Primitives zuerst**: `AdminButton`, `AdminInput`, `AdminTextarea`, `AdminSelect`, `AdminField`.
- **Sichtbarer Fokus**: Einheitlicher `admin-focus-ring` fuer Keyboard-Navigation.
- **Saubere Form-Semantik**: Label-Input-Verknuepfung ueber `id`/`htmlFor`.
- **Hilfetexte und Fehler**: `aria-describedby` + `aria-invalid`.
- **Status-Kommunikation**: `aria-live="polite"` fuer Success/Status, `role="alert"` fuer Fehler.
- **Keyboard-Bedienbarkeit**: Selektierbare Block-Cards und Media-Auswahl ueber echte Buttons bzw. Enter/Space.

## Neue Utilities

**Datei**: `apps/admin/src/lib/a11y.ts`

- `getDescribedBy(ids)` baut aus optionalen IDs eine gueltige `aria-describedby`-Zeichenkette.
- `createFieldIds(baseId)` liefert konsistente IDs fuer Input, Beschreibung und Fehler.

## Admin UI Primitives

- `AdminButton` nutzt echtes `button`, hat Default `type="button"` und sichtbaren Focus Ring.
- `AdminInput`/`AdminTextarea`/`AdminSelect` bleiben native Controls und nehmen ARIA-Attribute direkt durch.
- `AdminField` kapselt wiederverwendbar:
  - Label
  - Description
  - Error
  - automatisches Durchreichen von `id`, `aria-describedby`, `aria-invalid`.

## Gehärtete Flows

- **Create Page Form**
  - Felder ueber `AdminField`
  - Success mit `aria-live`
  - Error mit `role="alert"`
- **Create Navigation Item Form**
  - Label/Type/Page/Href ueber `AdminField`
  - Error/Success fuer Screenreader verstaendlich
- **Create Media Asset Form**
  - Alle Felder ueber `AdminField`
  - Error/Success zugreifbar gemacht
- **Editor / Inspector**
  - klare Section-Heading-Struktur
  - Empty State "No block selected" explizit
  - Save- und Fehlerstatus textlich + ARIA kommuniziert
- **MediaPicker**
  - Asset-Auswahl ueber echte Buttons
  - Selection ueber `aria-pressed` + Text "Selected"
  - Loading/Empty/Error verstaendlich und semantisch ausgezeichnet
- **Sidebar**
  - `nav` mit `aria-label`
  - aktive Route ueber `aria-current="page"`

## Kontrast und Tokens

In den Admin Theme Tokens wurden `admin-text-muted` und `admin-border` leicht gehaertet, damit Lesbarkeit und Trennung in Light/Dark robuster sind.

## Ausdruecklich nicht enthalten

- Kein vollstaendiger BITV/WCAG-Audit.
- Keine externe Accessibility-Library.
- Kein Shortcut- oder Command-Palette-System.
- Kein Accessibility-Overlay.

Phase 36 liefert die Grundlage; tiefergehende Audits und Interaktionsmuster folgen in spaeteren Phasen.
