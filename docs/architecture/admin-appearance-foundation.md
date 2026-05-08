# Admin Appearance Foundation

## Ziel

Phase 28 fuehrt ein Admin-only Appearance-Grundgeruest ein, damit Dark/Light spaeter sauber erweitert werden kann.

## Architektur

- `AdminAppearance` Typ: `dark | light`
- Default: `dark`
- Clientseitiger `AdminAppearanceProvider`
- `data-theme` wird auf `admin-theme-root` gesetzt
- Toggle im Admin-Header

Wichtig: Keine Persistenz in dieser Phase.

## Theme Scope

Das System gilt nur fuer den Admin-Bereich:

- Provider umschliesst `AdminShell` im Admin-Layout
- CSS-Variablen sind auf `.admin-theme-root` scoped
- Public Web App wird nicht angepasst

## CSS Tokens

Dark und Light Tokens liegen in `apps/admin/src/app/globals.css`:

- `--admin-bg`
- `--admin-surface`
- `--admin-surface-muted`
- `--admin-border`
- `--admin-text`
- `--admin-text-muted`
- `--admin-accent`
- `--admin-accent-muted`
- `--admin-danger`
- `--admin-success`

Utility-Klassen:

- `admin-bg`
- `admin-surface`
- `admin-surface-muted`
- `admin-border`
- `admin-text`
- `admin-text-muted`
- `admin-accent`
- `admin-accent-bg`

## Accessibility

Der Toggle ist:

- ein echtes `button` Element
- mit `aria-label="Toggle admin appearance"`
- mit sichtbarem Text (`Light`/`Dark`)
- mit erkennbarem Focus-State

## Grenzen in Phase 28

Nicht enthalten:

- User-Preference Persistenz
- Tenant-spezifische Theme-Einstellungen
- Theme-Builder/Presets
- Public Theme Integration

## Naechste Schritte

Spaeter moeglich:

- Persistenz (User/Tenant Settings)
- serverseitiges Initial-Appearance-Mapping
- feinere Komponenten-Tokenisierung
