# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run all apps in dev mode (web on :3000, admin on :3001)
npm run dev

# Run only one app
npm run dev:web
npm run dev:admin

# Build all packages and apps
npm run build

# Type-check all workspaces
npm run typecheck

# Lint all workspaces
npm run lint

# Remove build artifacts (.next, dist, .turbo)
npm run clean

# Filter commands to a single workspace via Turborepo
npx turbo typecheck --filter=@sovereign-cms/core
npx turbo build --filter=@sovereign-cms/admin

# Create phase ZIP artifacts after a completed migration step
npm run phase:zip -- --phase <N>
```

There are no automated tests in this codebase. Correctness is verified via `typecheck` + `lint`.

## Architecture

### Monorepo Layout

```
apps/web      – Public renderer (Next.js, port 3000)
apps/admin    – CMS admin shell  (Next.js, port 3001)
packages/*    – Stable contracts & domain logic (no infrastructure)
adapters/*    – Infrastructure implementations (all currently placeholder stubs)
legacy/       – Isolated legacy reference app; not part of the product
docs/         – Architecture decision records & phase migration notes
```

### Dependency Direction

```
apps → packages/runtime → packages/{db,auth,storage,tenancy} → packages/core
adapters/* → packages/*   (adapters implement package interfaces)
```

`packages/core` defines all CMS domain types and contracts and must remain infrastructure-free. Infrastructure belongs only in `adapters/`.

### Runtime & Adapter Selection

`packages/runtime/src/config.ts` reads env vars (`DATABASE_ADAPTER`, `STORAGE_ADAPTER`, `AUTH_ADAPTER`) at startup and selects the corresponding adapter via `packages/runtime/src/adapter-selection.ts`. Currently only `memory` / `none` adapters are implemented; all others throw `"Adapter not implemented yet"`.

`apps/admin/src/lib/get-admin-runtime.ts` is the single entry point for server-side runtime access in admin. All Server Actions import from there.

### Tenant Resolution

Tenant context is resolved per-request from the HTTP `host` header via `resolveAdminTenant` / `TenantResolver` in `packages/tenancy`. During local development the env vars `LOCAL_TENANT_HOST` and `LOCAL_TENANT_ID` override host detection. The in-memory adapter seeds a `demo` tenant automatically.

### Data Flow (Public)

`apps/web/src/app/[[...slug]]/page.tsx` → `loadPublicPage()` → `TenantResolver` → `db.pages.findBySlug` → `db.blocks.listByPage` → `PublicPageView` / `PublicBlockRenderer`.

### Data Flow (Admin)

Server components call `get-admin-runtime.ts`, then call persistence factories from `packages/runtime` (e.g. `createEditorPersistence`). Next.js Server Actions in `apps/admin/src/actions/` wrap those factories for client calls. The editor state is managed client-side in `apps/admin/src/lib/editor-state.ts` and serialised via `client-*-persistence.ts` wrappers.

### Block System

Block types are defined in `packages/core/src/blocks.ts`. A `BlockRegistry` (created via `createBlockRegistry`) maps `BlockType` → `BlockDefinition`. Admin-side renderers live in `apps/admin/src/block-definitions/`; public renderers in `apps/web/src/components/public/`. Adding a new block type requires touching both renderer locations and the `BlockType` union in core.

### Content Status Lifecycle

`draft → published → archived` — transitions are defined in `packages/core/src/content-transition.ts`. The persistence layer enforces allowed transitions; invalid transitions throw.

### Key Environment Variables

| Variable | Values | Default |
|---|---|---|
| `DATABASE_ADAPTER` | `memory`, `supabase`, `postgres` | `memory` |
| `STORAGE_ADAPTER` | `memory`, `supabase`, `s3` | `memory` |
| `AUTH_ADAPTER` | `none`, `supabase`, `keycloak` | `none` |
| `DEFAULT_LOCALE` | locale code | `de` |
| `SUPPORTED_LOCALES` | comma-separated | `de,en` |
| `LOCAL_TENANT_HOST` | hostname override for dev | – |
| `LOCAL_TENANT_ID` | tenant slug override for dev | `demo` |

Copy `.env.example` → `.env.local` in each app to run locally.

### Adding an Infrastructure Adapter

1. Implement the interface from `packages/db`, `packages/storage`, or `packages/auth` in the matching `adapters/` package.
2. Register the case in `packages/runtime/src/adapter-selection.ts`.
3. Set the corresponding env var to the new adapter kind.
