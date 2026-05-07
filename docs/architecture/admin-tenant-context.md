# Admin Tenant Context

## Public vs. Admin Tenant Resolution

- **Public (`apps/web`)**: Tenant wird primär host-basiert aufgeloest (`Host -> TenantResolver -> Content`), damit jede Domain direkt beim korrekten Mandanten landet.
- **Admin (`apps/admin`)**: Tenant startet bewusst vereinfacht ueber `resolveAdminTenant()` mit Prioritaet `LOCAL_TENANT_ID` -> `localhost` -> Fallback `demo`.

## Warum Admin initial ENV-basiert startet

- Fruehe Admin-Entwicklung soll ohne komplexe Auth- und Membership-Flows funktionieren.
- Lokale Entwicklungsumgebungen koennen gezielt einen Mandanten setzen (`LOCAL_TENANT_ID`), ohne Routing/Identity-Infrastruktur zu erzwingen.
- Das reduziert Kopplung und beschleunigt den Aufbau tenant-faehiger Admin-Server-Loader.

## Vorbereitung fuer spaeteren Tenant Switcher

- `AdminTenantContext` enthaelt bereits `source` (`env|host|fallback`) und ist damit fuer spaetere Umschaltlogik vorbereitet.
- Ein Switcher kann spaeter denselben Context erweitern (z. B. `selectedTenantId`, `availableTenants`) ohne Bruch der bestehenden Runtime-Komposition.

## Vorbereitung fuer spaetere Auth-Integration

- Tenant-Aufloesung bleibt von Auth getrennt, damit Auth-Provider austauschbar bleiben.
- In spaeteren Phasen wird Admin-Zugriff ueber Membership (`tenant_members`) und Rollen/Berechtigungen abgesichert.
- Die Runtime bleibt zentral (`packages/runtime`), sodass Auth-Adapter nur dort verdrahtet werden muessen statt pro App.
