# Runtime and Composition Locale Alignment (Phase 42)

## Problemstellung

Runtime und Composition liefern unterschiedliche Locale-Quellen:

- Runtime: globale `supportedLocales` und `defaultLocale`
- Composition: tenant-/brand-spezifische `enabledLocales` und `defaultLocale`

Ohne Alignment konnte die UI Locales anbieten, die runtime-seitig nicht unterstuetzt sind.

## Ansatz

`apps/admin/src/lib/resolve-composition-locales.ts` fuehrt beide Quellen zusammen.

Die Utility:

- filtert Composition-Locales gegen Runtime-`supportedLocales`
- liefert `droppedLocales` fuer nicht gueltige Composition-Werte
- normalisiert `defaultLocale` defensiv

## Ergebnisobjekt

`ResolvedCompositionLocales`:

- `enabledLocales`: effektive Locales fuer die UI
- `defaultLocale`: defensiv normalisiertes Default
- `droppedLocales`: Composition-Locales ausserhalb Runtime-Support

## Fallback-Strategie

- Wenn die Schnittmenge leer ist, werden Runtime-Codes als Fallback genutzt.
- Wenn auch diese fehlen, wird auf `runtimeDefaultLocale` bzw. `"de"` zurueckgefallen.

## Integration

- `CreatePageForm` nutzt nur `enabledLocales` aus Alignment.
- `CompositionDebugPanel` zeigt Runtime vs. Composition inkl. `droppedLocales`.

## Nicht Teil dieser Phase

- keine Middleware- oder `next-intl`-Integration
- kein Public-Routing-Umbau
- keine Runtime-Enforcement-Policies

## Admin: Slug-Normalisierung (Mini-Fix)

Beim Erstellen von Seiten im Admin werden Slugs aus dem Titel als **lowercase kebab-case** erzeugt (`apps/admin/src/lib/normalize-slug.ts`). Sonderzeichen werden entfernt oder vereinfacht; URLs bleiben konsistent kleingeschrieben. Details: `docs/migration/slug-normalization-fix.md`.
