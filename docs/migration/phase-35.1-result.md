# Phase 35.1 — Public Locale + Navigation Link Hardening

## Ergebnis

- Public Catch-All Route liest Locale aus URL-Segmenten.
- Fallback ohne Locale-Präfix nutzt `defaultLocale` aus Runtime Config.
- Slug-Fallback bleibt `home`.
- Public Navigation rendert nur slug-basierte interne hrefs.
- `preview=1` bleibt bei internen Links erhalten.
- Externe Links werden nicht verändert.
- Public Blocks werden auf `visibility === "visible"` gefiltert.

## Technische Änderungen

- `apps/web/src/lib/public-route-locale.ts` (neu):
  - `resolvePublicLocaleAndSlug({ segments, supportedLocales, defaultLocale })`
- `apps/web/src/app/[[...slug]]/page.tsx`:
  - Runtime Config lesen
  - Locale/Slug helper verwenden
  - `loadPublicPage` mit dynamischer Locale aufrufen
- `packages/runtime/src/public-navigation-view-model.ts` (neu):
  - `PublicNavigationItemViewModel`
- `packages/runtime/src/public-navigation-resolution.ts`:
  - Rückgabe auf ViewModel umgestellt
  - page items nur mit existierender referenzierter Seite
  - href für page: `/{locale}/{page.slug}`
- `apps/web/src/components/public-navigation.tsx`:
  - nutzt `item.href`
  - hängt `?preview=1` nur bei page links an
- `apps/web/src/lib/load-public-page.ts`:
  - `navigation` auf `PublicNavigationItemViewModel[]`
  - Block-Filter auf `visible`

## Grenzen (bewusst unverändert)

- Kein `next-intl`, keine Middleware, keine API-Routes.
- Keine Auth-Preview-Tokens, keine Cookies.
- Keine ISR/Revalidation.
