# Phase 72 — Scoped Non-Content Writes Foundation

## Summary

Operational writes for **navigation** (main + footer), **settings**, **media metadata**, and **privacy scanner** are now tenant-scoped at the adapter and admin server-action layers.

---

## Delivered

### Audit & architecture

- [scoped-non-content-writes-phase-72.md](../architecture/scoped-non-content-writes-phase-72.md)

### Adapter contracts (`packages/db/src/adapters/types.ts`)

- Scoped write params for navigation, settings, media, privacy scanner

### Memory adapters (new)

| File | Domain |
|------|--------|
| `memory-navigation-adapter.ts` | Navigation + footer (`scope`) |
| `memory-settings-adapter.ts` | Tenant settings |
| `memory-media-adapter.ts` | Media metadata create |
| `memory-privacy-scanner-adapter.ts` | Scan create + approval |

### Runtime

- `operational-persistence.ts` — resolves adapters from `DatabaseAdapter`
- Facades use adapters instead of direct `db.*` for writes
- `prepareOperationalWrite`, `OperationalWriteOperation`, `AdminWriteOperation`

### Admin

- `resolve-admin-write-scope.ts` — unified write scope
- Actions updated: navigation, settings, media, privacy create/approval

---

## Not migrated

- Media storage bytes / upload pipeline
- Media metadata update (no API)
- Bulk navigation save/reorder
- Per-brand settings store
- Governance persistence (editor-only, no DB)
- Supabase operational adapters
- Permission enforcement (hooks only)

---

## Manual verification

1. **Settings:** `/settings` — save site identity; reload persists for demo tenant.
2. **Navigation:** Add main nav item — succeeds.
3. **Footer:** Add footer nav item (`scope: footer`) — succeeds.
4. **Media:** Create media asset — succeeds.
5. **Privacy:** Create scan + change approval — succeeds.
6. **Editor:** Page save + publish still work (Phase 71).
7. **Public web:** Pages still render.

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
npm run sprint:finish -- --phase 72
```
