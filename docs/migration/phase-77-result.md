# Phase 77 — Media Runtime Composition Foundation

## Summary

Media resolution is now a **runtime composition concern**: public and admin-preview page loads run blocks through `composePublicBlockMedia` / `composeAdminPreviewBlockMedia` instead of ad-hoc enrichment in apps.

---

## Delivered

| Item | Location |
|------|----------|
| `MediaCompositionMode`, `MediaCompositionResult` | `packages/runtime/src/media/media-composition.ts` |
| `composePublicBlockMedia` | `compose-public-block-media.ts` |
| `composeAdminPreviewBlockMedia` | `compose-admin-preview-block-media.ts` |
| Shared core + batch id collection | `compose-block-media-core.ts` |
| Fallback descriptors | `media-fallbacks.ts` |
| Governance hints | `packages/core/src/media-composition-governance.ts` |
| `stripMediaCompositionMetadata` | save draft safety |

### Wiring

| Path | Change |
|------|--------|
| `apps/web/src/lib/load-public-page.ts` | `composePublicBlockMedia` via `runtime.mediaResolver` |
| `apps/admin/src/lib/load-admin-page-detail.ts` | `composeAdminPreviewBlockMedia` |
| `apps/admin` editor | Server composition hints in governance panel |
| `apps/admin/src/actions/save-page-draft.ts` | Strip `_sovereignMediaComposition` before persist |

### Deprecated

- `apps/web/src/lib/enrich-public-blocks-media.ts` → thin wrapper over `composePublicBlockMedia`

---

## Not implemented

- Upload UI / binary storage / signed URLs / CDN
- Global media cache or `listMediaByIds` batch adapter method
- Client-side async media resolution
- Generic block media registry
- API routes / DB migrations

---

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck` | **15/15** packages passed |
| `npm run lint` | **0 errors** (3 pre-existing admin warnings) |
| `npm run build` | **web + admin** succeeded |
