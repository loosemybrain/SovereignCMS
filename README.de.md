# SovereignCMS

SovereignCMS ist eine modulare, mandantenfähige CMS-Grundlage für portable Deployments — von verwaltetem SaaS bis hin zu vollständig selbst gehosteter souveräner Infrastruktur. Es ist als TypeScript-Monorepo aufgebaut mit sauberer Trennung zwischen Domänenlogik, Runtime-Komposition und Infrastruktur-Adaptern.

---

## Inhaltsverzeichnis

- [Was ist SovereignCMS?](#was-ist-sovereigncms)
- [Architekturübersicht](#architekturübersicht)
- [Monorepo-Struktur](#monorepo-struktur)
- [Schnellstart](#schnellstart)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Packages](#packages)
  - [core](#sovereigncmscore)
  - [db](#sovereigncmsdb)
  - [runtime](#sovereigncmsruntime)
  - [tenancy](#sovereigncmstenancy)
  - [auth](#sovereigncmsauth)
  - [storage](#sovereigncmsstorage)
  - [ui](#sovereigncmsui)
- [Adapter](#adapter)
- [Apps](#apps)
  - [web — Öffentlicher Renderer](#web--öffentlicher-renderer)
  - [admin — CMS-Shell](#admin--cms-shell)
- [Datenmodell](#datenmodell)
- [Inhalts-Lebenszyklus](#inhalts-lebenszyklus)
- [Block-System](#block-system)
- [Mandantenfähigkeit](#mandantenfähigkeit)
- [Lokalisierung & Mehrsprachigkeit](#lokalisierung--mehrsprachigkeit)
- [Infrastruktur-Adapter hinzufügen](#infrastruktur-adapter-hinzufügen)
- [Deployment-Ziele](#deployment-ziele)
- [Entwicklungsbefehle](#entwicklungsbefehle)
- [Sicherheitsprinzipien](#sicherheitsprinzipien)
- [Phasen-Artefakte](#phasen-artefakte)

---

## Was ist SovereignCMS?

SovereignCMS stellt eine produktionsorientierte Grundlage für den Aufbau mandantenfähiger CMS-Systeme bereit. Es ist bewusst migrationssicher: Legacy-Projektartefakte sind unter `legacy/` isoliert und definieren nicht die Produktarchitektur.

**Schlüsseleigenschaften:**
- **Mandantenfähig**: Jede Seite, jeder Block, jedes Navigationselement und jedes Medienobjekt gehört einem Mandanten. Der Mandantenkontext wird pro Anfrage aus dem HTTP-`Host`-Header aufgelöst.
- **Adapter-gesteuert**: Datenbank, Speicher und Authentifizierung sind über Umgebungsvariablen austauschbar. Heute ist nur der In-Memory-Adapter enthalten; Produktions-Adapter (Supabase, PostgreSQL, S3, Keycloak) sind zur Implementierung vorbereitet.
- **Keine Anbieterabhängigkeit**: Das Kerndomänenmodell und die Runtime sind infrastrukturfrei. Cloud-spezifischer Code liegt ausschließlich in `adapters/`.
- **Phasenbasierte Entwicklung**: Die Codebasis entwickelt sich durch benannte, validierte Phasen. Jede Phase erzeugt ZIP-Artefakte, die die Änderungen dokumentieren.

---

## Architekturübersicht

```
┌───────────────────────────────────────────────────────────────────┐
│  apps/web (Next.js :3000)      apps/admin (Next.js :3001)         │
│  Öffentlicher Renderer         CMS-Redaktionsshell                 │
└───────────────────────────┬───────────────────────────────────────┘
                            │ importiert
┌───────────────────────────▼───────────────────────────────────────┐
│  packages/runtime                                                  │
│  Verbindet Adapter, stellt Persistence-Factories & View-Models     │
│  bereit                                                            │
└──────┬────────────┬────────────┬────────────┬─────────────────────┘
       │            │            │            │
  packages/db  packages/auth  packages/storage  packages/tenancy
  (Verträge)   (Verträge)    (Verträge)        (Resolver)
       │            │            │
┌──────▼────────────▼────────────▼──────────────────────────────────┐
│  adapters/supabase  adapters/postgres  adapters/s3  adapters/keycloak │
│  (Infrastruktur-Implementierungen — aktuell Platzhalter-Stubs)     │
└───────────────────────────────────────────────────────────────────┘
       ▲
  packages/core
  Domänentypen, Verträge, Validierung (keine Infrastruktur erlaubt)
```

**Abhängigkeitsrichtung** (strikt, keine Zyklen):

```
apps → packages/runtime → packages/{db,auth,storage,tenancy} → packages/core
adapters/* → packages/*
```

---

## Monorepo-Struktur

```
apps/
  web/          Next.js öffentlicher Renderer (Port 3000)
  admin/        Next.js CMS-Admin-Shell (Port 3001)

packages/
  core/         Domänentypen, Block-Definitionen, Validierung — keine Infra
  db/           DatabaseAdapter-Vertrag + In-Memory-Implementierung
  runtime/      Adapter-Verdrahtung, Persistence-Factories, öffentliche View-Models
  tenancy/      Mandanten-Resolver aus HTTP-Host-Header
  auth/         AuthProvider & RBAC-Verträge
  storage/      StorageAdapter-Vertrag
  ui/           Gemeinsame React-Hilfsmittel (cn-Helper)
  config/       Gemeinsame TypeScript / ESLint / Tailwind-Konfigurationen

adapters/
  supabase/     SaaS-Pfad: Supabase DB + Speicher (Platzhalter)
  postgres/     Gov-Pfad: PostgreSQL DB (Platzhalter)
  s3/           Gov-Pfad: S3/MinIO-Speicher (Platzhalter)
  keycloak/     Gov-Pfad: Keycloak OIDC-Auth (Platzhalter)
  vercel/       Optionale Vercel-Deployment-Metadaten

legacy/
  physio-source/ Isolierte Legacy-Referenzanwendung — kein Produktquellcode

docs/
  architecture/  Designentscheidungen und Systemdokumentation
  migration/     Phasenweise Fortschrittsnotizen
  deployment/    Umgebungsstrategie

scripts/
  clean.mjs           Entfernt .next / dist / .turbo Build-Artefakte
  phase-artifacts.mjs Erstellt Phasen-ZIP-Snapshots
```

---

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsdateien kopieren (eine pro App)
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# 3. Beide Apps starten (web :3000, admin :3001)
npm run dev
```

Die Standardkonfiguration verwendet den **In-Memory-Adapter** mit vordefinierten Demo-Daten. Es ist keine Datenbank erforderlich.

Der Demo-Mandant `demo` ist erreichbar unter `http://localhost:3000` (öffentlich) und `http://localhost:3001` (Admin).

---

## Umgebungsvariablen

Alle Variablen sind in der Entwicklung optional; Standardwerte fallen auf den In-Memory-Adapter zurück.

| Variable | Werte | Standard | Beschreibung |
|---|---|---|---|
| `DATABASE_ADAPTER` | `memory` · `supabase` · `postgres` | `memory` | Datenbank-Backend |
| `STORAGE_ADAPTER` | `memory` · `supabase` · `s3` | `memory` | Datei-Speicher-Backend |
| `AUTH_ADAPTER` | `none` · `supabase` · `keycloak` | `none` | Authentifizierungsanbieter |
| `APP_ENV` | `local` · `development` · `staging` · `production` | `local` | Laufzeitumgebungsbezeichnung |
| `APP_BASE_URL` | URL | — | Öffentliche Basis-URL der Web-App |
| `DEFAULT_LOCALE` | Sprachcode | `de` | Standardsprache für Inhalte |
| `SUPPORTED_LOCALES` | kommagetrennt | `de,en` | Alle unterstützten Sprachen |
| `LOCAL_TENANT_HOST` | Hostname | — | Host-basierte Mandantenauflösung in der Entwicklung überschreiben |
| `LOCAL_TENANT_ID` | Mandanten-Slug | `demo` | Bestimmten Mandanten in der Entwicklung erzwingen |
| `SUPABASE_URL` | URL | — | Supabase-Projekt-URL |
| `SUPABASE_ANON_KEY` | Schlüssel | — | Supabase Anon-Schlüssel |
| `SUPABASE_SERVICE_ROLE_KEY` | Schlüssel | — | Supabase Service-Role-Schlüssel |
| `DATABASE_URL` | Postgres DSN | — | PostgreSQL-Verbindungszeichenfolge |
| `OIDC_ISSUER_URL` | URL | — | Keycloak / OIDC Aussteller |
| `OIDC_CLIENT_ID` | Zeichenfolge | — | OIDC Client-ID |
| `OIDC_CLIENT_SECRET` | Zeichenfolge | — | OIDC Client-Secret |
| `S3_ENDPOINT` | URL | — | S3 / MinIO Endpunkt |
| `S3_BUCKET` | Zeichenfolge | — | S3-Bucket-Name |
| `S3_ACCESS_KEY_ID` | Zeichenfolge | — | S3-Zugriffsschlüssel |
| `S3_SECRET_ACCESS_KEY` | Zeichenfolge | — | S3-Geheimschlüssel |
| `SMTP_HOST` | Hostname | — | SMTP-Host (E-Mail, zukünftig) |

---

## Packages

### `@sovereign-cms/core`

**Pfad:** `packages/core/src/`
**Zweck:** Alle CMS-Domänentypen, Verträge und reine Validierungslogik. Keine Laufzeitabhängigkeiten außer Zod. Muss infrastrukturfrei bleiben.

#### Entitätstypen (`cms.ts`)

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

#### Block-Typen (`blocks.ts`)

| `BlockType` | Props |
|---|---|
| `"hero"` | `headline`, `subline?`, `mediaUrl?`, `mediaAlt?` |
| `"text"` | `body` |
| `"cta"` | `eyebrow?`, `headline`, `body?`, `primaryLabel`, `primaryHref`, `secondaryLabel?`, `secondaryHref?`, `align?` |
| `"feature-grid"` | `headline?`, `intro?`, `columns` (2–4), `items[]` (`id`, `title`, `body?`) |
| `"image-text"` | `headline`, `body?`, `imageUrl?`, `imageAlt?`, `imagePosition` (`left`/`right`), `ctaLabel?`, `ctaHref?` |
| `"contact-form"` | `headline?`, `intro?`, `submitLabel?`, `successMessage?`, `consentLabel?`, `recipientEmail?` |
| `"external-embed"` | `provider`, `title`, `embedUrl`, `consentText?`, `buttonLabel?` |

#### Inhaltsstatus (`content-status.ts`)

```ts
type ContentStatus = "draft" | "published" | "archived"
```

#### Inhaltsübergänge (`content-transition.ts`)

| Von | Aktion | Nach |
|---|---|---|
| `draft` | `publish` | `published` |
| `published` | `archive` | `archived` |
| `archived` | `restoreDraft` | `draft` |

Ungültige Übergänge werden in der Persistenzschicht ausgelöst.

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

#### Mandanten-Einstellungen (`settings.ts`)

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

**Pfad:** `packages/db/src/`
**Zweck:** Definiert das `DatabaseAdapter`-Interface. Enthält den In-Memory-Adapter für die Entwicklung.

#### `DatabaseAdapter`-Interface

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

**Repository-Methoden (Übersicht):**

| Repository | Wichtigste Methoden |
|---|---|
| `TenantRepository` | `findByDomain(domain)` |
| `PageRepository` | `findBySlug({tenantId, locale, slug})`, `list({tenantId, locale?})`, `create(input)`, `saveProps(...)`, `transitionStatus(...)` |
| `BlockRepository` | `listByPage({tenantId, pageId})`, `replacePageBlocks({tenantId, pageId, blocks})` |
| `NavigationRepository` | `list({tenantId, scope?})`, `create(input)` |
| `MediaRepository` | `list({tenantId})`, `create(input)` |
| `SettingsRepository` | `get(tenantId)`, `update({tenantId, patch})` |
| `PrivacyScanRepository` | `list({tenantId})`, `create(input)`, `updateApproval(...)` |

#### In-Memory-Adapter

Vordefinierte Demo-Daten (sofort ohne Konfiguration verfügbar):

- **Mandant:** `demo` — wird für `localhost`, `127.0.0.1` und jeden Host in der Entwicklung aufgelöst
- **Seiten:** Deutsche und englische Startseite (beide `draft`)
- **Navigation:** Hauptnavigation + Footer-Navigation mit Beispiellinks
- **Medien:** Ein Demo-Bild-Asset
- **Einstellungen:** Demo-Seitenname, Tagline, Kontaktdaten, Social Links
- **Datenschutzscans:** Ein abgeschlossener Beispielscan mit Befunden

---

### `@sovereign-cms/runtime`

**Pfad:** `packages/runtime/src/`
**Zweck:** Verbindet Adapter zu einer `SovereignRuntime`; stellt typisierte Persistence-Factories bereit; mappt interne Modelle auf öffentliche View-Models.

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

`createRuntime()` liest `process.env`, ruft `loadRuntimeConfig()` auf und wählt Adapter über `adapter-selection.ts` aus.

#### Persistence-Factories

Alle Factories akzeptieren `{ runtime, tenantId }` und geben ein typisiertes Persistence-Objekt zurück:

| Factory | Zweck |
|---|---|
| `createEditorPersistence` | Seitenentwurf speichern (Titel, Blöcke, SEO) |
| `createPageStatusPersistence` | Inhaltsstatus wechseln |
| `createPageCreationPersistence` | Neue Seite erstellen |
| `createNavigationPersistence` | Navigationselemente auflisten & erstellen |
| `createMediaPersistence` | Medien-Assets auflisten & erstellen |
| `createSettingsPersistence` | Mandanten-Einstellungen abrufen & aktualisieren |
| `createPrivacyScannerPersistence` | Datenschutzscans auflisten, erstellen und genehmigen |

#### Öffentliche View-Model-Pipeline

```
loadPublicPage(host, slug, locale, preview)
  → TenantResolver.resolve(host)
  → db.pages.findBySlug(...)
  → db.blocks.listByPage(...)       (gefiltert nach Sichtbarkeit + Vorschaumodus)
  → db.navigation.list(...)         (Haupt- und Footer-Bereiche)
  → db.settings.get(tenantId)
  → mapToPublicHeaderViewModel(...)
  → mapToPublicFooterViewModel(...)
  → mapToPublicSeoViewModel(...)
  → PublicPagePayload
```

---

### `@sovereign-cms/tenancy`

**Pfad:** `packages/tenancy/src/`
**Zweck:** Löst HTTP-`Host`-Header zu `TenantContext`-Objekten auf.

```ts
interface TenantContext {
  id:          TenantId
  slug:        string
  displayName: string
}

// Web-App: Auflösung aus Host-Header über db.tenants
function createDatabaseTenantResolver(db: DatabaseAdapter): TenantResolver

// Admin-App: Fällt auf LOCAL_TENANT_ID-Umgebungsvariable ("demo") zurück
function resolveAdminTenant(input: { host?: string; env: NodeJS.ProcessEnv }): AdminTenantContext
```

---

### `@sovereign-cms/auth`

**Pfad:** `packages/auth/src/`
**Zweck:** Authentifizierungs- und RBAC-Verträge. Aktuell ist nur der `none`-Anbieter (No-Op) implementiert.

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

**Pfad:** `packages/storage/src/`
**Zweck:** Mandantenfähiger Dateispeicher-Vertrag.

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

Der In-Memory-Speicher-Adapter gibt `memory://<tenantId>/<key>`-URLs zurück und ist ein No-Op für Uploads und Löschvorgänge.

---

### `@sovereign-cms/ui`

**Pfad:** `packages/ui/src/`
**Zweck:** Minimale gemeinsame React-Hilfsmittel.

```ts
import { cn } from "@sovereign-cms/ui"
// Kombiniert Tailwind-Klassen korrekt (clsx + tailwind-merge)
cn("px-4 py-2", bedingung && "bg-blue-600")
```

---

## Adapter

Alle Adapter in `adapters/` sind **Platzhalter-Stubs** — sie implementieren die korrekte Interface-Signatur, lösen aber zur Laufzeit `"Adapter not implemented yet: <name>"` aus.

| Adapter | Package | Implementiert | Verwendungszweck |
|---|---|---|---|
| Supabase | `@sovereign-cms/adapter-supabase` | `DatabaseAdapter` + `StorageAdapter` | SaaS / verwaltet |
| PostgreSQL | `@sovereign-cms/adapter-postgres` | `DatabaseAdapter` | Selbst gehostet / Gov |
| S3 / MinIO | `@sovereign-cms/adapter-s3` | `StorageAdapter` | Selbst gehostet / Gov |
| Keycloak | `@sovereign-cms/adapter-keycloak` | `AuthProvider` | Enterprise SSO |
| Vercel | `@sovereign-cms/adapter-vercel` | Nur Metadaten | Optionales Hosting |

Um einen Adapter zu aktivieren, die entsprechende Umgebungsvariable setzen und neu starten:

```bash
DATABASE_ADAPTER=postgres
STORAGE_ADAPTER=s3
AUTH_ADAPTER=keycloak
```

---

## Apps

### `web` — Öffentlicher Renderer

**Port:** 3000 · **Pfad:** `apps/web/`

Einzige Catch-All-Route: `apps/web/src/app/[[...slug]]/page.tsx`

**Anfrage-Lebenszyklus:**
1. `slug` parsen → `locale` + Seiten-Slug über `resolvePublicLocaleAndSlug()` auflösen
2. `loadPublicPage(host, slug, locale, preview)` aufrufen → `PublicPagePayload`
3. 404 zurückgeben, wenn Seite nicht gefunden oder nicht veröffentlichbar
4. `PublicPageView` rendern → `PublicLayoutShell` + Block-Liste via `PublicBlockRenderer`

**Wichtige Dateien:**

| Datei | Zweck |
|---|---|
| `src/lib/load-public-page.ts` | Vollständige Seiten-Lade-Pipeline |
| `src/components/public/PublicPageView.tsx` | Oberste Seiten-Komponente |
| `src/components/public/PublicBlockRenderer.tsx` | Block-Typ-Dispatcher |
| `src/components/public-layout-shell.tsx` | Header + Main + Footer-Wrapper |
| `src/components/public-header.tsx` | Dunkler Header mit Nav + Sprachumschalter |
| `src/components/public-footer.tsx` | Dunkler Footer mit Kontakt, Nav, Social |
| `src/components/public-contact-form.tsx` | Client-seitiges Kontaktformular mit Honeypot |
| `src/components/public-external-embed.tsx` | Einwilligungsgeschütztes iFrame-Embed |
| `src/components/external-media-gate.tsx` | Einwilligungs-Gate-UI |
| `src/components/consent-provider.tsx` | Cookie-Einwilligungs-Kontext |
| `src/styles/public-surface-system.css` | CSS Design-Tokens und Hilfsklassen |

**Öffentliches Surface-System** (`src/styles/public-surface-system.css`) — Phase 63:

| Token | Wert | Zweck |
|---|---|---|
| `--pub-section-py` | `5rem` / `3rem` mobil | Sektions-Vertikalrhythmus |
| `--pub-container-max` | `80rem` | Äußere Container-Breite (wie Header) |
| `--pub-content-max` | `44rem` | Lesebreiten-Einschränkung |
| `--pub-motion-dur` | `180ms` / `0ms` reduced-motion | Alle Übergänge |
| `--pub-focus-color` | `#3b82f6` | Fokus-Ring-Farbe |

Hilfsklassen: `.pub-container` · `.pub-section-py` · `.pub-section-py-sm` · `.pub-prose` · `.pub-interactive` · `.pub-card` · `.pub-btn-primary` · `.pub-btn-secondary` · `.pub-field`

---

### `admin` — CMS-Shell

**Port:** 3001 · **Pfad:** `apps/admin/`

**Routen:**

| Route | Beschreibung |
|---|---|
| `/` → `/dashboard` | Kennzahlen: Seitenanzahl, Block-Anzahl, Adapter-Info |
| `/pages` | Seitenliste mit Status-Badges und Sprachfilter |
| `/pages/[slug]` | Block-Editor: Blöcke hinzufügen, sortieren, bearbeiten, löschen |
| `/navigation` | Hauptnavigationselemente (Bereich: `main`) |
| `/footer-navigation` | Footer + rechtliche Links + Social Links |
| `/media` | Medien-Asset-Bibliothek mit Upload |
| `/settings` | Mandanten-Einstellungen: Identität, Kontakt, Unternehmen, Rechtliches |
| `/privacy` | Datenschutzscanner-Jobs und Genehmigungsworkflow |

**Datenfluss:**

```
Server-Komponente
  → getAdminRuntime({ host })          apps/admin/src/lib/get-admin-runtime.ts
  → resolveAdminTenant(host, env)      fällt auf LOCAL_TENANT_ID="demo" zurück
  → createRuntime()                    liest env, wählt Adapter
  → Persistence-Factory
  → Rendern mit Initialdaten

Client-Komponente (z.B. PageEditorClient)
  → Benutzerinteraktion
  → Server Action (apps/admin/src/actions/*.ts)
  → getAdminRuntime() + Persistence-Factory
  → Typisiertes Ergebnis an Client zurückgegeben
```

**Server Actions:**

| Action | Beschreibung |
|---|---|
| `savePageDraftAction` | Block-Props und Seitentitel speichern |
| `transitionPageStatusAction` | Status ändern (publish · archive · restoreDraft) |
| `createPageAction` | Neue Seite mit Slug + Sprache erstellen |
| `loadNavigationItemsAction` | Navigationselemente nach Bereich auflisten |
| `createNavigationItemAction` | Navigationselement hinzufügen |
| `loadMediaAssetsAction` | Medien-Assets auflisten |
| `createMediaAssetAction` | Neues Medien-Asset registrieren |
| `loadTenantSettingsAction` | Mandanten-Einstellungen abrufen |
| `updateTenantSettingsAction` | Einstellungs-Patch speichern |
| `loadPrivacyScansAction` | Datenschutzscanner-Jobs auflisten |
| `createPrivacyScanAction` | Datenschutzscan starten |
| `updatePrivacyScanApprovalAction` | Scan-Befunde genehmigen / ablehnen |

---

## Datenmodell

```
tenants (Mandanten)
  id, slug, displayName
  └─ domains: Domain → tenantId (1:n)

pages (Seiten, pro Mandant, pro Sprache)
  id, tenantId, slug, locale, title, status, seoTitle, seoDescription

blocks (Blöcke, pro Seite, geordnet)
  id, tenantId, pageId, type, sortOrder, props (JSON), visible

navigation_items (Navigationselemente, pro Mandant)
  id, tenantId, scope (main|footer|legal|social), type, label, href, sortOrder

media_assets (Medien-Assets, pro Mandant)
  id, tenantId, key, url, alt, mimeType, size

site_settings (Seiten-Einstellungen, pro Mandant — JSON-Blob)
  siteName, tagline, logoUrl, contact{}, legal{}, socialLinks[]

privacy_scan_jobs (Datenschutzscanner-Jobs, pro Mandant)
  id, tenantId, status, startedAt, completedAt, findings[], approvalStatus
```

Mandantengrenzen werden auf Repository-Ebene durchgesetzt: Jede Repository-Methode nimmt `tenantId` entgegen oder validiert es. Mandantenübergreifender Datenzugriff ist über das Adapter-Interface strukturell unmöglich.

---

## Inhalts-Lebenszyklus

```
         ┌──────────────┐
    ┌───▶│   ENTWURF    │◀─────────────┐
    │    └──────┬───────┘              │
    │           │ veröffentlichen      │ alsEntwurfWiederherstellen
    │           ▼                     │
    │    ┌──────────────┐             │
    │    │ VERÖFFENTLICHT│── archivieren ─┘
    │    └──────────────┘
    │
    └── (bleibt Entwurf beim Speichern)
```

- **Entwurf** — frei bearbeitbar; nur mit `?preview=1` sichtbar
- **Veröffentlicht** — für alle öffentlichen Besucher sichtbar
- **Archiviert** — vor der Öffentlichkeit verborgen; als Entwurf wiederherstellbar

`getAvailableActionsForStatus(status)` gibt gültige Aktionen für einen bestimmten Status zurück. Ungültige Übergänge werden in der Persistenzschicht ausgelöst.

---

## Block-System

Block-Typen sind als diskriminierte Union in `packages/core/src/blocks.ts` definiert. Eine `BlockRegistry` mappt jeden `BlockType` auf eine `BlockDefinition`:

```ts
const registry = createBlockRegistry()
registry.get("hero")  // → BlockDefinition
registry.getAll()     // → BlockDefinition[]
```

**Einen neuen Block-Typ hinzufügen:**
1. Den Typ-String zur `BlockType`-Union in `packages/core/src/blocks.ts` hinzufügen
2. Props-Typ und `BlockDefinition` definieren (Label, Standard-Props, Inspektor-Felder)
3. Admin-seitigen Renderer in `apps/admin/src/block-definitions/` hinzufügen
4. Öffentlichen Renderer-Fall in `apps/web/src/components/public/PublicBlockRenderer.tsx` hinzufügen
5. In `createBlockRegistry()` in `packages/core/src/registry.ts` registrieren

---

## Mandantenfähigkeit

Jede Anfrage an `web` und `admin` ist auf einen Mandanten beschränkt:

**Web (öffentlich):**
```
HTTP Host: beispiel.de
  → db.tenants.findByDomain("beispiel.de")
  → TenantContext { id: "t_abc", slug: "beispiel", displayName: "Beispiel GmbH" }
  → alle nachfolgenden Abfragen auf tenantId: "t_abc" beschränkt
```

**Admin:**
```
HTTP Host: localhost:3001
  → resolveAdminTenant({ host, env })
  → fällt auf LOCAL_TENANT_ID="demo" zurück
  → AdminTenantContext { id: "demo", slug: "demo", displayName: "Demo Mandant" }
```

---

## Lokalisierung & Mehrsprachigkeit

Unterstützte Sprachen werden über `SUPPORTED_LOCALES=de,en` konfiguriert. Die erste ist die Standardsprache, sofern `DEFAULT_LOCALE` sie nicht überschreibt.

**URL-Struktur (web):**
- Standardsprache: `/` oder `/ueber-uns` (kein Präfix)
- Nicht-Standardsprache: `/en` oder `/en/about`

Jede Seite hat ein `locale`-Feld — die deutsche und englische Version von `/ueber-uns` sind zwei separate `CmsPage`-Datensätze mit demselben Slug und unterschiedlichen Sprachen.

---

## Infrastruktur-Adapter hinzufügen

1. **Interface implementieren** im entsprechenden `adapters/`-Package:
   - `packages/db/src/contracts.ts` → `DatabaseAdapter`
   - `packages/storage/src/adapter.ts` → `StorageAdapter`
   - `packages/auth/src/contracts.ts` → `AuthProvider`

2. **Fall registrieren** in `packages/runtime/src/adapter-selection.ts`:
   ```ts
   case "postgres":
     return createPostgresAdapter(config)
   ```

3. **Umgebungsvariable setzen** und neu starten:
   ```bash
   DATABASE_ADAPTER=postgres
   DATABASE_URL=postgresql://benutzer:passwort@host/db
   ```

4. **Validieren:** `npm run typecheck && npm run build`

---

## Deployment-Ziele

### SaaS / Verwaltet

```bash
DATABASE_ADAPTER=supabase
STORAGE_ADAPTER=supabase
AUTH_ADAPTER=supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Sovereign / Gov (selbst gehostet)

```bash
DATABASE_ADAPTER=postgres
STORAGE_ADAPTER=s3
AUTH_ADAPTER=keycloak
DATABASE_URL=postgresql://...
S3_ENDPOINT=https://minio.intern
S3_BUCKET=cms-assets
OIDC_ISSUER_URL=https://keycloak.intern/realms/cms
OIDC_CLIENT_ID=cms
OIDC_CLIENT_SECRET=...
```

### Lokale Entwicklung (Standard)

```bash
DATABASE_ADAPTER=memory
STORAGE_ADAPTER=memory
AUTH_ADAPTER=none
LOCAL_TENANT_ID=demo
```

---

## Entwicklungsbefehle

```bash
npm install                                    # Alle Workspace-Abhängigkeiten installieren
npm run dev                                    # Web (:3000) + Admin (:3001) starten
npm run dev:web                                # Nur Web starten
npm run dev:admin                              # Nur Admin starten
npm run build                                  # Produktions-Build (beide Apps)
npm run typecheck                              # TypeScript-Prüfung (alle Packages)
npm run lint                                   # ESLint (alle Packages)
npm run clean                                  # .next, dist, .turbo entfernen

# Auf einen einzelnen Workspace filtern
npx turbo typecheck --filter=@sovereign-cms/core
npx turbo build --filter=@sovereign-cms/admin

# Phasen-ZIP-Artefakt nach einem erfolgreichen Migrationsschritt
npm run phase:zip -- --phase 63
```

Es gibt keine automatisierten Testsuiten. Korrektheit wird über `typecheck` + `lint` + `build` validiert.

---

## Sicherheitsprinzipien

- **Mandanten-Isolation**: Jede Repository-Methode erfordert und validiert `tenantId`. Mandantenübergreifende Lesezugriffe sind über das Adapter-Interface strukturell unmöglich.
- **Öffentlicher Zugriffsbereich**: Die öffentliche App gibt nur `published`-Inhalte (oder `draft` mit `?preview=1`) für den aufgelösten Mandanten zurück.
- **Admin-Zugriffsbereich**: Admin-Operationen sind durch Mandantenmitgliedschaft gesichert; globale Admin-Rollen werden nicht vorausgesetzt.
- **Keine Geheimnisse im Code**: Alle Zugangsdaten werden über `.env.local` (gitignoriert) als Umgebungsvariablen bereitgestellt.
- **Prüfpfad**: Eine nur-anhängende `audit_events`-Tabelle ist im Datenmodell geplant; keine Mutation vergangener Ereignisse.
- **Legacy-Isolation**: `legacy/physio-source` hat keine Laufzeitverbindung zum Produkt.

---

## Phasen-Artefakte

Nach jedem abgeschlossenen Migrationsschritt werden ZIP-Archive unter `artifacts/phase-zips/` erstellt (gitignoriert):

| Archiv | Inhalt |
|---|---|
| `SovereignCMS-<N>-delta.zip` | Nur seit `HEAD` geänderte Dateien |
| `SovereignCMS-<N>-repo-slim.zip` | Vollständiges Repo ohne `node_modules`, `.next`, `.turbo`, `dist` |

```bash
npm run phase:zip -- --phase 63

# Benutzerdefiniertes Ausgabeverzeichnis
SOVEREIGN_PHASE_ZIP_DIR=/pfad/zu/archiven npm run phase:zip -- --phase 63
```

Erfordert `git` und `tar` im `PATH`.
