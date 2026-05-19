# Editor Runtime Alignment — Phase 80

## Purpose

Phases 78–79 defined **media field contracts** and **block capability contracts** for runtime and governance. Phase 80 adds **editor surface contracts**: static metadata describing which editor UI areas a block type is aligned with — without generating inspectors, plugins, or schemas.

---

## Why editor contracts exist

| Problem | Editor contract |
|---------|-----------------|
| Inspector/preview grow unrelated to runtime | Explicit `surfaces[]` per `blockType` |
| Unclear where to add fields later | Surfaces document intent (`media`, `form`, …) |
| Drift from capabilities | Cross-check manually; layers stay separate |

Editor contracts are **descriptive alignment**, not enforcement.

---

## Three layers (do not merge)

| Layer | File | Answers |
|-------|------|---------|
| **Media fields** | `block-media-contracts.ts` | Which props hold URLs / alt / assetId? |
| **Capabilities** | `block-capabilities.ts` | What runtime semantics apply (media, form, governance-sensitive, …)? |
| **Editor surfaces** | `block-editor-contracts.ts` | Which editor UI domains are in scope for this block? |

Rules:

- Do **not** infer media fields from editor surfaces.
- Do **not** infer capabilities from editor surfaces.
- Do **not** merge into one mega-metadata object.

---

## What this is not

- Not a dynamic schema or Zod replacement
- Not an automatic inspector field generator
- Not a plugin registry or block DSL
- Not runtime reflection
- Not security or publish enforcement

---

## `BlockEditorSurface` (closed set)

`content`, `design`, `media`, `actions`, `layout`, `form`, `navigation`, `external-media`, `accessibility`, `governance`, `preview`

Extend the union in core only when a real editor domain needs a new surface.

---

## Static contracts (Phase 80)

| Block | Surfaces |
|-------|----------|
| `hero` | content, design, media, accessibility, governance, preview |
| `text` | content, design, accessibility, governance |
| `cta` | content, design, actions, accessibility, governance |
| `feature-grid` | content, design, layout, accessibility, governance |
| `image-text` | content, design, media, actions, layout, accessibility, governance, preview |
| `contact-form` | content, form, actions, accessibility, governance, preview |
| `external-embed` | content, external-media, accessibility, governance, preview |

---

## Helpers (pure, core)

- `getBlockEditorContract(blockType)` → `undefined` if unknown
- `getBlockEditorSurfaces(blockType)` → `[]` if unknown
- `hasBlockEditorSurface(blockType, surface)` → `false` if unknown
- `isEditorSurfaceAllowed(blockType, surface)` → same as `hasBlockEditorSurface`

---

## Admin usage (Phase 80)

`apps/admin/src/lib/block-editor-surface-hints.ts` maps surfaces to **editorial UX strings** (DE/EN via i18n). Used in:

- Selected block context (secondary line after capability hint)
- Governance panel selected-block section

Hints are **guidance only** — no persistence, no security, no field automation.

---

## Adding a new block type

1. Add renderer + inspector as today (explicit fields).
2. Add `BLOCK_EDITOR_CONTRACTS` entry with minimal surfaces.
3. Add `BLOCK_CAPABILITY_CONTRACTS` and `BLOCK_MEDIA_CONTRACTS` when applicable.
4. Optionally extend `block-editor-surface-hints` priority — do not auto-wire inspector tabs from surfaces yet.

---

## Anti-patterns (forbidden)

- `if (hasBlockEditorSurface(type, "media")) { renderMediaFields(props) }` from a generic engine
- Deriving `BLOCK_MEDIA_CONTRACTS` from editor surfaces
- Plugin manifests that register surfaces at runtime
- Passing `RuntimeConfig` or storage clients into client components for surface checks
- Using surface hints as publish gates

---

## Related

- [media-capable-block-contracts-phase-78.md](./media-capable-block-contracts-phase-78.md)
- [block-capability-contracts-phase-79.md](./block-capability-contracts-phase-79.md)
- [docs/migration/phase-80-result.md](../migration/phase-80-result.md)
