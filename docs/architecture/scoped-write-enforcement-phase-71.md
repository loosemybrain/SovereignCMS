# Scoped Write Enforcement Foundation — Phase 71

## Purpose

Phase 70 made **content reads** tenant-scoped. Phase 71 begins **controlled write enforcement** for content (pages + blocks) only — without migrating settings, navigation, media, privacy, or auth writes.

No full RBAC engine, no permission UI, no migrations, no new API routes.

---

## Write path audit (active monorepo)

| Write area | Access path | `tenantId` explicit? | Provider coupling | Cross-tenant risk | Phase 71 status | Priority |
|------------|-------------|----------------------|-------------------|-------------------|-----------------|----------|
| **Block save (editor)** | `savePageDraftAction` → `editorPersistence` → `content.saveBlocks` | Yes (client + server scope) | Memory DB / Supabase content adapter | Medium → **mitigated** | **Migrated** | P0 |
| **Page create** | `createPageAction` → `pageCreationPersistence` → `content.createPage` | Yes | Memory / Supabase (write N/I) | Medium → **mitigated** | **Migrated** | P0 |
| **Page status (publish/archive)** | `transitionPageStatusAction` → `pageStatusPersistence` → `content.transitionPageStatus` | Yes | Memory / Supabase (write N/I) | Medium → **mitigated** | **Migrated** | P0 |
| **Page update (metadata)** | No dedicated `updatePage` — SEO lives in draft payload only | N/A | — | Low | Not applicable | — |
| **Page delete** | Not implemented in active admin | N/A | — | — | Not applicable | — |
| **Block reorder** | Same as save (full block list replace) | Via save | Memory | **Mitigated** with save | **Migrated** | P0 |
| **Settings** | `updateTenantSettingsAction` → `settingsPersistence` → `db.settings` | In `UpdateTenantSettingsInput` | Direct `DatabaseAdapter` | High | **Not migrated** | P1 |
| **Navigation create** | `createNavigationItemAction` → `navigationPersistence` | In input | Direct `DatabaseAdapter` | High | **Not migrated** | P1 |
| **Footer navigation** | Same as navigation (`scope: footer`) | In input | Direct `DatabaseAdapter` | High | **Not migrated** | P1 |
| **Media create** | `createMediaAssetAction` → `mediaPersistence` | In input | Direct `DatabaseAdapter` | Medium | **Not migrated** | P2 |
| **Privacy scanner** | Not wired in admin actions yet | — | — | Low | **Not migrated** | P3 |
| **Auth / admin session** | `AUTH_ADAPTER=none` | — | Auth package | N/A | Unchanged | — |

Legacy `legacy/physio-source` Supabase writes are **out of scope** (reference only).

---

## Content adapter write contract (Phase 71)

`ContentPersistenceAdapter` writes:

| Method | Shape | Ownership check |
|--------|--------|-----------------|
| `createPage` | `{ tenantId, input: CreatePageInput }` | Scope/input tenant match |
| `transitionPageStatus` | `{ tenantId, input: TransitionPageStatusInput }` | Page must exist for tenant |
| `saveBlocks` | `{ tenantId, pageId, locale, blocks }` | Page must exist for tenant |

Helpers (`packages/db/src/adapters/`):

- `requireScopedContentTenantId` — scope vs input tenant
- `assertPageOwnedByTenant` — throws `tenant_scope_mismatch` / `page_not_found`

---

## Memory adapter write behavior

- `createPage` — normalizes `tenantId`, delegates to `pages.create`
- `transitionPageStatus` — loads page in tenant, asserts ownership, then `transitionStatus`
- `saveBlocks` — asserts page ownership, then `replacePageBlocks` (repo also validates tenant+locale)

Cross-tenant page id + wrong tenant → **rejected** with `PersistenceAdapterError`.

---

## Supabase adapter write behavior

Writes remain **not implemented** (Phase 66). Phase 71 adds:

- `requireScopedContentTenantId` on entry (fails fast on scope mismatch before N/I throw)
- When writes are implemented: must filter/update by `tenant_id` and verify page ownership like reads

---

## Runtime / server write paths (migrated)

```
Admin client
  → server action (resolveAdminContentWriteScope)
      → prepareContentWrite(scope, operation)   // auth hook prepared, not enforced
      → assertClientTenantMatchesScope()
      → runtime.*Persistence → runtime.content.*
```

Central helper: `apps/admin/src/lib/resolve-admin-content-write-scope.ts`

Runtime facades now use `ContentPersistenceAdapter` instead of direct `db.pages` / `db.blocks` for:

- `createEditorPersistence`
- `createPageCreationPersistence`
- `createPageStatusPersistence`

---

## Authorization hook (prepared, not enforced)

`prepareContentWrite(scope, operation, subject?)` maps:

| Operation | Permission (future) |
|-----------|---------------------|
| `page:create` | `page:create` |
| `page:update` | `page:update` |
| `page:delete` | `page:delete` |
| `page:publish` | `page:publish` |

**TODO (Phase 72+):** call `requireTenantPermission(subject, tenantId, permission)` when membership-backed `AuthorizationSubject` is available.

**Not enforced in Phase 71** — open admin must keep working.

---

## Error handling

| Code | Meaning | User-facing (via `toWriteScopeUserMessage`) |
|------|---------|-----------------------------------------------|
| `tenant_scope_required` | Missing tenant id | Generic scope invalid |
| `tenant_scope_mismatch` | Client scope ≠ server or page wrong tenant | Generic scope invalid |
| `page_not_found` | Page id not in tenant | Page not found for tenant |

No localization system; server actions may throw `Error` with validation messages for bad input.

---

## Remaining unscoped writes (at Phase 71)

Settings, navigation/footer, media metadata, and privacy scanner were migrated in **Phase 72**. See [scoped-non-content-writes-phase-72.md](./scoped-non-content-writes-phase-72.md).

Still open after Phase 72: media storage bytes, `updateMediaMetadata`, bulk navigation save, Supabase operational adapters.

---

## Phase 73 update (resolution)

Admin/content write scope uses `resolveAdminTenantContext` and `toTenantRuntimeScope` from `getAdminRuntime().resolved` — see [tenant-runtime-resolution-phase-73.md](./tenant-runtime-resolution-phase-73.md).

---

## Relationship to Phase 70

- **Reads:** `assertTenantScope` + adapter read filters (unchanged)
- **Writes:** adapter ownership checks + admin write scope resolution (new)

See [tenant-enforcement-runtime-phase-70.md](./tenant-enforcement-runtime-phase-70.md).

---

## Intentionally not included

- Full RBAC / dynamic policies
- Permission or tenant management UI
- DB migrations
- API routes
- Auth provider / MFA changes
- Public rendering changes
- Editor data shape changes
