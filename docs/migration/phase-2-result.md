# Phase 2.2 — Runtime Contract Finalization

## Runtime Flow

Die Public-Route in `apps/web/src/app/[[...slug]]/page.tsx` nutzt jetzt ausschließlich den standardisierten Laufzeitpfad:

1. Host aus `headers` lesen.
2. `createInMemoryAdapter()` aus `@sovereign-cms/db` erzeugen.
3. `createDatabaseTenantResolver(db)` aus `@sovereign-cms/tenancy` erstellen.
4. `tenantResolver.resolveByHost(host)`.
5. `db.pages.findBySlug({ tenantId, locale, slug })`.
6. `db.blocks.listByPage({ tenantId, pageId })`.
7. Blöcke rendern.

## Catch-all Route

- Ersetzt durch `[[...slug]]`.
- Regeln:
  - kein Slug => `home`
  - Slug-Array => `join("/")`
- Damit ist der Pfad für verschachtelte CMS-Slugs vorbereitet.

## DatabaseAdapter-Repositories

`@sovereign-cms/db` verwendet jetzt das repository-basierte Zielmodell:

- `tenants: TenantRepository`
- `pages: PageRepository`
- `blocks: BlockRepository`

Die In-Memory-Implementierung exportiert genau:

- `createInMemoryAdapter(): DatabaseAdapter`

ohne eigene Tenant-Resolver-Logik.

## TenantResolver in `packages/tenancy`

`@sovereign-cms/tenancy` enthält:

- `TenantResolver` mit `resolveByHost(host)`
- `createDatabaseTenantResolver(db)`

Die Auflösung nutzt ausschließlich `db.tenants.findByDomain(host)` und normalisiert auf `TenantContext`.

## Bekannte Grenzen

- Keine persistente Datenbank (nur In-Memory-Demo).
- Keine Mehrsprachlogik jenseits der festen Demo-Locale `de`.
- Keine Preview-/Publishing-Workflows, keine Zeitfensterlogik für `scheduled`.
- Keine echte Storage/Auth-Adapter-Implementierung (nur Platzhalter).

## Empfehlung für Phase 3

1. Zentrale Runtime-Komposition (`createRuntime`) mit auswählbaren Adaptern per ENV.
2. Typed Mapping-Layer: `unknown` aus Repository in stabile Read-Model-Typen pro App.
3. Erste persistente Adapter-Implementierung (Postgres **oder** Supabase) hinter unveränderten Contracts.
4. Locale-/Routing-Erweiterung für verschachtelte Seiten + `generateStaticParams`-Strategie.