/**
 * Provider-neutral query port for Supabase tenant settings (Phase 91).
 * Implemented in `@sovereign-cms/adapter-supabase` (server-side, optional SDK).
 */

import type { TenantSettingsStoragePayload } from "@sovereign-cms/core"

export type SupabaseTenantSettingsRow = {
  tenant_id: string
  settings_json: unknown
  updated_at: string
  updated_by?: string | null
}

export type SupabaseSettingsQueryError = {
  message: string
  code?: string
}

export type SupabaseSettingsQueryResult<T> = {
  data: T | null
  error: SupabaseSettingsQueryError | null
}

export interface SupabaseSettingsClientPort {
  getTenantSettings(input: {
    tenantId: string
  }): Promise<SupabaseSettingsQueryResult<SupabaseTenantSettingsRow | null>>

  upsertTenantSettings(input: {
    tenantId: string
    settingsJson: TenantSettingsStoragePayload
    updatedAt: string
    updatedBy?: string | null
  }): Promise<SupabaseSettingsQueryResult<SupabaseTenantSettingsRow>>
}
