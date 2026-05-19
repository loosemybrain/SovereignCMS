# Scoped Non-Content Writes Foundation — Phase 72

## Purpose

Phase 71 scoped **content** writes. Phase 72 extends explicit tenant scope and adapter-level ownership checks to **operational** domains: navigation (including footer), settings, media metadata, and privacy scanner jobs.

No policy engine, no tenant/user UI, no migrations, no API routes.

---

## Write area audit

| Area | Write path | `tenantId` before P72 | Ownership check | Phase 72 status | Risk if skipped |
|------|------------|----------------------|-----------------|-----------------|-----------------|
| **Navigation (main)** | `createNavigationItemAction` → `navigationPersistence` → adapter | In input only | None | **Migrated** | Cross-tenant nav links |
| **Footer** | Same action with `scope: "footer"` | In input only | None | **Migrated** | Same |
| **Settings** | `updateTenantSettingsAction` → `settingsPersistence` | In input only | Store keyed by tenant | **Migrated** | Wrong tenant settings |
| **Media metadata** | `createMediaAssetAction` → `mediaPersistence` | In input only | None | **Migrated** | Cross-tenant media rows |
| **Privacy scan create** | `createPrivacyScanAction` | Partial (`getAdminRuntime`) | Repo filter | **Migrated** | Cross-tenant scans |
| **Privacy approval** | `updatePrivacyScanApprovalAction` | Partial | Repo find by tenant+id | **Migrated** | Wrong scan approval |
| **Governance (editor)** | Pure in-memory checks in admin | N/A | N/A | **Not persisted** | None (no DB writes) |
| **Media file bytes** | `StorageAdapter` (future upload flows) | Separate from metadata | N/A | **Not migrated** | Storage key isolation |
| **Navigation bulk save** | Not implemented | — | — | N/A | — |
| **Brand settings store** | Not separate from tenant settings | — | — | Documented future | — |
| **Media metadata update** | No `updateMedia` API yet | — | — | Future phase | — |

Legacy `legacy/physio-source` writes are out of scope.

---

## Adapter contracts (Phase 72)

| Adapter | Write method | Shape |
|---------|--------------|--------|
| `NavigationPersistenceAdapter` | `createNavigationItem` | `{ tenantId, input }` |
| `SettingsPersistenceAdapter` | `updateTenantSettings` | `{ tenantId, input }` |
| `MediaPersistenceAdapter` | `createMedia` | `{ tenantId, input }` |
| `PrivacyScannerPersistenceAdapter` | `createScan` | `{ tenantId, input }` |
| | `updateScanApproval` | `{ tenantId, input }` |

Reads unchanged except navigation/media/privacy list already required `tenantId`.

---

## Memory adapter invariants

Implemented in `packages/db/src/adapters/memory-*-adapter.ts`:

- `requireScopedContentTenantId` — scope vs input tenant match
- **Navigation:** page-type items verify `pageId` belongs to tenant via `assertPageOwnedByTenant`
- **Settings:** update only affects `tenantSettingsByTenantId` entry for scoped tenant
- **Media:** create stamps normalized `tenantId`
- **Privacy:** `updateScanApproval` verifies scan row belongs to tenant before mutation

Cross-tenant ids → `PersistenceAdapterError` (`tenant_scope_mismatch`, `page_not_found`, `scan_not_found`).

---

## Supabase operational writes

Not implemented (same as content writes in Phase 66). Memory adapters wrap `DatabaseAdapter` only. When Supabase operational tables are added, each write must filter by `tenant_id` and verify ownership — no silent default tenant.

---

## Centralized admin write scope

| Helper | Role |
|--------|------|
| `resolveAdminWriteScope` | `apps/admin/src/lib/resolve-admin-write-scope.ts` — all admin writes |
| `resolveAdminContentWriteScope` | Thin wrapper for content ops (deprecated alias) |
| `prepareContentWrite` / `prepareOperationalWrite` | Auth hook preparation (not enforced) |

Flow:

```
Client tenantId + operation
  → getAdminRuntime() / resolveAdminTenant
  → prepare*Write(scope, operation)
  → assertClientTenantMatchesScope()
  → runtime *Persistence → *PersistenceAdapter
```

---

## Authorization hook points (prepared, not enforced)

| Operation key | Maps to `SovereignPermission` |
|---------------|-------------------------------|
| `navigation:manage` | `navigation:manage` |
| `settings:manage` | `settings:manage` |
| `media:manage` | `media:manage` |
| `privacy:manage` | `privacy:manage` |

**TODO (Phase 73+):** `requireTenantPermission(subject, tenantId, permission)` inside `prepareOperationalWrite` when session subject is reliable.

---

## Remaining limitations

| Limitation | Risk | Future phase |
|------------|------|--------------|
| No `updateMediaMetadata` | Cannot fix wrong tenant on existing asset via API | 73 |
| No bulk navigation reorder/save API | Manual sort only via create | 73 |
| No per-brand settings table | Brand is not a separate persistence boundary | 74 |
| Storage upload not tenant-keyed in active apps | Blob leakage if misconfigured | 73–74 |
| Supabase operational adapters | N/A in memory-only deploys | 66+ |
| Governance | Editor-only, no DB | — |
| Auth enforcement | Open admin | 73+ membership |

---

## Phase 73 update (resolution)

Operational writes use the same centralized admin resolution as content (`resolveAdminWriteScope` → `getAdminRuntime().resolved`). No host/domain routing engine.

---

## Relationship to prior phases

- Phase 70: read scope
- Phase 71: content write scope
- Phase 72: operational write scope (this document)

See [scoped-write-enforcement-phase-71.md](./scoped-write-enforcement-phase-71.md).
