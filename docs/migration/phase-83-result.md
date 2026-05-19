# Phase 83 — Runtime Validation Foundation

## Summary

Block-type-only runtime validation evaluates static governance, preview-isolation, and capability contracts and returns structured editorial hints. Admin shows one deduplicated hint; no publish blocking or renderer changes.

---

## Delivered

| Item | Location |
|------|----------|
| `BlockRuntimeValidationSeverity`, `BlockRuntimeValidationCode`, `BlockRuntimeValidationIssue`, `BlockRuntimeValidationResult` | `packages/core/src/block-runtime-validation.ts` |
| `createBlockRuntimeValidationIssue`, `validateBlockRuntimeSemantics`, `hasRuntimeValidationErrors`, `hasRuntimeValidationWarnings` | same |
| Core exports | `packages/core/src/index.ts` |
| Admin hints | `apps/admin/src/lib/block-runtime-validation-hints.ts` |
| i18n | `editor.orientation.runtimeValidationHints` (en/de) |
| UI (minimal) | `editor-selected-block-context.tsx`, `publish-governance-panel.tsx` |
| Architecture doc | `docs/architecture/runtime-validation-foundation-phase-83.md` |

### Validation mapping (known block types)

| Trigger | Code | Typical severity |
|---------|------|------------------|
| Governance `media-alt-text` | `missing-media-alt-text` | warning |
| Governance `external-media` | `external-media-requires-consent` | warning / error if critical |
| Governance `forms` | `form-requires-privacy-review` | warning / error if critical |
| Governance `navigation` or isolation `navigation-safe` | `navigation-target-review` | warning |
| Preview isolation mode ≠ `none` | `preview-isolation-required` | info / warning |
| Governance severity `critical` | `governance-review-required` | warning |
| Unknown block type (no capability contract) | `unknown-block-type` | warning (single issue) |

---

## Not implemented

- Props / schema / Zod validation
- Rule engine, JSON policies, runtime reflection
- Publish blocking from validation results
- Inspector automation, security enforcement
- Renderer changes
- Merge with other contract registries

---

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck` | **15/15** packages passed |
| `npm run lint` | **0 errors** (3 pre-existing admin warnings) |
