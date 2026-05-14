# Phase 53 & 53.1 — Block presets

**Original Phase 53 date:** May 14, 2026  
**Phase 53.1:** Preset contract hardening (same release track; no feature expansion)

---

## Phase 53.1 — Preset contract hardening

**Status:** Complete  
**Goal:** Stabilize typing, lookup safety, metadata consistency, cloning, and documentation—without new presets, block types, or public behavior changes.

### Code changes

| Area | Change |
|------|--------|
| `packages/core/src/block-presets.ts` | Introduced `SupportedPresetBlockType`, `BlockPreset<TProps extends object>` with `label`, optional `description`, required `blockType` on every preset; `BLOCK_PRESETS` typed as `Record<SupportedPresetBlockType, BlockPreset[]>`; removed `getPresetById`; added `getPresetForBlockType(blockType, presetId)`; added `isSupportedPresetBlockType`; added `cloneBlockPropsForNewBlock` (shallow props + `feature-grid` `items` row clones). |
| `packages/core/src/index.ts` | Exports updated: `SupportedPresetBlockType`, `cloneBlockPropsForNewBlock`, `getPresetForBlockType`, `isSupportedPresetBlockType`; dropped `getPresetById`. |
| `apps/admin/src/components/page-editor-client.tsx` | Preset resolution uses `getPresetForBlockType` + `isSupportedPresetBlockType`; new blocks use `cloneBlockPropsForNewBlock` from core. |
| `apps/admin/src/components/editor/block-palette.tsx` | Displays `preset.label`; optional `description`. |
| `apps/admin/src/lib/reorder-blocks.ts` | Removed `cloneDefaultProps` (had used `JSON.stringify` fallback); cloning for new blocks is centralized in core as above. |
| `docs/architecture/block-presets-phase-53.md` | **New** — Canonical architecture for hardened presets. |

### Image + text presets

When `imageUrl` is empty, `imageAlt` is empty in all three presets (governance-friendly).

### Documentation corrections

- Presets are resolved **only in the admin block-creation flow**; the **public app does not resolve presets**.
- `BLOCK_PRESETS` is a **statically typed** object grouped by block type, with **explicit `blockType` on each preset**.
- Preset lookup is **block-type scoped** (`getPresetForBlockType`); there is **no** cross-type `getPresetById`.
- Presets are **shallow/static content seeds**, not an inheritance or composition engine.
- **Do not claim “zero runtime impact”** in the sense that core is never part of admin: admin imports `@sovereign-cms/core`; public rendering nonetheless **does not** use preset lookup.

### Validation (Phase 53.1)

Commands run from the repo root on **May 11, 2026**:

```bash
npm run typecheck
npm run lint
npm run build
```

| Command | Result |
|---------|--------|
| `npm run typecheck` | **Pass** — 15/15 packages |
| `npm run lint` | **Pass** — 2 tasks (admin, web), 0 ESLint violations reported |
| `npm run build` | **Pass** — `@sovereign-cms/web` and `@sovereign-cms/admin` production builds completed successfully |

No new external dependencies, migrations, or API routes were added for this phase.

**Optional — Phasen-ZIPs:** Nach erfolgreicher Validierung z. B. `npm run phase:zip -- --phase 53.1` — Ausgabe unter `artifacts/phase-zips/`, Voll-ZIP slim ohne `node_modules`/`.next`/`.turbo`/`dist` (siehe README).

---

## Phase 53 — Original implementation summary

Phase 53 introduced a lightweight, static preset system: editors can pick curated defaults when adding blocks in admin, or add an empty block.

### Preset types (superseded details — see 53.1 above)

- Use **`label`** (not `name`) on `BlockPreset` after 53.1.
- Helpers: `getPresetsForBlockType`, `getPresetForBlockType` (replaces removed `getPresetById`).

### Presets implemented

**Hero (3):** `hero-simple`, `hero-with-image`, `hero-minimal`  
**Text (3):** `text-paragraph`, `text-multiline`, `text-snippet`  
**CTA (3):** `cta-single-button`, `cta-dual-buttons`, `cta-left-aligned`  
**Feature grid (3):** `grid-2col-4items`, `grid-3col-6items`, `grid-4col-8items` (use `items` array with stable ids)  
**Image + text (3):** `imgtext-image-left`, `imgtext-image-right`, `imgtext-minimal`  

**Total:** 15 presets.

### Acceptance criteria (Phase 53 + 53.1)

- Every preset explicitly defines **`blockType`** (53.1).
- **`SupportedPresetBlockType`** exists (53.1).
- **`BLOCK_PRESETS`** is strongly typed as `Record<SupportedPresetBlockType, BlockPreset[]>` (53.1).
- **`getPresetById` removed**; **`getPresetForBlockType(blockType, presetId)`** added (53.1).
- No cross-type preset resolution (53.1).
- Applying a preset does **not** mutate preset constants; **feature-grid `items`** cloned safely (53.1).
- No deep-clone library; **no** `JSON.parse(JSON.stringify(...))` on this path (53.1).
- Image + text: **no `imageAlt` when `imageUrl` is empty** (53.1).
- Public rendering unchanged (still no preset resolution on the public site).

### Known limitations (unchanged)

1. Static presets only (not user-authored in DB).  
2. No preset versioning in product.  
3. No preset editor UI beyond choosing at insert time.  
4. No import/export of presets.  
5. No preset inheritance/composition system.

### Files touched (cumulative)

| File | Role |
|------|------|
| `packages/core/src/block-presets.ts` | Preset definitions and helpers |
| `packages/core/src/index.ts` | Public exports |
| `apps/admin/src/components/page-editor-client.tsx` | Insert flow |
| `apps/admin/src/components/editor/block-palette.tsx` | Preset picker UI |
| `apps/admin/src/lib/reorder-blocks.ts` | Reorder utilities (cloning removed here) |
| `docs/architecture/block-presets-phase-53.md` | Hardened architecture |
| `docs/migration/phase-53-result.md` | This report |
| `docs/architecture/curated-presets-phase-53.md` | Earlier Phase 53 narrative |

---

## Summary

Phase **53.1** hardens the Phase **53** preset foundation: stricter contracts, block-scoped lookup, safe cloning without JSON round-trips, image-text alt hygiene, and honest documentation (including **no** overstated “zero impact” claim for admin’s use of core). **Typecheck, lint, and build all passed** on the validation run documented above.
