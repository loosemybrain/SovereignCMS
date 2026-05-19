-- =============================================================================
-- DRAFT — NOT APPLIED — SovereignCMS tenant_user_memberships
-- Phase 69: documentation-only SQL for Postgres / Supabase-style deployments.
--
-- Do NOT place this file in application migration runners.
-- SQLite, Prisma, or plain Postgres adapters may use different physical types.
-- Review with your security/RLS model before production use.
-- =============================================================================

-- Optional extension for gen_random_uuid() on Postgres without Supabase:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tenant_user_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sovereign tenant identifier (matches CMS tenantId string, not legacy "brand")
  tenant_id text NOT NULL,

  -- Provider-neutral auth subject (e.g. Supabase auth.users.id, Keycloak sub)
  user_id text NOT NULL,

  -- Denormalized display metadata (not used for authentication)
  email text,
  display_name text,

  -- Controlled role enum values: owner | admin | editor | viewer
  roles text[] NOT NULL DEFAULT '{}',

  -- Optional explicit permission overrides (SovereignPermission strings)
  permissions text[],

  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'invited', 'disabled')),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT tenant_user_memberships_tenant_user_unique UNIQUE (tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_user_memberships_tenant_id
  ON tenant_user_memberships (tenant_id);

CREATE INDEX IF NOT EXISTS idx_tenant_user_memberships_user_id
  ON tenant_user_memberships (user_id);

CREATE INDEX IF NOT EXISTS idx_tenant_user_memberships_status
  ON tenant_user_memberships (status);

-- -----------------------------------------------------------------------------
-- Portability concerns (comments only)
-- -----------------------------------------------------------------------------
-- 1. text[] is Postgres-specific. SQLite: store roles/permissions as JSON text.
-- 2. timestamptz: use ISO strings in adapters for provider-neutral mapping.
-- 3. RLS: if enabled, policies belong in deployment docs — not assumed by CMS core.
--    Example (Supabase): allow read own rows + admin service role for management.
-- 4. user_id must match the canonical id from your AUTH_ADAPTER implementation.
-- 5. Do not store raw OIDC claim blobs in this table — use provider_identity_links
--    if multi-provider linking is required (future optional table).

-- -----------------------------------------------------------------------------
-- Optional future: provider_identity_links (DRAFT — not created here)
-- -----------------------------------------------------------------------------
-- CREATE TABLE provider_identity_links (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id text NOT NULL,
--   provider text NOT NULL,
--   provider_subject text NOT NULL,
--   created_at timestamptz NOT NULL DEFAULT now(),
--   UNIQUE (provider, provider_subject)
-- );
