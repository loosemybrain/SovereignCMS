# Runtime Validation Foundation (Phase 83)

## Purpose

Phase 83 adds a **small, explicit runtime-validation layer** in `@sovereign-cms/core` that evaluates **static contracts** for a given `blockType` and returns structured **hints** (`BlockRuntimeValidationIssue[]`).

It answers: “Given our known contracts, what semantic reminders apply to this block type?” — not “Are these props valid?”

## What this is not

| Not in scope | Why |
|--------------|-----|
| Schema engine / Zod everywhere | No dynamic schemas or field paths |
| Props validation | `validateBlockRuntimeSemantics` accepts **only** `blockType` |
| Rule engine | No rules JSON, scoring, or inference chains |
| Publish workflow | Results do not block save or publish |
| Inspector validator | No field-level automation |
| Runtime reflection | No registry introspection beyond static maps |
| Security enforcement | Severities are editorial, not access control |

## Relationship to other contract layers

| Layer | Phase | Role |
|-------|-------|------|
| Media contracts | 78 | Media field paths |
| Capability contracts | 79 | Semantic capabilities |
| Editor contracts | 80 | Editor surfaces |
| Governance contracts | 81 | Editorial concerns & severity |
| Preview isolation | 82 | Preview treatment modes |
| **Runtime validation** | **83** | **Structured hints derived from the above** |

Validation **does not replace** any contract file. It **reads** governance, preview-isolation, and capability registries.

### vs governance

Governance declares **concerns** and **severity**. Runtime validation **materializes** selected concerns into coded issues (e.g. `missing-media-alt-text`).

### vs preview isolation

Preview isolation declares **modes** (`form-disabled`, `external-placeholder`, …). Validation emits `preview-isolation-required` when `mode !== "none"`.

### vs editor contracts

Editor contracts describe **where** to edit. Validation does not inspect surfaces or inspector fields.

## API

```ts
validateBlockRuntimeSemantics(blockType: string): BlockRuntimeValidationResult
```

### Issue codes

- `missing-media-alt-text` — governance `media-alt-text`
- `external-media-requires-consent` — governance `external-media` (error if governance critical)
- `form-requires-privacy-review` — governance `forms` (error if critical)
- `navigation-target-review` — governance `navigation` or isolation `navigation-safe`
- `preview-isolation-required` — isolation mode ≠ `none`
- `governance-review-required` — governance severity `critical`
- `unknown-block-type` — block type not in capability contracts

### Unknown blocks

Exactly one **warning** issue with code `unknown-block-type` and the fixed German message from the phase spec. No inference, no fallback contracts.

### Helpers

| Helper | Behavior |
|--------|----------|
| `createBlockRuntimeValidationIssue` | Factory for a single issue |
| `hasRuntimeValidationErrors` | Any issue with `severity === "error"` |
| `hasRuntimeValidationWarnings` | Any issue with `severity === "warning"` |

Errors/warnings are **labels for UI** — not publish gates.

## Admin integration

`apps/admin/src/lib/block-runtime-validation-hints.ts` maps the **primary** validation issue (by code priority) to one i18n hint. Shown in:

- `editor-selected-block-context.tsx`
- `publish-governance-panel.tsx` (selected block section)

Hints are deduplicated against capability, editor-surface, governance, and preview-isolation hints.

**Renderers are unchanged.**

## Adding a new validation code

1. Extend `BlockRuntimeValidationCode` and mapping in `validateBlockRuntimeSemantics` using **static contract checks only**.
2. Add admin i18n under `editor.orientation.runtimeValidationHints`.
3. Update `CODE_HINT_PRIORITY` in `block-runtime-validation-hints.ts` if needed.
4. Do **not** add props checks, Zod schemas, or automatic inference from capabilities.

## Anti-patterns

- Props validation in this foundation
- Zod-everywhere or block-schema-driven validators
- Publish blocking from `hasRuntimeValidationErrors`
- Security decisions from validation severity
- JSON rule files or global validation pipelines
- Universal metadata runtime
- Merging validation into governance or preview-isolation registries

## Files

| Path | Role |
|------|------|
| `packages/core/src/block-runtime-validation.ts` | Types, validation, helpers |
| `packages/core/src/index.ts` | Exports |
| `apps/admin/src/lib/block-runtime-validation-hints.ts` | Admin hint selection |
| `docs/migration/phase-83-result.md` | Validation record |
