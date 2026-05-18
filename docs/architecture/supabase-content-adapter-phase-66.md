# Supabase Content Adapter — Phase 66

## Position in architecture

Supabase is the **first content persistence implementation**, not the CMS core.

- Core (`packages/core`) has no Supabase types or imports.
- Mapping lives in `packages/db/src/adapters/supabase/*`.
- SDK usage lives in `adapters/supabase/src/content-client.ts` (server-only).
- Apps use `runtime.content`, never a Supabase client.

## Client creation

- Server-side only (`createSupabaseContentClientPort()`).
- Uses `@supabase/supabase-js` as an **optional** dependency of `@sovereign-cms/adapter-supabase`.
- Never passed into Client Components.
- Never imported from `packages/core` or client bundles.

## Returned data

Adapters return plain `CmsPage` and `CmsBlock` objects from `@sovereign-cms/core`.

Supabase row shapes (`SupabasePageRow`, `SupabaseBlockRow`) stay inside the adapter boundary and are not exported to apps.

## RLS and auth

- RLS policies are **deployment-specific**; the CMS does not assume `auth.uid()` in core logic.
- Server reads must filter by `tenant_id` in queries (explicit `.eq("tenant_id", …)`).
- Service role vs anon key is an operator choice; document your threat model per deployment.
- Supabase Auth remains a separate concern (`AUTH_ADAPTER`), not mixed into content reads.

## Unsupported operations (Phase 66)

The Supabase content adapter intentionally throws for:

- `createPage`
- `transitionPageStatus`
- `saveBlocks`

Editor draft saves continue to use `DatabaseAdapter.blocks` (in-memory in hybrid mode).

## Failure modes

| Condition | Behavior |
|-----------|----------|
| `DATABASE_ADAPTER=supabase` without SDK | `PersistenceAdapterError` (`sdk_unavailable`) |
| Missing `SUPABASE_URL` / keys | `PersistenceAdapterError` (`config_missing`) |
| PostgREST error | `PersistenceAdapterError` (`supabase_query_failed`) with message only |
| `DATABASE_ADAPTER=postgres` | Clear unsupported error at composition time |

## Future adapters

Postgres/SQLite/Prisma implementations can implement the same `ContentPersistenceAdapter` interface without changing apps, provided they map to the same core types and table contract (or a documented alternate mapping layer).
