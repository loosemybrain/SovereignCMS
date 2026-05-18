# SovereignCMS

SovereignCMS is a modular, multi-tenant CMS foundation designed for portable deployments across SaaS and sovereign infrastructure environments.

## What is SovereignCMS?

SovereignCMS provides a product-oriented baseline for building tenant-aware CMS systems with clear contracts between runtime, domain logic, and infrastructure adapters. The repository is intentionally migration-safe: legacy project assets remain isolated and do not define the product architecture.

## Architecture

- **Monorepo:** npm workspaces + Turborepo orchestration.
- **Separation of concerns:**
  - `apps/*` for runtime surfaces
  - `packages/*` for stable contracts and shared logic
  - `adapters/*` for infrastructure-specific implementations
- **Tenant-first runtime:** Host -> Tenant -> Page -> Blocks.

## Apps

- `apps/web`: Public renderer with catch-all CMS route (`[[...slug]]`).
- `apps/admin`: Administrative shell (feature migration intentionally deferred).

## Packages

- `packages/core`: Core CMS contracts (`CmsPage`, `CmsBlock`, render/editor contexts, block contracts).
- `packages/tenancy`: Tenant context and resolver factory (`createDatabaseTenantResolver`).
- `packages/db`: Repository-based `DatabaseAdapter` contracts + in-memory adapter.
- `packages/storage`: Tenant-aware storage adapter contract.
- `packages/auth`: Authentication and RBAC abstraction contracts.
- `packages/ui`: Shared UI primitives/utilities.
- `packages/config`: Shared TypeScript/base config exports.

## Adapters

- `adapters/supabase`: Placeholder implementation targets for SaaS path.
- `adapters/postgres`: Placeholder implementation targets for portable/Gov path.
- `adapters/keycloak`: Placeholder OIDC/Auth provider target.
- `adapters/s3`: Placeholder storage target (S3/MinIO compatible).
- `adapters/vercel`: Optional deployment integration metadata.

## Runtime Flow

Current public runtime in `apps/web`:

1. Resolve host from request headers.
2. Resolve tenant via `TenantResolver` (`packages/tenancy`) against `db.tenants`.
3. Resolve page via `db.pages.findBySlug({ tenantId, locale, slug })`.
4. Resolve blocks via `db.blocks.listByPage({ tenantId, pageId })`.
5. Render blocks in web app.

## Deployment Targets

- **SaaS path:** managed infra (optional Supabase/Vercel adapters).
- **Sovereign/Gov path:** portable runtime with Postgres/S3/Keycloak style adapters.
- No hard runtime dependency on one cloud vendor is required by core contracts.

## Security Principles

- Tenant boundaries are mandatory at repository level (`tenant_id` in business tables).
- Public access is scoped to resolved tenant + published content.
- Admin access is derived from tenant membership, not global role assumptions.
- Audit events are append-only.
- Secrets are environment-driven; no secret material is committed.

## Development Commands

- `npm install`
- `npm run dev`
- `npm run clean`
- `npm run typecheck`
- `npm run build`
- `npm run lint`

### Phasen-Artefakte (ZIP)

Nach jedem **Sprint / Phasenschritt** gehören Validierung und ZIP-Artefakte zum festen Abschluss.

**Empfohlen (automatisch):**

```bash
npm run sprint:finish -- --phase 61
```

Führt nacheinander `typecheck`, `lint`, `build` aus und erzeugt danach die beiden ZIPs. Ohne `--phase` wird die neueste Datei `docs/migration/phase-*-result.md` verwendet.

Nur ZIPs (Phase auto oder Zeitstempel):

```bash
npm run sprint:zip
```

Manuell mit festem Label:

```bash
npm run phase:zip -- --phase 54
```

1. **Nur Änderungen** — alle Dateien, die Git gegenüber `HEAD` als geändert, gestaged oder untracked (respektive `.gitignore`) meldet.
2. **Slim-Repo-Snapshot** — Projektbaum inkl. **`.git`**, aber ohne **`node_modules`**, **`.next`**, **`.turbo`** und **`dist`** (überall im Baum).

Die Archive liegen unter **`artifacts/phase-zips/`** (`.gitignore`). Voraussetzung: `git` und `tar` im `PATH`.

Anderes Zielverzeichnis (optional):

```bash
set SOVEREIGN_PHASE_ZIP_DIR=C:\Pfad\zu\Archiven
npm run sprint:finish -- --phase 54
```

Umgebungsvariable `SPRINT_PHASE=61` setzt das Label, wenn `--phase` fehlt.

Targeted runs:

- `npm run dev:web`
- `npm run dev:admin`

## Current Status

- Phase 2 runtime contracts are in place.
- In-memory adapter provides deterministic demo runtime.
- Catch-all routing is enabled in public app.
- Infrastructure adapters remain placeholders by design.

## Migration Notes

- Legacy project artifacts live under `legacy/physio-source` and are not product source.
- Product migration artifacts are tracked in `docs/migration/*`.
- No runtime/feature migration from legacy occurs automatically.