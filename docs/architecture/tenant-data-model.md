# Tenant Data Model (Target)

Dieses Dokument definiert das **produktneutrale Zielmodell** fuer SovereignCMS. Die Tabellen sind als fachliche Read/Write-Modelle zu verstehen (unabhaengig von konkretem DB-Adapter).

## Grundprinzipien

- Jede fachliche Tabelle enthaelt `tenant_id`.
- Eindeutige Seitenslugs: `UNIQUE(tenant_id, locale, slug)`.
- `tenant_domains.domain` ist global eindeutig.
- Media-Keys beginnen immer mit `tenant_id`.
- Admin-Zugriff nur ueber `tenant_members`.
- Public-Zugriff nur auf `published` Content des aufgeloesten Tenants.
- `audit_events` sind append-only (kein Update/Delete fachlicher Events).

## Tabellen

### `tenants`

- `id` (pk)
- `tenant_id` (gleich `id`, fuer Konsistenzregeln in Cross-Schemas)
- `slug`
- `display_name`
- `status` (`active|suspended|archived`)
- `created_at`, `updated_at`

### `tenant_domains`

- `id` (pk)
- `tenant_id` (fk -> tenants.id)
- `domain` (**global unique**)
- `is_primary`
- `created_at`, `updated_at`

### `tenant_members`

- `id` (pk)
- `tenant_id` (fk)
- `user_id` (fk -> user_profiles.id)
- `membership_status` (`invited|active|disabled`)
- `created_at`, `updated_at`

### `user_profiles`

- `id` (pk)
- `tenant_id` (fk)
- `email`
- `display_name`
- `locale`
- `created_at`, `updated_at`

### `roles`

- `id` (pk)
- `tenant_id` (fk)
- `key` (z. B. `owner`, `admin`, `editor`)
- `name`
- `created_at`, `updated_at`

### `permissions`

- `id` (pk)
- `tenant_id` (fk)
- `key` (z. B. `pages.publish`)
- `description`
- `created_at`, `updated_at`

### `role_permissions`

- `id` (pk)
- `tenant_id` (fk)
- `role_id` (fk -> roles.id)
- `permission_id` (fk -> permissions.id)
- `created_at`, `updated_at`

### `pages`

- `id` (pk)
- `tenant_id` (fk)
- `locale`
- `slug`
- `title`
- `status` (`draft|published|archived`)
- `seo` (json)
- `created_at`, `updated_at`

Constraints:
- `UNIQUE(tenant_id, locale, slug)`

### `blocks`

- `id` (pk)
- `tenant_id` (fk)
- `page_id` (fk -> pages.id)
- `type`
- `sort_order`
- `props` (json)
- `visibility` (`visible|hidden|scheduled`)
- `created_at`, `updated_at`

### `media_folders`

- `id` (pk)
- `tenant_id` (fk)
- `parent_id` (nullable fk -> media_folders.id)
- `name`
- `path`
- `created_at`, `updated_at`

### `media_assets`

- `id` (pk)
- `tenant_id` (fk)
- `folder_id` (fk -> media_folders.id)
- `storage_key` (beginnt mit `tenant_id/`)
- `filename`
- `content_type`
- `size_bytes`
- `created_at`, `updated_at`

### `navigation`

- `id` (pk)
- `tenant_id` (fk)
- `locale`
- `version`
- `items` (json)
- `created_at`, `updated_at`

### `footer`

- `id` (pk)
- `tenant_id` (fk)
- `locale`
- `content` (json)
- `created_at`, `updated_at`

### `theme_presets`

- `id` (pk)
- `tenant_id` (fk)
- `name`
- `tokens` (json)
- `is_default`
- `created_at`, `updated_at`

### `site_settings`

- `id` (pk)
- `tenant_id` (fk)
- `locale`
- `settings` (json)
- `created_at`, `updated_at`

### `popups`

- `id` (pk)
- `tenant_id` (fk)
- `locale`
- `status` (`draft|published|archived`)
- `payload` (json)
- `created_at`, `updated_at`

### `consent_settings`

- `id` (pk)
- `tenant_id` (fk)
- `locale`
- `policy_version`
- `categories` (json)
- `created_at`, `updated_at`

### `audit_events`

- `id` (pk)
- `tenant_id` (fk)
- `actor_user_id` (nullable fk -> user_profiles.id)
- `event_type`
- `entity_type`
- `entity_id`
- `payload` (json)
- `created_at`

Regel:
- Append-only: fachlich keine Mutation/Loeschung vorhandener Events.

## Access Rules (Runtime)

- Admin-Runtime prueft Mitgliedschaft in `tenant_members` plus Rollen-/Berechtigungsableitung.
- Public-Runtime liest ausschliesslich `published` Inhalte des durch Host aufgeloesten Tenants.
- Alle Repository-Methoden erhalten tenant-scoped Parameter.