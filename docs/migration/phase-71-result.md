# Phase 71 — Scoped Write Enforcement Foundation

## Summary

Content **writes** (page create, status transition, block save) are now tenant-scoped at the adapter and admin server-action boundaries. Other write domains remain documented but unmigrated.

---

## Delivered

### Audit

- [scoped-write-enforcement-phase-71.md](../architecture/scoped-write-enforcement-phase-71.md) — full write-path matrix

### Adapter contract

- `createPage({ tenantId, input })`
- `transitionPageStatus({ tenantId, input })`
- `saveBlocks` unchanged shape; ownership enforced in memory adapter

### Adapter invariants

| Module | Role |
|--------|------|
| `assert-content-write-tenant.ts` | Scope/input match + page ownership |
| `memory-content-adapter.ts` | Write guards before mutation |
| `supabase/content-adapter.ts` | Scope validation on write entry (still N/I) |

### Runtime

- `editorPersistence`, `pageCreationPersistence`, `pageStatusPersistence` → `content` adapter
- `prepareContentWrite`, `assertClientTenantMatchesScope`, `toWriteScopeUserMessage`

### Admin server actions

- `resolve-admin-content-write-scope.ts`
- `save-page-draft.ts`, `create-page.ts`, `transition-page-status.ts` use central scope + `getAdminRuntime`

---

## Not migrated

- Settings, navigation, footer, media, privacy scanner
- Auth / admin guards (unchanged)
- Supabase content writes (still not implemented)

---

## Manual verification

1. **Editor save:** Open `/pages/<slug>`, edit blocks, Save — succeeds for demo tenant.
2. **Publish:** Transition draft → published — still works.
3. **Create page:** Create new page form — still works.
4. **Public site:** Home/page still renders (reads unchanged).
5. **Tenant mismatch (dev):** Call `content.saveBlocks` with wrong `tenantId` for a known `pageId` — expect `tenant_scope_mismatch` or `page_not_found` (memory mode).

No unit test framework in active `packages/*` — manual steps only.

---

## Validation results

| Command | Result |
|---------|--------|
| `npm run typecheck` | ✅ 15/15 |
| `npm run lint` | ✅ 0 Fehler (3 bestehende Admin-Warnungen) |
| `npm run build` | ✅ web + admin |

---

## Phase ZIP

```bash
npm run sprint:finish -- --phase 71
```
