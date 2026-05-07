# Phase 3 Ergebnis

## Was geaendert wurde

- Neues Paket `packages/runtime` eingefuehrt.
- `RuntimeConfig` inkl. `loadRuntimeConfig()` implementiert (ENV-Validierung + Defaults).
- `createRuntime()` auf ergonomische Signatur umgestellt (`config?: Partial<RuntimeConfig>`).
- Adapterauswahl zentralisiert und fuer nicht implementierte Adapter auf klare Fehler umgestellt.
- `apps/web` nutzt `createRuntime()` ohne hartcodierte Konfiguration.
- `apps/admin` ist von direktem Supabase-Adapterimport entkoppelt und nutzt ebenfalls `createRuntime()`.

## Aktueller Runtime Flow

1. App erstellt Runtime zentral ueber `createRuntime()`.
2. Runtime laedt Basis-Konfiguration aus ENV.
3. Runtime waehlt Adapter und TenantResolver.
4. Web-Flow: Host -> TenantResolver -> PageRepository -> BlockRepository -> Render.

## Apps nutzen Runtime

- `apps/web`: Runtime fuer Tenant/Page/Block-Lookup.
- `apps/admin`: Runtime fuer Anzeige aktiver Adapterkonfiguration (neutral, ohne Providerimport).

## Bekannte Grenzen

- Nur Memory-Adapter produktiv nutzbar.
- Supabase/Postgres/Keycloak/S3 sind bewusst als Platzhalter nicht implementiert.
- Keine Laufzeit-Migration bestehender Legacy-Features.

## Empfehlung fuer Phase 4

- Tenant Context in Admin-Routen und Server-Loadern systematisch einziehen.
- Tenant-gebundene Guards auf Runtime-Ebene nutzen.
- Danach selektiv Admin-Read-Modelle tenant-faehig ausbauen, ohne Infrastruktur direkt in Apps zu referenzieren.