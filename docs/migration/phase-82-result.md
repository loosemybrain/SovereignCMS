# Phase 82 — Preview Isolation Foundation

## Summary

Static **preview-isolation contracts** describe how block types should be treated in admin/editor preview. Admin shows optional, deduplicated editorial hints; renderers and governance issue builders are unchanged.

---

## Delivered

| Item | Location |
|------|----------|
| `BlockPreviewIsolationMode`, `BlockPreviewIsolationReason`, `BlockPreviewIsolationContract` | `packages/core/src/block-preview-isolation-contracts.ts` |
| `BLOCK_PREVIEW_ISOLATION_CONTRACTS` | All 7 existing block types (hero, text, cta, feature-grid, image-text, contact-form, external-embed) |
| Helpers | `getBlockPreviewIsolationContract`, `getBlockPreviewIsolationMode`, `getBlockPreviewIsolationReasons`, `hasBlockPreviewIsolationReason`, `isPreviewIsolatedBlock`, `requiresExternalPreviewPlaceholder`, `requiresFormPreviewDisabled` |
| Core exports | `packages/core/src/index.ts` |
| Preview isolation hints | `apps/admin/src/lib/block-preview-isolation-hints.ts` |
| i18n | `editor.orientation.previewIsolationHints` (en/de) |
| UI (minimal) | `editor-selected-block-context.tsx`, `publish-governance-panel.tsx` |
| Architecture doc | `docs/architecture/preview-isolation-foundation-phase-82.md` |

### Block modes (reference)

| Block | Mode | Reasons (summary) |
|-------|------|-------------------|
| hero | `media-safe` | media-resolution, governance-review |
| text | `none` | — |
| cta | `navigation-safe` | navigation-targets, governance-review |
| feature-grid | `none` | — |
| image-text | `media-safe` | media-resolution, navigation-targets, governance-review |
| contact-form | `form-disabled` | form-submission, consent-required, tenant-boundary, governance-review |
| external-embed | `external-placeholder` | external-media, consent-required, tenant-boundary, governance-review |

---

## Not implemented

- Preview engine, sandbox, CSP, middleware preview context
- Renderer refactors or contract reads inside renderers
- Merge with capability / editor / media / governance contracts
- Automatic inference from capabilities
- Publish blocking, inspector automation, JSON policies
- Runtime reflection or orchestrator

### Renderer note (optional check)

Existing admin preview paths already approximate isolation behavior (e.g. disabled contact-form fields, external-embed placeholder UI). No code changes were required for Phase 82 acceptance.

---

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck` | **15/15** packages passed |
| `npm run lint` | **0 errors** (3 pre-existing admin warnings) |
