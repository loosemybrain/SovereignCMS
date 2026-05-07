# Architektur

SovereignCMS ist als **npm-Workspace-Monorepo** organisiert:

- **apps/admin** — CMS-Verwaltung (Next.js).
- **apps/web** — öffentlicher Renderer (Next.js).
- **packages/core** — Block-Registry, Render-/Editor-Verträge.
- **packages/tenancy** — Mandantenauflösung und Kontext.
- **packages/auth** — Auth-Abstraktion und RBAC-Verträge.
- **packages/db** / **packages/storage** — Adapter-Schnittstellen ohne Vendor-Details.
- **packages/ui** — gemeinsame UI-Hilfen (z. B. `cn`).
- **packages/config** — gemeinsame `tsconfig`-Presets.
- **adapters/** — konkrete Anbindungen (Supabase, Postgres, Keycloak, S3, optional Vercel).

Die frühere Physio-App liegt unter **legacy/physio-source** und dient nur als technische Referenz beim schrittweisen Übernehmen von Bausteinen — nicht als Produktgrundlage.
