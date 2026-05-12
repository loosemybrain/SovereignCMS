# Phase 35.2 — Public Navigation Page Visibility Alignment

## Problem

Ein Navigation Item konnte oeffentlich sichtbar sein, obwohl die referenzierte Seite im aktuellen Preview-Kontext nicht sichtbar war (z. B. `item=published`, `page=draft`, `preview=disabled`).

## Loesung

Sichtbarkeit wird zentral ueber `isPubliclyVisible(status, preview)` entschieden und sowohl auf Navigation Items als auch auf referenzierte Seiten angewendet.

Regel fuer `page`-Navigation:
- Item muss sichtbar sein
- referenzierte Seite muss existieren
- referenzierte Seite muss ebenfalls sichtbar sein

Nur dann wird ein Link ausgegeben.

## Neue Helper

- `packages/runtime/src/public-visibility.ts`
  - `isPubliclyVisible(status, preview): boolean`

## Betroffene Dateien

- `packages/runtime/src/public-visibility.ts` (neu)
- `packages/runtime/src/public-page-resolution.ts`
  - nutzt `isPubliclyVisible` statt eigener Statuslogik
- `packages/runtime/src/public-navigation-resolution.ts`
  - Item-Status via Helper
  - Page-Status via Helper
  - `external` nur mit vorhandenem `href`
- `packages/runtime/src/index.ts`
  - Export `isPubliclyVisible`
- `docs/architecture/publish-visibility-foundation.md`
  - Dokumentation fuer Item/Page Alignment aktualisiert

## Bekannte Grenzen

- Keine Auth Preview Tokens
- Keine Cookies oder Middleware
- Keine ISR/Revalidation
- Keine API Routes / kein fetch

## Empfehlung fuer Phase 36

Auf dieser Basis kann Preview-Authentifizierung eingefuehrt werden (z. B. token- oder session-basiert), ohne die Sichtbarkeitsregeln erneut in mehreren Stellen zu duplizieren.
