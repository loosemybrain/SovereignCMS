-- Settings persistence foundation (SovereignCMS)
-- Target table: site_settings (see docs/architecture/tenant-data-model.md)
-- NOT applied automatically — review with your Supabase/Postgres deployment.

-- One row per tenant + locale; `settings` JSON stores the full TenantSettings shape
-- (siteIdentity, contact, business, legal, socialLinks, appearance, updatedAt).

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'de',
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_site_settings_tenant_id ON site_settings (tenant_id);

-- Example read (server-scoped; tenantId from resolved scope, never from client alone):
-- SELECT settings FROM site_settings WHERE tenant_id = $1 AND locale = $2;

-- Example upsert (adapter must set persisted: true only after successful write):
-- INSERT INTO site_settings (tenant_id, locale, settings, updated_at)
-- VALUES ($1, $2, $3::jsonb, now())
-- ON CONFLICT (tenant_id, locale)
-- DO UPDATE SET settings = EXCLUDED.settings, updated_at = now();

-- appearance lives inside settings JSON:
-- settings->'appearance' -> themeTokens, customFonts, spinner
-- Do NOT store Base64 fonts long-term; migrate to media asset references later.
