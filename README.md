# SovereignCMS

SovereignCMS is a modular, multi-tenant CMS foundation for portable deployments — from managed SaaS to fully self-hosted sovereign infrastructure. It is built as a TypeScript monorepo with clean separation between domain logic, runtime composition, and infrastructure adapters.

---

## Table of Contents

- [What is SovereignCMS?](#what-is-sovereigncms)
- [Architecture Overview](#architecture-overview)
- [Monorepo Layout](#monorepo-layout)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Packages](#packages)
  - [core](#sovereigncmscore)
  - [db](#sovereigncmsdb)
  - [runtime](#sovereigncmsruntime)
  - [tenancy](#sovereigncmstenancy)
  - [auth](#sovereigncmsauth)
  - [storage](#sovereigncmsstorage)
  - [ui](#sovereigncmsui)
- [Adapters](#adapters)
- [Apps](#apps)
  - [web — Public Renderer](#web--public-renderer)
  - [admin — CMS Shell](#admin--cms-shell)
- [Data Model](#data-model)
- [Content Lifecycle](#content-lifecycle)
- [Block System](#block-system)
- [Multi-Tenancy](#multi-tenancy)
- [Locale & Internationalisation](#locale--internationalisation)
- [Adding an Infrastructure Adapter](#adding-an-infrastructure-adapter)
- [Deployment Targets](#deployment-targets)
- [Development Commands](#development-commands)
- [Security Principles](#security-principles)
- [Phase Artifacts](#phase-artifacts)

---

## What is SovereignCMS?

SovereignCMS provides a product-oriented baseline for building tenant-aware CMS systems. It is intentionally migration-safe: legacy project assets are isolated under `legacy/` and do not define the product architecture.

**Key properties:**
- **Multi-tenant**: every page, block, navigation item, and media asset belongs to a tenant. Tenant context is resolved per-request from the HTTP `Host` header.
- **Adapter-driven**: database, storage, and authentication are hot-swappable via environment variables. Only the in-memory adapter ships today; production adapters (Supabase, PostgreSQL, S3, Keycloak) are ready to implement.
- **No vendor lock-in**: the core domain model and runtime are infrastructure-free. Cloud-provider code lives exclusively in `adapters/`.
- **Phase-based evolution**: the codebase evolves through named, validated phases. Each phase produces ZIP artifacts documenting the delta.

---

## Architecture Overview

```
┌───────────────────────────────────────────────────────────────────┐
│  apps/web (Next.js :3000)      apps/admin (Next.js :3001)         │
│  Public renderer               CMS editorial shell                 │
└───────────────────────────┬───────────────────────────────────────┘
                            │ imports
┌───────────────────────────▼───────────────────────────────────────┐
│  packages/runtime                                                  │
│  Composes adapters, exposes persistence factories & view models    │
└──────┬────────────┬────────────┬────────────┬─────────────────────┘
       │            │            │            │
  packages/db  packages/auth  packages/storage  packages/tenancy
  (contracts)  (contracts)   (contracts)       (resolver)
       │            │            │
┌──────▼────────────▼────────────▼──────────────────────────────────┐
│  adapters/supabase  adapters/postgres  adapters/s3  adapters/keycloak │
│  (infrastructure implementations — currently placeholder stubs)    │
└───────────────────────────────────────────────────────────────────┘
       ▲
  packages/core
  Domain types, contracts, validation (no infrastructure allowed)
```

**Dependency direction** (strict, no cycles):

```
apps → packages/runtime → packages/{db,auth,storage,tenancy} → packages/core
adapters/* → packages/*
```

---

## Monorepo Layout

```
apps/
  web/          Next.js public renderer (port 3000)
  admin/        Next.js CMS admin shell (port 3001)

packages/
  core/         Domain types, block definitions, validation — no infra
  db/           DatabaseAdapter contract + in-memory implementation
  runtime/      Adapter wiring, persistence factories, public view models
  tenancy/      Tenant resolver from HTTP Host header
  auth/         AuthProvider & RBAC contracts
  storage/      StorageAdapter contract
  ui/           Shared React utilities (cn helper)
  config/       Shared TypeScript / ESLint / Tailwind configs

adapters/
  supabase/     SaaS path: Supabase DB + storage (placeholder)
  postgres/     Gov path: PostgreSQL DB (placeholder)
  s3/           Gov path: S3/MinIO storage (placeholder)
  keycloak/     Gov path: Keycloak OIDC auth (placeholder)
  vercel/       Optional Vercel deployment metadata

legacy/
  physio-source/ Isolated legacy reference app — not product source

docs/
  architecture/  Design decisions and system documentation
  migration/     Phase-by-phase progress notes
  deployment/    Environment strategy

scripts/
  clean.mjs           Remove .next / dist / .turbo build artefacts
  phase-artifacts.mjs Create phase ZIP snapshots
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment files (one per app)
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# 3. Start both apps (web :3000, admin :3001)
npm run dev
```

The default configuration uses the **in-memory adapter** with seeded demo data. No database is required.

Demo tenant `demo` is accessible at `http://localhost:3000` (public) and `http://localhost:3001` (admin).

---

## Environment Variables

All variables are optional in development; defaults fall back to the in-memory adapter.

| Variable | Values | Default | Description |
|---|---|---|---|
| `DATABASE_ADAPTER` | `memory` · `supabase` · `postgres` | `memory` | Database backend |
| `STORAGE_ADAPTER` | `memory` · `supabase` · `s3` | `memory` | File storage backend |
| `AUTH_ADAPTER` | `none` · `supabase` · `keycloak` | `none` | Authentication provider |
| `APP_ENV` | `local` · `development` · `staging` · `production` | `local` | Runtime environment label |
| `APP_BASE_URL` | URL | — | Public base URL of the web app |
| `DEFAULT_LOCALE` | locale code | `de` | Default locale for content |
| `SUPPORTED_LOCALES` | comma-separated | `de,en` | All supported locales |
| `LOCAL_TENANT_HOST` | hostname | — | Override host-based tenant resolution in development |
| `LOCAL_TENANT_ID` | tenant slug | `demo` | Force a specific tenant in development |
| `SUPABASE_URL` | URL | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | key | — | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | key | — | Supabase service role key |
| `DATABASE_URL` | postgres DSN | — | PostgreSQL connection string |
| `OIDC_ISSUER_URL` | URL | — | Keycloak / OIDC issuer |
| `OIDC_CLIENT_ID` | string | — | OIDC client ID |
| `OIDC_CLIENT_SECRET` | string | — | OIDC client secret |
| `S3_ENDPOINT` | URL | — | S3 / MinIO endpoint |
| `S3_BUCKET` | string | — | S3 bucket name |
| `S3_ACCESS_KEY_ID` | string | — | S3 access key |
| `S3_SECRET_ACCESS_KEY` | string | — | S3 secret key |
| `SMTP_HOST` | hostname | — | SMTP host (email, future) |

---

## Packages

### `@sovereign-cms/core`

**Path:** `packages/core/src/`
**Purpose:** All CMS domain types, contracts, and pure validation logic. Zero runtime dependencies beyond Zod. Must remain infrastructure-free.

#### Entity types (`cms.ts`)

```ts
type TenantId = string
type Locale   = string

interface CmsEntityBase {
  id:        string
  tenantId:  TenantId
  createdAt: string   // ISO 8601
  updatedAt: string
}

interface CmsPage extends CmsEntityBase {
  slug:            string
  locale:          Locale
  title:           string
  status:          ContentStatus
  seoTitle?:       string
  seoDescription?: string
}

interface CmsBlock extends CmsEntityBase {
  pageId:    string
  type:      BlockType
  sortOrder: number
  props:     Record<string, unknown>
  visible:   boolean
}
```

#### Block types (`blocks.ts`)

| `BlockType` | Props |
|---|---|
| `"hero"` | `headline`, `subline?`, `mediaUrl?`, `mediaAlt?` |
| `"text"` | `body` |
| `"cta"` | `eyebrow?`, `headline`, `body?`, `primaryLabel`, `primaryHref`, `secondaryLabel?`, `secondaryHref?`, `align?` |
| `"feature-grid"` | `headline?`, `intro?`, `columns` (2–4), `items[]` (`id`, `title`, `body?`) |
| `"image-text"` | `headline`, `body?`, `imageUrl?`, `imageAlt?`, `imagePosition` (`left`/`right`), `ctaLabel?`, `ctaHref?` |
| `"contact-form"` | `headline?`, `intro?`, `submitLabel?`, `successMessage?`, `consentLabel?`, `recipientEmail?` |
| `"external-embed"` | `provider`, `title`, `embedUrl`, `consentText?`, `buttonLabel?` |

#### Content status (`content-status.ts`)

```ts
type ContentStatus = "draft" | "published" | "archived"
```

#### Content transitions (`content-transition.ts`)

| From | Action | To |
|---|---|---|
| `draft` | `publish` | `published` |
| `published` | `archive` | `archived` |
| `archived` | `restoreDraft` | `draft` |

Invalid transitions throw at the persistence layer.

#### Navigation (`navigation.ts`)

```ts
type NavigationScope    = "main" | "footer" | "legal" | "social"
type NavigationItemType = "page" | "external"

interface NavigationItem extends CmsEntityBase {
  scope:     NavigationScope
  type:      NavigationItemType
  label:     string
  href:      string
  sortOrder: number
}
```

#### Tenant settings (`settings.ts`)

```ts
interface TenantSettings {
  siteName: string
  tagline:  string
  logoUrl:  string
  contact: { email: string; phone: string; address: string }
  legal: {
    companyName:      string
    vatId:            string
    courtInfo:        string
    privacyPolicyUrl: string
    imprintUrl:       string
  }
  socialLinks: Array<{ id: string; label: string; href: string }>
}
```

---

### `@sovereign-cms/db`

**Path:** `packages/db/src/`
**Purpose:** Defines the `DatabaseAdapter` interface. Ships the in-memory adapter for development.

#### `DatabaseAdapter` interface

```ts
interface DatabaseAdapter {
  tenants:      TenantRepository
  pages:        PageRepository
  blocks:       BlockRepository
  navigation:   NavigationRepository
  media:        MediaRepository
  settings:     SettingsRepository
  privacyScans: PrivacyScanRepository
}
```

**Repository methods (summary):**

| Repository | Key methods |
|---|---|
| `TenantRepository` | `findByDomain(domain)` |
| `PageRepository` | `findBySlug({tenantId, locale, slug})`, `list({tenantId, locale?})`, `create(input)`, `saveProps(...)`, `transitionStatus(...)` |
| `BlockRepository` | `listByPage({tenantId, pageId})`, `replacePageBlocks({tenantId, pageId, blocks})` |
| `NavigationRepository` | `list({tenantId, scope?})`, `create(input)` |
| `MediaRepository` | `list({tenantId})`, `create(input)` |
| `SettingsRepository` | `get(tenantId)`, `update({tenantId, patch})` |
| `PrivacyScanRepository` | `list({tenantId})`, `create(input)`, `updateApproval(...)` |

#### In-memory adapter

Seeded demo data (available immediately without configuration):

- **Tenant:** `demo` — resolves for `localhost`, `127.0.0.1`, and any host in development
- **Pages:** German and English homepage (both `draft`)
- **Navigation:** Main nav + footer nav with example links
- **Media:** One demo image asset
- **Settings:** Demo site name, tagline, contact info, social links
- **Privacy scans:** One completed sample scan with findings

---

### `@sovereign-cms/runtime`

**Path:** `packages/runtime/src/`
**Purpose:** Composes adapters into a `SovereignRuntime`; exposes typed persistence factories; maps internal models to public view models.

#### `SovereignRuntime`

```ts
interface SovereignRuntime {
  db:      DatabaseAdapter
  storage: StorageAdapter
  auth:    AuthProvider
  config:  RuntimeConfig
}

function createRuntime(): SovereignRuntime
```

`createRuntime()` reads `process.env`, calls `loadRuntimeConfig()`, and selects adapters via `adapter-selection.ts`.

#### Persistence factories

All factories accept `{ runtime, tenantId }` and return a typed persistence object:

| Factory | Purpose |
|---|---|
| `createEditorPersistence` | Save page draft (title, blocks, SEO) |
| `createPageStatusPersistence` | Transition content status |
| `createPageCreationPersistence` | Create a new page |
| `createNavigationPersistence` | List & create navigation items |
| `createMediaPersistence` | List & create media assets |
| `createSettingsPersistence` | Get & update tenant settings |
| `createPrivacyScannerPersistence` | List, create, and approve privacy scans |

#### Public view model pipeline

```
loadPublicPage(host, slug, locale, preview)
  → TenantResolver.resolve(host)
  → db.pages.findBySlug(...)
  → db.blocks.listByPage(...)       (filtered by visibility + preview mode)
  → db.navigation.list(...)         (main + footer scopes)
  → db.settings.get(tenantId)
  → mapToPublicHeaderViewModel(...)
  → mapToPublicFooterViewModel(...)
  → mapToPublicSeoViewModel(...)
  → PublicPagePayload
```

---

### `@sovereign-cms/tenancy`

**Path:** `packages/tenancy/src/`
**Purpose:** Resolves HTTP `Host` headers to `TenantContext` objects.

```ts
interface TenantContext {
  id:          TenantId
  slug:        string
  displayName: string
}

// Web app: resolves from Host header via db.tenants
function createDatabaseTenantResolver(db: DatabaseAdapter): TenantResolver

// Admin app: falls back to LOCAL_TENANT_ID env var ("demo")
function resolveAdminTenant(input: { host?: string; env: NodeJS.ProcessEnv }): AdminTenantContext
```

---

### `@sovereign-cms/auth`

**Path:** `packages/auth/src/`
**Purpose:** Authentication and RBAC contracts. Currently only the `none` provider (no-op) is implemented.

```ts
interface AuthProvider {
  getSession(): Promise<AuthSession | null>
  signOut():    Promise<void>
}

interface AuthUser {
  id:          string
  email:       string
  roles:       RoleId[]
  permissions: PermissionId[]
}

interface RbacPolicy {
  can(user: AuthUser, action: string, resource?: unknown): boolean
}
```

---

### `@sovereign-cms/storage`

**Path:** `packages/storage/src/`
**Purpose:** Tenant-aware file storage contract.

```ts
interface StorageAdapter {
  upload(input: {
    tenantId:    string
    key:         string
    data:        Buffer | ReadableStream
    contentType: string
  }): Promise<StorageObject>

  getPublicUrl(input: { tenantId: string; key: string }): Promise<string>
  delete(input: { tenantId: string; key: string }):       Promise<void>
}
```

The in-memory storage adapter returns `memory://<tenantId>/<key>` URLs and is a no-op for uploads and deletes.

---

### `@sovereign-cms/ui`

**Path:** `packages/ui/src/`
**Purpose:** Minimal shared React utilities.

```ts
import { cn } from "@sovereign-cms/ui"
// Merges Tailwind classes correctly (clsx + tailwind-merge)
cn("px-4 py-2", condition && "bg-blue-600")
```

---

## Adapters

All adapters in `adapters/` are **placeholder stubs** — they implement the correct interface signature but throw `"Adapter not implemented yet: <name>"` at runtime.

| Adapter | Package | Implements | Target use |
|---|---|---|---|
| Supabase | `@sovereign-cms/adapter-supabase` | `DatabaseAdapter` + `StorageAdapter` | SaaS / managed |
| PostgreSQL | `@sovereign-cms/adapter-postgres` | `DatabaseAdapter` | Self-hosted / Gov |
| S3 / MinIO | `@sovereign-cms/adapter-s3` | `StorageAdapter` | Self-hosted / Gov |
| Keycloak | `@sovereign-cms/adapter-keycloak` | `AuthProvider` | Enterprise SSO |
| Vercel | `@sovereign-cms/adapter-vercel` | metadata only | Optional hosting |

To activate an adapter set the corresponding env var and restart:

```bash
DATABASE_ADAPTER=postgres
STORAGE_ADAPTER=s3
AUTH_ADAPTER=keycloak
```

---

## Apps

### `web` — Public Renderer

**Port:** 3000 · **Path:** `apps/web/`

Single catch-all route: `apps/web/src/app/[[...slug]]/page.tsx`

**Request lifecycle:**
1. Parse `slug` → resolve `locale` + page slug via `resolvePublicLocaleAndSlug()`
2. Call `loadPublicPage(host, slug, locale, preview)` → `PublicPagePayload`
3. Return 404 if page not found or not publishable
4. Render `PublicPageView` → `PublicLayoutShell` + block list via `PublicBlockRenderer`

**Key files:**

| File | Purpose |
|---|---|
| `src/lib/load-public-page.ts` | Full page loading pipeline |
| `src/components/public/PublicPageView.tsx` | Top-level page component |
| `src/components/public/PublicBlockRenderer.tsx` | Block type dispatcher |
| `src/components/public-layout-shell.tsx` | Header + main + footer wrapper |
| `src/components/public-header.tsx` | Dark header with nav + locale switcher |
| `src/components/public-footer.tsx` | Dark footer with contact, nav, social |
| `src/components/public-contact-form.tsx` | Client-side contact form with honeypot |
| `src/components/public-external-embed.tsx` | Consent-gated iframe embed |
| `src/components/external-media-gate.tsx` | Consent gate UI |
| `src/components/consent-provider.tsx` | Cookie consent context |
| `src/styles/public-surface-system.css` | CSS design tokens and utility classes |

**Public surface system** (`src/styles/public-surface-system.css`) — Phase 63:

| Token | Value | Purpose |
|---|---|---|
| `--pub-section-py` | `5rem` / `3rem` mobile | Section vertical rhythm |
| `--pub-container-max` | `80rem` | Outer container (matches header) |
| `--pub-content-max` | `44rem` | Reading-width constraint |
| `--pub-motion-dur` | `180ms` / `0ms` reduced-motion | All transitions |
| `--pub-focus-color` | `#3b82f6` | Focus ring colour |

Utility classes: `.pub-container` · `.pub-section-py` · `.pub-section-py-sm` · `.pub-prose` · `.pub-interactive` · `.pub-card` · `.pub-btn-primary` · `.pub-btn-secondary` · `.pub-field`

---

### `admin` — CMS Shell

**Port:** 3001 · **Path:** `apps/admin/`

**Routes:**

| Route | Description |
|---|---|
| `/` → `/dashboard` | Metrics: page count, block count, adapter info |
| `/pages` | Page list with status badges and locale filter |
| `/pages/[slug]` | Block editor: add, reorder, edit, delete blocks |
| `/navigation` | Main navigation items (scope: `main`) |
| `/footer-navigation` | Footer + legal + social links |
| `/media` | Media asset library with upload |
| `/settings` | Tenant settings: identity, contact, business, legal |
| `/privacy` | Privacy scanner jobs and approval workflow |

**Data flow:**

```
Server Component
  → getAdminRuntime({ host })          apps/admin/src/lib/get-admin-runtime.ts
  → resolveAdminTenant(host, env)      falls back to LOCAL_TENANT_ID="demo"
  → createRuntime()                    reads env, selects adapters
  → persistence factory
  → render with initial data

Client Component (e.g. PageEditorClient)
  → user interaction
  → Server Action (apps/admin/src/actions/*.ts)
  → getAdminRuntime() + persistence factory
  → typed result returned to client
```

**Server actions:**

| Action | Description |
|---|---|
| `savePageDraftAction` | Persist block props and page title |
| `transitionPageStatusAction` | Change status (publish · archive · restoreDraft) |
| `createPageAction` | Create new page with slug + locale |
| `loadNavigationItemsAction` | List nav items by scope |
| `createNavigationItemAction` | Add navigation item |
| `loadMediaAssetsAction` | List media assets |
| `createMediaAssetAction` | Register new media asset |
| `loadTenantSettingsAction` | Get tenant settings |
| `updateTenantSettingsAction` | Save settings patch |
| `loadPrivacyScansAction` | List privacy scan jobs |
| `createPrivacyScanAction` | Start a privacy scan |
| `updatePrivacyScanApprovalAction` | Approve / reject scan findings |

---

## Data Model

```
tenants
  id, slug, displayName
  └─ domains: domain → tenantId (1:n)

pages  (per tenant, per locale)
  id, tenantId, slug, locale, title, status, seoTitle, seoDescription

blocks  (per page, ordered)
  id, tenantId, pageId, type, sortOrder, props (JSON), visible

navigation_items  (per tenant)
  id, tenantId, scope (main|footer|legal|social), type, label, href, sortOrder

media_assets  (per tenant)
  id, tenantId, key, url, alt, mimeType, size

site_settings  (per tenant — JSON blob)
  siteName, tagline, logoUrl, contact{}, legal{}, socialLinks[]

privacy_scan_jobs  (per tenant)
  id, tenantId, status, startedAt, completedAt, findings[], approvalStatus
```

Tenant boundaries are enforced at the repository level: every repository method takes or validates `tenantId`. Cross-tenant data access is structurally impossible through the adapter interface.

---

## Content Lifecycle

```
         ┌──────────────┐
    ┌───▶│    DRAFT     │◀─────────────┐
    │    └──────┬───────┘              │
    │           │ publish              │ restoreDraft
    │           ▼                     │
    │    ┌──────────────┐             │
    │    │  PUBLISHED   │─── archive ─┘
    │    └──────────────┘
    │
    └── (stays draft on save)
```

- **Draft** — editable freely; only visible with `?preview=1`
- **Published** — visible to all public visitors
- **Archived** — hidden from public; restorable to draft

`getAvailableActionsForStatus(status)` returns valid actions for a given state. Invalid transitions throw at the persistence layer.

---

## Block System

Block types are defined as a discriminated union in `packages/core/src/blocks.ts`. A `BlockRegistry` maps each `BlockType` to a `BlockDefinition`:

```ts
const registry = createBlockRegistry()
registry.get("hero")  // → BlockDefinition
registry.getAll()     // → BlockDefinition[]
```

**Adding a new block type:**
1. Add the type string to `BlockType` union in `packages/core/src/blocks.ts`
2. Define props type and `BlockDefinition` (label, default props, inspector fields)
3. Add admin-side renderer in `apps/admin/src/block-definitions/`
4. Add public-side renderer case in `apps/web/src/components/public/PublicBlockRenderer.tsx`
5. Register in `createBlockRegistry()` in `packages/core/src/registry.ts`

---

## Multi-Tenancy

Every request to both `web` and `admin` is scoped to a tenant:

**Web (public):**
```
HTTP Host: example.com
  → db.tenants.findByDomain("example.com")
  → TenantContext { id: "t_abc", slug: "example", displayName: "Example Co" }
  → all subsequent queries scoped to tenantId: "t_abc"
```

**Admin:**
```
HTTP Host: localhost:3001
  → resolveAdminTenant({ host, env })
  → falls back to LOCAL_TENANT_ID="demo"
  → AdminTenantContext { id: "demo", slug: "demo", displayName: "Demo Tenant" }
```

---

## Locale & Internationalisation

Supported locales are configured via `SUPPORTED_LOCALES=de,en`. The first is the default unless `DEFAULT_LOCALE` overrides it.

**URL structure (web):**
- Default locale: `/` or `/about` (no prefix)
- Non-default locale: `/en` or `/en/about`

Each page has one `locale` field — the German and English versions of `/about` are two separate `CmsPage` records with the same slug and different locales.

---

## Adding an Infrastructure Adapter

1. **Implement the interface** in the matching `adapters/` package:
   - `packages/db/src/contracts.ts` → `DatabaseAdapter`
   - `packages/storage/src/adapter.ts` → `StorageAdapter`
   - `packages/auth/src/contracts.ts` → `AuthProvider`

2. **Register the case** in `packages/runtime/src/adapter-selection.ts`:
   ```ts
   case "postgres":
     return createPostgresAdapter(config)
   ```

3. **Set the env var** and restart:
   ```bash
   DATABASE_ADAPTER=postgres
   DATABASE_URL=postgresql://user:pass@host/db
   ```

4. **Validate:** `npm run typecheck && npm run build`

---

## Deployment Targets

### SaaS / Managed

```bash
DATABASE_ADAPTER=supabase
STORAGE_ADAPTER=supabase
AUTH_ADAPTER=supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Sovereign / Gov (self-hosted)

```bash
DATABASE_ADAPTER=postgres
STORAGE_ADAPTER=s3
AUTH_ADAPTER=keycloak
DATABASE_URL=postgresql://...
S3_ENDPOINT=https://minio.internal
S3_BUCKET=cms-assets
OIDC_ISSUER_URL=https://keycloak.internal/realms/cms
OIDC_CLIENT_ID=cms
OIDC_CLIENT_SECRET=...
```

### Local Development (default)

```bash
DATABASE_ADAPTER=memory
STORAGE_ADAPTER=memory
AUTH_ADAPTER=none
LOCAL_TENANT_ID=demo
```

---

## Development Commands

```bash
npm install                                    # Install all workspace dependencies
npm run dev                                    # Start web (:3000) + admin (:3001)
npm run dev:web                                # Start web only
npm run dev:admin                              # Start admin only
npm run build                                  # Production build (both apps)
npm run typecheck                              # TypeScript check (all packages)
npm run lint                                   # ESLint (all packages)
npm run clean                                  # Remove .next, dist, .turbo

# Filter to a single workspace
npx turbo typecheck --filter=@sovereign-cms/core
npx turbo build --filter=@sovereign-cms/admin

# Phase ZIP artifact after a successful migration step
npm run phase:zip -- --phase 63
```

There are no automated test suites. Correctness is validated via `typecheck` + `lint` + `build`.

---

## Security Principles

- **Tenant isolation**: every repository method requires and validates `tenantId`. Cross-tenant reads are structurally impossible through the adapter interface.
- **Public access scope**: the public app exposes only `published` content (or `draft` with `?preview=1`) for the resolved tenant.
- **Admin access scope**: admin operations are gated by tenant membership; global admin roles are not assumed.
- **No secrets in code**: all credentials are environment-driven via `.env.local` (gitignored).
- **Audit trail**: append-only `audit_events` table is planned in the data model; no mutation of past events.
- **Legacy isolation**: `legacy/physio-source` has no runtime connection to the product.

---

## Phase Artifacts

After each completed migration phase, ZIP archives are created under `artifacts/phase-zips/` (gitignored):

| Archive | Contents |
|---|---|
| `SovereignCMS-<N>-delta.zip` | Only files changed since `HEAD` |
| `SovereignCMS-<N>-repo-slim.zip` | Full repo without `node_modules`, `.next`, `.turbo`, `dist` |

```bash
npm run phase:zip -- --phase 63

# Custom output directory
SOVEREIGN_PHASE_ZIP_DIR=/path/to/archives npm run phase:zip -- --phase 63
```

Requires `git` and `tar` in `PATH`.
