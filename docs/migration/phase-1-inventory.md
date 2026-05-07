# Phase 1 — Inventar (technische Quelle vs. Produkt)

## Unter `legacy/physio-source` (Referenz, nicht übernehmen als SovereignCMS)

- **Next.js App Router** mit Admin-, Auth-, API- und Public-Routen.
- **Supabase-Client** und serverseitige Supabase-Nutzung (Navigation, Footer, CMS-Store, Uploads, …).
- **Vercel-/Preview-spezifische** Konfiguration (`vercel.json`, Security-Header in `next.config`).
- **Cookie-Scan-Worker** (Docker-Build unter `legacy/physio-source/cookie-scan-worker`).
- **Vitest**-Tests an API-Routen und Lib-Modulen.
- **v0-Integration** (`v0/` am Monorepo-Root, Skripte unter Legacy-`scripts/`).

## Unter dem SovereignCMS-Produktpfad (neu)

- **`apps/admin`**, **`apps/web`**: schlanke Next.js-16-Apps ohne Legacy-Importe.
- **`packages/core`**: Block-Registry und Render-Verträge.
- **`packages/db`**, **`packages/tenancy`**, **`packages/auth`**, **`packages/storage`**: Adapter-fähige Schnittstellen.
- **`adapters/*`**: Platzhalter für Supabase, Postgres, Keycloak, S3, optional Vercel-Metadaten.

## Bewusst nicht migriert in Phase 1

- Kunden-Branding, Fach-Domäne Physiotherapie, Demo-Inhalte.
- Vollständige UI- und Feature-Parität zur Legacy-App.
