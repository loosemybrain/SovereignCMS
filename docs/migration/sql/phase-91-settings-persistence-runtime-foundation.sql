-- Phase 91: Tenant settings persistence runtime foundation
-- Apply in Supabase/Postgres before DATABASE_ADAPTER=supabase can persist settings.
-- NOT applied automatically by the monorepo.

create table if not exists public.tenant_settings (
  tenant_id text primary key,
  settings_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid null
);

create index if not exists idx_tenant_settings_updated_at on public.tenant_settings (updated_at);

-- settings_json stores TenantSettings fields except tenantId (see packages/core settings-normalize).
-- appearance.customFonts.woff2DataUrl is prototype-only — migrate to media asset references later.

-- Server read (tenantId from resolved scope):
-- select tenant_id, settings_json, updated_at, updated_by
-- from public.tenant_settings
-- where tenant_id = $1;

-- Server upsert:
-- insert into public.tenant_settings (tenant_id, settings_json, updated_at, updated_by)
-- values ($1, $2::jsonb, $3::timestamptz, $4)
-- on conflict (tenant_id)
-- do update set
--   settings_json = excluded.settings_json,
--   updated_at = excluded.updated_at,
--   updated_by = excluded.updated_by;
