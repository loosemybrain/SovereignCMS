# Runtime Governance Contracts — Phase 81

## Purpose

Phases 78–80 defined **media fields**, **runtime capabilities**, and **editor surfaces**. Phase 81 adds **governance contracts**: static metadata describing which editorial risk areas apply to each block type — without a rule engine, validators, or publish blocking.

---

## Why governance contracts exist

| Scattered risk | Governance contract |
|----------------|---------------------|
| Privacy checks only in form renderer | `forms`, `consent`, `legal-review` concerns |
| Embed consent duplicated | `external-media`, `consent` on `external-embed` |
| Alt-text checks only in media path | `media-alt-text` concern |
| Preview vs public confusion | `preview-safety` concern |

Contracts describe **what to think about**; existing `content-governance.ts` still implements concrete checks.

---

## Four layers (do not merge)

| Layer | File | Answers |
|-------|------|---------|
| Media fields | `block-media-contracts.ts` | Which props hold media? |
| Capabilities | `block-capabilities.ts` | What runtime semantics apply? |
| Editor surfaces | `block-editor-contracts.ts` | Which editor UI domains apply? |
| **Governance** | `block-governance-contracts.ts` | Which risk areas apply? |

`severity` on a governance contract is **metadata for editors** (info / warning / critical) — not an automatic publish gate.

---

## What this is not

- Not a dynamic rule engine or JSON-driven validator
- Not runtime reflection or plugin registry
- Not publish blocking derived from contracts alone
- Not inspector field generation
- Not a replacement for `getBlockGovernanceIssues()` implementations

Renderers stay **dumb**; governance hints in admin are **UX guidance only**.

---

## Types

### `BlockGovernanceConcern` (closed set)

`accessibility`, `external-media`, `consent`, `forms`, `navigation`, `links`, `preview-safety`, `editorial-quality`, `media-alt-text`, `legal-review`

### `BlockGovernanceSeverity`

`info`, `warning`, `critical` — descriptive default emphasis, not enforcement.

---

## Static contracts (Phase 81)

| Block | Severity | Concerns |
|-------|----------|----------|
| `hero` | warning | accessibility, media-alt-text, editorial-quality, preview-safety |
| `text` | info | accessibility, editorial-quality |
| `cta` | warning | accessibility, links, editorial-quality |
| `feature-grid` | info | accessibility, editorial-quality |
| `image-text` | warning | accessibility, media-alt-text, links, editorial-quality, preview-safety |
| `contact-form` | critical | accessibility, forms, consent, legal-review, preview-safety |
| `external-embed` | critical | accessibility, external-media, consent, preview-safety, legal-review |

---

## Helpers (pure, core)

- `getBlockGovernanceContract(blockType)` → `undefined` if unknown
- `getBlockGovernanceConcerns(blockType)` → `[]` if unknown
- `hasBlockGovernanceConcern(blockType, concern)` → `false` if unknown
- `isGovernanceCriticalBlock(blockType)` → contract `severity === "critical"`
- `isGovernanceRelevantBlock(blockType)` → non-empty concerns

No automatic inference from other contract layers.

---

## Admin hints (Phase 81)

`apps/admin/src/lib/block-governance-hints.ts` maps concerns to i18n strings. Shown in selected-block context and governance panel when not redundant with capability/editor hints.

---

## Adding governance for a new block

1. Add `BLOCK_GOVERNANCE_CONTRACTS` entry with concerns + severity.
2. Keep block-specific checks in `content-governance.ts`.
3. Optionally extend hint priority in `block-governance-hints.ts`.
4. Do **not** generate validators from `concerns[]` automatically.

---

## Anti-patterns (forbidden)

- `concerns.map(c => runValidator(c))` generic engine
- Blocking publish when `isGovernanceCriticalBlock(type)`
- Merging governance into `BLOCK_CAPABILITY_CONTRACTS`
- JSON rule files loaded at runtime
- Deriving concerns from editor surfaces or media fields

---

## Related

- [block-capability-contracts-phase-79.md](./block-capability-contracts-phase-79.md)
- [editor-runtime-alignment-phase-80.md](./editor-runtime-alignment-phase-80.md)
- [media-capable-block-contracts-phase-78.md](./media-capable-block-contracts-phase-78.md)
- [content-quality-accessibility-governance-phase-62.md](./content-quality-accessibility-governance-phase-62.md)
- [docs/migration/phase-81-result.md](../migration/phase-81-result.md)
