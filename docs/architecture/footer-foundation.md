# Footer Foundation

## Überblick

Der öffentliche Footer ist eine **read-only** Darstellung aus bestehenden Datenquellen. Es gibt keinen Footer Builder, keine Theme-Presets für den Footer und keine Consent-Integration in dieser Phase.

## Datenquellen

- **TenantSettings** (`siteIdentity`, `contact`, `socialLinks`, `legal`) liefern Marken-/Kontaktinformationen, Social Links und die Legal-Slugs.
- **Public Navigation** wird bereits als ViewModel mit `label` und `href` aufgelöst; dieselben Einträge werden als Footer-Navigation übergeben (Duplikat der Hauptnavigation im Footer ist beabsichtigt für diese Phase).
- **Legal Settings** (`imprintSlug`, `privacySlug`, `cookieSlug`) werden zu **locale-aware** Pfaden zusammengesetzt: `/{locale}/{slug}`. Leere Slugs erzeugen keine Links.

## Serialisierung

`PublicFooterViewModel` enthält nur primitive/strukturierte, serialisierbare Felder. Es werden keine Runtime-Instanzen an Client Components übergeben.

## Social Links

`socialLinks` sind strukturiert und werden im Footer gerendert, sobald Daten vorhanden sind. Eine Bearbeitung im Admin folgt später.

## Grenzen (bewusst)

- Kein Footer Builder oder Drag & Drop.
- Keine Cookie-Banner- oder Consent-Logik im Footer.
- Keine API Routes oder Datenbankzugriffe aus der Public-Komponente; Laden erfolgt serverseitig über bestehende Loader und Persistence.
