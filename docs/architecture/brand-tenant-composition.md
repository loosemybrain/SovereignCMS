# Brand & Tenant Composition Foundation (Phase 41)

## Ziel

Phase 41 fuehrt eine kontrollierte Kompositionsschicht ein, die Defaults zwischen Brand, Tenant und Admin-Flows zusammenfuehrt.

## Composition Types

In `packages/core/src/composition.ts`:

- `BrandCompositionDefinition`
- `TenantCompositionDefinition`

Die Typen definieren Metadaten fuer:

- erlaubte Templates
- Default-Template
- Theme-Preset-Default
- Navigation-Default (vorbereitet)
- Locale-Defaults

## Composition Registries

Lokale statische Registries:

- `apps/admin/src/composition/brand-compositions.ts`
- `apps/admin/src/composition/tenant-compositions.ts`

Wichtig:

- Die `tenantId` in der Tenant-Composition muss mit dem AdminTenantResolver/InMemory-Tenant uebereinstimmen (z. B. `demo`).
- Fuer den Demo-Stack ist eine eigene Demo-Brand/Tenant-Composition mit `de` und `en` hinterlegt.

Noch keine Runtime-Persistenz, keine DB-Anbindung.

## Composition Merge

`apps/admin/src/lib/resolve-tenant-composition.ts` fuehrt Tenant- und Brand-Definitionen zusammen.

Defensive Fallbacks:

- Template: `empty-page-template`
- Locales: `["de"]`
- Brand-ID: `"generic"` wenn keine Zuordnung existiert

## CreatePage Integration

`CreatePageForm` nutzt die aufgeloeste Composition fuer:

- Template Availability (nur erlaubte Templates sichtbar)
- Default Template Vorauswahl
- Locale-Auswahl basierend auf `enabledLocales`
- Default Locale Vorbereitung

Damit steuert `enabledLocales` direkt die verfuegbaren Locale-Optionen im Create-Formular.
`supportedLocales` aus der Runtime und Composition-Locales sind aktuell bewusst getrennte Ebenen und koennen spaeter zusammengefuehrt werden.

Ab Phase 42 wird die effektive Locale-Auswahl defensiv als Schnittmenge aus beiden Quellen gebildet:

- RuntimeConfig liefert globale `supportedLocales` und `defaultLocale`.
- Composition liefert tenant-/brand-spezifische `enabledLocales` und `defaultLocale`.
- UI zeigt nur runtime-supported Locales.
- `defaultLocale` wird normalisiert, sodass es immer in den effektiven `enabledLocales` enthalten ist.
- Composition darf weiterhin vorbereitend mehr Locales enthalten; nicht unterstuetzte Werte werden als `droppedLocales` markiert.

## Theme and Navigation Defaults

`defaultThemePresetId` und `defaultNavigationId` sind strukturell vorbereitet und im Debug-Flow sichtbar.
Eine automatische Runtime-Anwendung ist bewusst noch nicht Teil dieser Phase.

## Nicht Teil dieser Phase

- keine Runtime Enforcement Layer
- keine Permission-Engine
- keine Cross-Tenant Sharing Engine
- keine Dynamic Theme Engine
- keine API/FETCH-basierte Composition-Aufloesung
