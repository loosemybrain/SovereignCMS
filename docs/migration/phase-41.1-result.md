# Phase 41.1 Result - Demo Tenant Composition Locale Fix

## Problem

Im Admin `CreatePageForm` war nur `de` als Locale verfuegbar.

## Ursache

Die InMemory/Admin-Umgebung nutzt `tenantId: "demo"`, aber in der Composition-Registry fehlte eine passende Tenant-Definition.
Dadurch griff `resolveTenantComposition` auf den globalen Fallback `["de"]` zurueck.

## Loesung

- Demo Brand Composition hinzugefuegt (`id: "demo"`) mit:
  - Templates: empty/basic/landing
  - `defaultTemplateId: "basic-page-template"`
  - `defaultLocale: "de"`
  - `enabledLocales: ["de", "en"]`
- Demo Tenant Composition hinzugefuegt (`tenantId: "demo"`) mit:
  - `brandId: "demo"`
  - Templates: empty/basic/landing
  - `enabledLocales: ["de", "en"]`
- Resolver defensiv gehaertet, damit fuer `tenantId: "demo"` bevorzugt eine Demo-Composition gezogen wird.

## Ergebnis

- `resolveTenantComposition({ tenantId: "demo" })` liefert `enabledLocales: ["de", "en"]`.
- `CreatePageForm` kann fuer Demo wieder `de` und `en` anzeigen.
- `CompositionDebugPanel` zeigt fuer Demo korrekt Brand, Default-Locale und Enabled-Locales.

## Bekannte Grenze

Composition bleibt weiterhin statisch und adminseitig (keine Runtime-Persistenz, keine dynamische Verwaltung).

## Empfehlung fuer Phase 42

Runtime- und Composition-Locale-Defaults kontrolliert angleichen (weiterhin ohne Runtime-Enforcement-Layer).
