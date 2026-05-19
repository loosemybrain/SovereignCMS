# Preview Isolation Foundation (Phase 82)

## Purpose

Phase 82 introduces **static preview-isolation contracts** in `@sovereign-cms/core`. They describe how each block type should be treated in the **admin / editor preview** context: external embeds as placeholders, forms disabled, media resolved via composition, navigation targets reviewed, and similar expectations.

This is **declarative documentation for humans and thin admin hints** — not executable policy in renderers.

## What this is not

| Not in scope | Why |
|--------------|-----|
| Preview engine | No rendering pipeline, iframe sandbox, or preview URL orchestration |
| Renderer refactor | Renderers stay dumb; they do not read isolation contracts |
| Sandbox / CSP | No browser isolation, middleware, or security enforcement |
| Middleware tenant injection | Tenant context unchanged |
| Runtime orchestrator | No new preview runtime service |
| Rule engine | No validators, scoring, or publish blocking |

## Relationship to other contract layers

| Layer | Phase | Focus |
|-------|-------|--------|
| `BLOCK_MEDIA_CONTRACTS` | 78 | Which props reference media assets |
| `BLOCK_CAPABILITY_CONTRACTS` | 79 | High-level block semantics (form, external-media, preview-sensitive) |
| `BLOCK_EDITOR_CONTRACTS` | 80 | Which editor surfaces apply (inspector, preview, governance tab) |
| `BLOCK_GOVERNANCE_CONTRACTS` | 81 | Editorial risk concerns and severity |
| **`BLOCK_PREVIEW_ISOLATION_CONTRACTS`** | **82** | **How preview should isolate or limit behavior per block type** |

Contracts are **intentionally separate**. Do not merge them into one registry or infer isolation from capabilities.

### Governance vs preview isolation

- **Governance** = editorial readiness (accessibility, consent copy, legal review, link quality).
- **Preview isolation** = how preview must **not** behave like production (no unchecked embed loads, no form posts, composition-bound media).

A block can be governance-critical and preview-isolated for different reasons.

### Editor contracts vs preview isolation

- **Editor contracts** = where editing happens (surfaces, panels).
- **Preview isolation** = what preview must **avoid** (live embeds, submissions, direct media fetches).

### Capability contracts vs preview isolation

- **Capabilities** = semantic tags (`form`, `external-media`, `preview-sensitive`).
- **Isolation modes** = concrete preview treatment (`form-disabled`, `external-placeholder`, `media-safe`).

Capabilities do **not** auto-map to isolation modes.

## Core model

```ts
BlockPreviewIsolationMode =
  | "none"
  | "content-only"
  | "media-safe"
  | "external-placeholder"
  | "form-disabled"
  | "navigation-safe"

BlockPreviewIsolationReason =
  | "external-media"
  | "consent-required"
  | "form-submission"
  | "tenant-boundary"
  | "media-resolution"
  | "navigation-targets"
  | "governance-review"
```

`BLOCK_PREVIEW_ISOLATION_CONTRACTS` lists all seven existing block types. Unknown block types:

- `getBlockPreviewIsolationContract` → `undefined`
- `getBlockPreviewIsolationMode` → `"none"`
- `getBlockPreviewIsolationReasons` → `[]`
- `isPreviewIsolatedBlock` / `requiresExternalPreviewPlaceholder` / `requiresFormPreviewDisabled` → `false`

No inference from capabilities or registry metadata.

## Helpers (core)

| Helper | Behavior |
|--------|----------|
| `getBlockPreviewIsolationContract` | Lookup contract or `undefined` |
| `getBlockPreviewIsolationMode` | Mode or `"none"` |
| `getBlockPreviewIsolationReasons` | Reasons or `[]` |
| `hasBlockPreviewIsolationReason` | Reason membership |
| `isPreviewIsolatedBlock` | `mode !== "none"` |
| `requiresExternalPreviewPlaceholder` | `mode === "external-placeholder"` |
| `requiresFormPreviewDisabled` | `mode === "form-disabled"` |

## Admin integration (hints only)

`apps/admin/src/lib/block-preview-isolation-hints.ts` maps isolation **modes** to one i18n hint key. Hints appear in:

- `editor-selected-block-context.tsx` (selected block header)
- `publish-governance-panel.tsx` (selected block section)

Hints are **non-blocking**, not persisted, and not security. Overlapping capability / editor / governance hints are deduplicated via `buildPreviewIsolationHintExclusions`.

Renderers were **not** changed in Phase 82. Existing admin preview renderers (e.g. disabled form fields, external-embed placeholder copy) remain as-is; contracts document intent for future alignment.

## Adding a new block type

1. Add an entry to `BLOCK_PREVIEW_ISOLATION_CONTRACTS` with explicit `mode` and `reasons`.
2. Optionally add i18n under `editor.orientation.previewIsolationHints` if a new mode needs copy.
3. Do **not** infer mode from capabilities or governance concerns.
4. Keep renderer logic dumb; if preview behavior changes, change the renderer implementation separately — not by reading contracts in the renderer.

## Anti-patterns

- Preview rule engine or JSON-driven preview policies
- Global preview runtime / middleware preview context
- Renderer-specific security checks driven by contracts
- Automatic isolation inferred from `BLOCK_CAPABILITY_CONTRACTS`
- Merging preview isolation with governance or editor contracts
- Publish blocking or inspector automation based on isolation mode
- Treating contracts as a sandbox or CSP substitute

## Files

| Path | Role |
|------|------|
| `packages/core/src/block-preview-isolation-contracts.ts` | Types, registry, helpers |
| `packages/core/src/index.ts` | Public exports |
| `apps/admin/src/lib/block-preview-isolation-hints.ts` | Hint key selection |
| `apps/admin/src/lib/admin-i18n/messages/{en,de}.ts` | Hint copy |
| `docs/migration/phase-82-result.md` | Validation record |
