# Phase 60 — Publish Governance Foundation — Result

## Summary

Structured **publish governance** types and `summarizeGovernanceIssues()` in core; block/page aggregation in admin; unified **PublishGovernancePanel** in the page editor; inspector and toolbar integration. Non-blocking, no workflows, no API routes, no migrations, no new dependencies.

## New / changed files

| Area | File |
|------|------|
| Core | `packages/core/src/publish-governance.ts` |
| Core | `packages/core/src/index.ts` (exports) |
| Admin | `apps/admin/src/lib/content-governance.ts` (→ `PublishGovernanceIssue[]`) |
| Admin | `apps/admin/src/lib/page-governance.ts` |
| Admin | `apps/admin/src/lib/governance-category-icons.tsx` |
| Admin | `apps/admin/src/components/admin-ui/publish-governance-panel.tsx` |
| Admin | `apps/admin/src/components/admin-ui/index.ts` |
| Admin | `apps/admin/src/components/page-editor-client.tsx` |
| Admin | `apps/admin/src/components/editor-inspector.tsx` |
| Admin | `apps/admin/src/components/editor/editor-toolbar.tsx` |
| Admin | `apps/admin/src/lib/admin-i18n/types.ts`, `messages/en.ts`, `messages/de.ts` |
| Docs | `docs/architecture/publish-governance-foundation-phase-60.md` |
| Docs | `docs/migration/phase-60-result.md` |

## Summary helper

`summarizeGovernanceIssues(issues)` returns counts and `readyToPublish: critical === 0`. Pure, no localization.

## Issue mappings (high level)

| Signal | Severity | Category |
|--------|----------|----------|
| Missing alt (renderable image) | warning | accessibility |
| Invalid / unsafe media URL | critical | media |
| External HTTPS media | info | media |
| CTA label without href | warning | content |
| Missing headline/title | warning | editorial |
| Missing embed URL | critical | media |
| Empty text block | warning | content |
| Invalid canonical URL | critical | seo |
| Empty SEO title/description | info | seo |

Duplicate issue ids are deduplicated via `deduplicateGovernanceIssues()`.

## UI integration

- Page editor: governance card above inspector; block jump via `onFocusBlock`.
- Inspector: per-block issues with category icons and critical → destructive alert styling.
- Toolbar: readiness hint (no blocking).

## Limitations

- No navigation-scope checks yet (category reserved).
- No persistence of governance state.
- Block registry / settings forms may still show English field labels when UI locale is DE.
- `getBlockGovernanceWarnings` deprecated shim maps `critical` → `warning` for legacy callers.

## Validation

| Command | Exit | Notes |
|---------|------|-------|
| `npm run typecheck` | **0** | 15 packages (Turbo). |
| `npm run lint` | **0** | Nach Fix des `react-hooks/static-components`-Fehlers in `publish-governance-panel.tsx`. Weiterhin 3 Admin-Warnungen (`admin-avatar`, `create-media-asset-form`, `admin-i18n/index`). |
| `npm run build` | **0** | `apps/web` und `apps/admin` erfolgreich. |

Datum: 2026-05-15.
