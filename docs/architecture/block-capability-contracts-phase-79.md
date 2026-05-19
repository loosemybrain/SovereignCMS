# Block Capability Contracts — Phase 79

## Purpose

Phase 78 added **media field contracts** (which props hold URLs, alt text, asset IDs). Phase 79 adds a separate **capability contract** layer describing what kind of block semantics apply — media, forms, external risk, governance sensitivity, preview behavior — without a schema engine, plugin registry, or block DSL.

---

## Why capabilities exist

| Scattered assumption | Capability contract |
|--------------------|---------------------|
| “This block has media” | `media` or `external-media` |
| “Run embed / consent checks” | `external-media`, `interactive` |
| “Preview may differ” | `preview-sensitive` |
| “Include in publish governance” | `governance-sensitive` |

Capabilities are **descriptive metadata first**. They do not replace block-specific governance functions or renderers in this phase.

---

## What this is not

- Not a dynamic schema or Zod replacement
- Not a plugin or block registry
- Not runtime reflection
- Not a generic validation rule engine
- Not visual builder or inspector DSL
- Not a merge of media field contracts into one mega-object

---

## Capability vs media field contracts

| Layer | File | Answers |
|-------|------|---------|
| **Capabilities** | `block-capabilities.ts` | What semantics does this block type have? |
| **Media fields** | `block-media-contracts.ts` | Which top-level props hold media pointers? |

Rules:

- `isMediaCapableBlock()` checks capabilities — **not** props.
- Runtime composition still reads **`BLOCK_MEDIA_CONTRACTS` only** — never infers fields from capabilities.
- Blocks with media contracts must declare `media` or `external-media` in capabilities.

---

## Supported capabilities (closed set)

`media`, `external-media`, `form`, `interactive`, `navigation`, `theme-aware`, `accessibility-sensitive`, `governance-sensitive`, `preview-sensitive`

No arbitrary capability strings. Extend the union in core when a real block needs a new semantic.

---

## Static contracts (Phase 79)

| Block | Capabilities |
|-------|----------------|
| `hero` | media, theme-aware, accessibility-sensitive, governance-sensitive, preview-sensitive |
| `text` | accessibility-sensitive, governance-sensitive, theme-aware |
| `cta` | interactive, accessibility-sensitive, governance-sensitive, theme-aware |
| `feature-grid` | accessibility-sensitive, governance-sensitive, theme-aware |
| `image-text` | media, accessibility-sensitive, governance-sensitive, theme-aware, preview-sensitive |
| `contact-form` | form, interactive, accessibility-sensitive, governance-sensitive, preview-sensitive |
| `external-embed` | external-media, interactive, accessibility-sensitive, governance-sensitive, preview-sensitive |

---

## Helpers (pure, core)

- `getBlockCapabilityContract(blockType)`
- `getBlockCapabilities(blockType)`
- `hasBlockCapability(blockType, capability)`
- `isMediaCapableBlock(blockType)`
- `isGovernanceSensitiveBlock(blockType)`
- `isPreviewSensitiveBlock(blockType)`

---

## Governance integration

- `getBlockGovernanceIssues` skips blocks without `governance-sensitive`.
- `pushBlockMediaContractIssues` runs only when `isMediaCapableBlock` and media field contracts exist.
- `getPageGovernanceIssues` aggregates governance-sensitive blocks only.

Existing per-block checks remain; capabilities gate entry points.

---

## Admin preview / editor hints

- Selected block context: one quiet capability hint (external embed, form, or preview-sensitive).
- Governance panel: same hint under selected-block issues when a block is selected.

Hints are **editorial only** — not security enforcement.

---

## Runtime composition

`compose-block-media-core.ts` skips non–media-capable block types before reading `BLOCK_MEDIA_CONTRACTS`. Field resolution is unchanged.

---

## Adding capabilities for a new block

1. Add `BLOCK_CAPABILITY_CONTRACTS` entry with only needed capabilities.
2. If the block has media props, add `BLOCK_MEDIA_CONTRACTS` and matching `media` / `external-media` capability.
3. Add governance function in `content-governance.ts` (or extend shared helpers).
4. Do not infer fields from capabilities in composition.

---

## Intentionally not supported

- Nested capability inheritance
- Per-instance capabilities in editor props
- Plugin-loaded capability manifests
- Dynamic inspector tabs from capabilities
- Renderer behavior switches driven only by capabilities (future, explicit wiring)

---

## Related

- [media-capable-block-contracts-phase-78.md](./media-capable-block-contracts-phase-78.md)
- [media-runtime-composition-phase-77.md](./media-runtime-composition-phase-77.md)
- [content-quality-accessibility-governance-phase-62.md](./content-quality-accessibility-governance-phase-62.md)
- [docs/migration/phase-79-result.md](../migration/phase-79-result.md)
