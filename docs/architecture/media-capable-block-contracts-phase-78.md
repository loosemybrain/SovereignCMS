# Media-Capable Block Contracts — Phase 78

## Purpose

Phase 77 centralized **runtime media composition**, but media-capable blocks were still discovered via hard-coded `block.type` checks (`hero`, `image-text`). Phase 78 introduces **explicit, static media field contracts** so composition, governance, and future blocks share one declaration — without a dynamic schema engine, reflection, or block DSL.

---

## Why contracts exist

| Problem | Contract approach |
|---------|-------------------|
| Growing `if (block.type === …)` branches | `BLOCK_MEDIA_CONTRACTS[blockType]` |
| Drift between governance and composition | Same field keys (`urlField`, `altField`, `assetIdField`) |
| Unclear public vs admin-preview semantics | `MediaFieldMode` per field |
| Future blocks | Add a contract entry + renderers; no new traversal engine |

This is **boring metadata**: TypeScript types + a static `Record`. No runtime schema validation, no recursive prop walking.

---

## What this is not

- Not a dynamic schema engine
- Not Zod replacement for block props
- Not nested path resolution (`items[0].imageUrl`)
- Not array or rich-text media extraction
- Not upload UI, signed URLs, or CDN logic

Unsupported patterns are **documented only**; implement when a real block needs them with an explicit contract extension.

---

## Types (`packages/core/src/block-media-contracts.ts`)

| Type | Role |
|------|------|
| `MediaFieldKind` | `image`, `background-image`, `icon`, `video`, `external-media` |
| `MediaFieldMode` | `public`, `admin-preview`, `both` |
| `BlockMediaFieldContract` | One top-level media slot |
| `BlockMediaContract` | All media fields for a `blockType` |

### Field keys

- `field` — stable contract id (not always a prop name)
- `urlField` — prop holding URL (defaults to `field` if omitted)
- `altField` / `assetIdField` — optional companion props
- Only **top-level** string props are read

### Helpers (pure)

- `getBlockMediaContract(blockType)`
- `getMediaFieldsForBlock(blockType)`
- `hasMediaFields(blockType)`
- `resolveBlockMediaFieldKeys(field)`

---

## Supported blocks (Phase 78)

| Block | Fields | Notes |
|-------|--------|-------|
| `hero` | `mediaUrl`, `mediaAlt`, `mediaAssetId` | `background-image` kind; no invented `imageUrl` props |
| `image-text` | `imageUrl`, `imageAlt`, `mediaAssetId` | `mediaAssetId` defensive / future-compatible |
| `external-embed` | `embedUrl` | `external-media`; URL not injected by composition |

Unknown block types: **unchanged** by composition and contract helpers.

---

## Runtime composition integration

`compose-block-media-core.ts` loads contracts via `getMediaFieldsForBlock` and filters by `MediaFieldMode` vs `MediaCompositionMode`.

| Kind | Composition behavior |
|------|----------------------|
| `image`, `background-image`, … | Same as Phase 77: resolve `assetId`, inject internal/HTTPS URLs on public; admin-preview blocks external loads |
| `external-media` | Validate/count only; **never** overwrite `embedUrl` |

Original block arrays are not mutated; output is cloned. `_sovereignMediaComposition` remains transient.

---

## Public vs admin-preview

| Mode | Contract filter | Behavior |
|------|-----------------|----------|
| `public` | `mode: "public"` or `"both"` | Inject renderable URLs where allowed |
| `admin-preview` | `mode: "admin-preview"` or `"both"` | No external `<img>` injection; placeholders via composition meta |

Per-field `mode` allows future blocks to expose public-only assets without expanding `block.type` conditionals.

---

## Governance integration

`pushBlockMediaContractIssues()` in `apps/admin/src/lib/governance-checks.ts` runs `normalizeMediaReference` for each contract field.

Used by `hero`, `image-text`, and `external-embed` block issue builders. Editorial guidance only — **no** publish blocking changes.

Block-specific checks (headlines, embed provider validation, consent copy) remain in `content-governance.ts`.

---

## Adding a new media-capable block

1. Confirm props use **top-level** URL / alt / assetId fields (or document a future nested extension).
2. Add `BLOCK_MEDIA_CONTRACTS["your-block"]` in core.
3. Export is automatic via `@sovereign-cms/core`.
4. Wire public/admin renderers as today — **no** renderer rewrite required in Phase 78.
5. Governance: call `pushBlockMediaContractIssues` from the block’s issue function.

Do **not** add another `block.type ===` branch in composition — extend the contract record instead.

---

## Future extensions (not implemented)

- Nested paths (`section.background.url`)
- Array items (`items[].iconUrl`)
- Rich-text embedded images
- Per-field batch policies beyond `collectAssetIdsForBatching`

---

## Phase 79 — capability contracts

High-level block semantics (`media`, `external-media`, `preview-sensitive`, …) live in **`BLOCK_CAPABILITY_CONTRACTS`** (Phase 79). Media field contracts remain the sole source for which props composition reads. See [block-capability-contracts-phase-79.md](./block-capability-contracts-phase-79.md).

---

## Related

- [block-capability-contracts-phase-79.md](./block-capability-contracts-phase-79.md)
- [media-runtime-composition-phase-77.md](./media-runtime-composition-phase-77.md)
- [media-reference-resolution-phase-76.md](./media-reference-resolution-phase-76.md)
- [media-storage-boundary-phase-75.md](./media-storage-boundary-phase-75.md)
- [docs/migration/phase-78-result.md](../migration/phase-78-result.md)
