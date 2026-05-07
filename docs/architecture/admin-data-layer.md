# Admin Data Layer

## Grundsatz

Admin liest Daten ausschliesslich ueber die zentrale Runtime-Komposition und deren Repository-Vertraege. Die Admin-App erzeugt keine Infrastruktur-Adapter direkt.

## Datenpfad

1. `loadAdminPages({ host })` ruft `getAdminRuntime({ host })` auf.
2. `getAdminRuntime` erstellt Runtime ueber `createRuntime()`.
3. Tenant wird ueber `resolveAdminTenant({ host, env })` aufgeloest.
4. Page-Liste wird ueber `runtime.db.pages.listByTenant({ tenantId, locale })` geladen.

## Tenant-Filter

Alle Admin-Page-Abfragen sind tenant-scoped. `tenantId` aus `AdminTenantContext` ist Pflichtparameter fuer `listByTenant`.

## Typisierung

Da Repository-Vertraege aktuell `unknown` liefern, validiert der Admin-Loader Eintraege gegen den exportierten `PageRecord`-Typ (`@sovereign-cms/db`) bevor sie als Read-Model angezeigt werden.

## Naechste Ausbaustufe

Vor den Datenzugriff wird spaeter Auth/Membership/RBAC geschaltet. Der Datenpfad bleibt dabei gleich und wird nur um Guard-Schichten erweitert.