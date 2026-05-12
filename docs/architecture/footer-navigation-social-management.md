# Footer Navigation & Social Management

## NavigationScope

`NavigationScope` ist `"main"` oder `"footer"`:

- **main**: Hauptnavigation für Header / Public Header Mapping (wie zuvor die einheitliche Navigation).
- **footer**: eigene Liste nur für den Public Footer.

Pro Tenant, Locale und Scope gilt eine eigene **sortOrder**-Sequenz und eine **eindeutige Label**-Prüfung (case-insensitive).

## Separate Footer Navigation

Footer-Links werden über dieselbe Navigation-Persistence geladen, jedoch mit `scope: "footer"`. Die Public-Auflösung (`resolveNavigation`) filtert entsprechend; der Header nutzt weiterhin **`scope: "main"`** (Default).

## Public Footer

- **Footer Navigation** liefert die Einträge für den Bereich „Footer navigation“ im ViewModel.
- **Legal Links** kommen weiterhin aus **TenantSettings.legal** (Slugs → locale-aware Pfade).
- Kommen dieselben **href**-Werte in Footer-Navigation und Legal vor, werden die Footer-Navigation-Einträge für diese URLs **ausgelassen**, damit keine doppelten Links erscheinen.

## Social Links

Social Links sind Teil von **TenantSettings.socialLinks** (`id`, `label`, `href`). Im Admin können sie minimal verwaltet werden; es gibt **keine** Icon-Auswahl und **keine** Sortier-UI außer Array-Reihenfolge.

## Grenzen (bewusst)

- Kein Footer Builder, keine verschachtelten Spalten, kein Drag & Drop.
- Keine echte DB-Persistenz im Demo-/InMemory-Setup (`persisted: false` bleibt korrekt).
- Keine API Routes und kein fetch für diese Phase.
