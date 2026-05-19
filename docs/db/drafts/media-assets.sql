-- DRAFT ONLY — Phase 75
-- Not applied by migrations. Review before any executable migration phase.

-- Provider-neutral media metadata (bytes live in object storage, not this table).

CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  storage_provider TEXT NOT NULL,
  storage_key TEXT,
  public_url TEXT,
  external_url TEXT,
  mime_type TEXT,
  file_name TEXT,
  alt TEXT,
  label TEXT,
  visibility TEXT NOT NULL DEFAULT 'private',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT media_assets_status_check
    CHECK (status IN ('active', 'draft', 'archived', 'orphaned')),

  CONSTRAINT media_assets_visibility_check
    CHECK (visibility IN ('public', 'private')),

  CONSTRAINT media_assets_storage_provider_check
    CHECK (storage_provider IN ('supabase', 's3', 'local', 'external', 'unknown'))
);

CREATE INDEX IF NOT EXISTS media_assets_tenant_id_idx ON media_assets (tenant_id);

-- Optional uniqueness when object key is assigned (nullable storage_key).
CREATE UNIQUE INDEX IF NOT EXISTS media_assets_provider_key_unique
  ON media_assets (tenant_id, storage_provider, storage_key)
  WHERE storage_key IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Portability notes
-- ---------------------------------------------------------------------------
-- SQLite: use TEXT for id (nanoid/uuid string), omit gen_random_uuid() default.
-- Prisma: model MediaAsset { id String @id @default(uuid()) tenantId String ... }
-- Supabase: enable RLS with tenant_id = auth.jwt() claim when auth is wired.
-- Cross-tenant SELECT must be denied at RLS + adapter tenantId parameter.
