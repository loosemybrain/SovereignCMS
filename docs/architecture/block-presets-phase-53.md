# Block presets (Phase 53 / 53.1)

**Status:** Implemented and hardened (Phase 53.1)  
**Scope:** Static, curated default props for selected block types in the **admin** editor only.

## What presets are

- **Static seeds:** Presets live in `packages/core/src/block-presets.ts` as a single typed object. They are shallow, editorial defaults—not a composition or inheritance engine.
- **Explicit block type:** Every preset carries `blockType: SupportedPresetBlockType` alongside `id`, `label`, optional `description`, and `props`.
- **No runtime resolution on the public site:** The public app does **not** resolve presets. Published pages contain normal block payloads; preset helpers are only used when creating blocks in admin.
- **Admin still imports `@sovereign-cms/core`:** Because presets ship in core, the admin bundle may include that module. That is **not** “preset resolution” at runtime for visitors; it is shared library code loaded by the admin app. Do **not** claim “zero runtime impact” if interpreted as “core is never loaded in admin”—only that **public rendering** does not depend on preset lookup.

## Types

```typescript
export type SupportedPresetBlockType =
  | "hero"
  | "text"
  | "cta"
  | "feature-grid"
  | "image-text"

export type BlockPreset<TProps extends object = Record<string, unknown>> = {
  id: string
  blockType: SupportedPresetBlockType
  label: string
  description?: string
  props: TProps
}

export const BLOCK_PRESETS: Record<SupportedPresetBlockType, BlockPreset[]>
```

`BLOCK_PRESETS` is a **static object** keyed by block type. There is no async loading, database, tenant logic, or locale branching in this file.

## Lookup (block-type scoped)

- **`getPresetsForBlockType(blockType: string)`** — Returns presets for that type, or `[]` if the type is not in `SupportedPresetBlockType`.
- **`getPresetForBlockType(blockType, presetId)`** — Returns a preset **only** inside the given `blockType` bucket, or `undefined`. There is **no** cross-type search and no global `getPresetById`.

## Applying presets safely

When a block is added with a preset:

1. Admin resolves the preset with `getPresetForBlockType(blockType, presetId)` (and only after confirming the block type is a preset type).
2. Props are copied with **`cloneBlockPropsForNewBlock(blockType, props)`** from core: top-level shallow clone; for `feature-grid`, the `items` array is rebuilt with per-item object spreads so preset constants and their nested rows are not mutated by later edits.

No deep-clone library, no `JSON.parse(JSON.stringify(...))`, and no dynamic registries.

## Governance notes

- Image + text presets keep `imageUrl` empty until an editor sets media; when `imageUrl` is empty, **`imageAlt` is also empty** (no misleading alt text without an image).
- No placeholder fake URLs.

## What this is not

- No inheritance or composition engine for presets.
- No new block types, API routes, migrations, or external dependencies introduced by this layer.
- No tenant- or locale-specific preset resolution in core.

## Related docs

- `docs/migration/phase-53-result.md` — Phase 53 delivery notes and Phase 53.1 validation.
- `docs/architecture/curated-presets-phase-53.md` — Original Phase 53 narrative (may lag; this file is the canonical hardened contract description).
