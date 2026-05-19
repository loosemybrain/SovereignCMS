# Phase 78 — Media-Capable Block Contract Foundation

## Summary

Media-capable blocks now declare **explicit top-level media field contracts** in core. Runtime composition and admin governance read those contracts instead of hard-coded `hero` / `image-text` branches.

---

## Delivered

| Item | Location |
|------|----------|
| `MediaFieldKind`, `MediaFieldMode`, `BlockMediaFieldContract`, `BlockMediaContract` | `packages/core/src/block-media-contracts.ts` |
| `BLOCK_MEDIA_CONTRACTS` | `hero`, `image-text`, `external-embed` |
| Lookup helpers | `getBlockMediaContract`, `getMediaFieldsForBlock`, `hasMediaFields`, `resolveBlockMediaFieldKeys` |
| Core exports | `packages/core/src/index.ts` |
| Composition via contracts | `packages/runtime/src/media/compose-block-media-core.ts` |
| Governance helper | `pushBlockMediaContractIssues` in `apps/admin/src/lib/governance-checks.ts` |
| Governance wiring | `content-governance.ts` (hero, image-text, external-embed) |
| Architecture doc | `docs/architecture/media-capable-block-contracts-phase-78.md` |
| Prior doc updates | Phase 75 / 76 / 77 architecture notes |

---

## Runtime composition changes

- Slots built from `getMediaFieldsForBlock` + `resolveBlockMediaFieldKeys`.
- Fields filtered by `MediaFieldMode` vs composition mode (`public` / `admin-preview`).
- `external-media` (`embedUrl`): validate and count; **no** URL injection.
- `collectAssetIdsForBatching` uses contracts (all modes).
- Unknown blocks: unchanged.
- Input blocks: not mutated (clone on output).

---

## Governance integration

- `pushBlockMediaContractIssues` centralizes `normalizeMediaReference` + alt/external/invalid hints per contract field.
- Block-specific editorial rules (headlines, embed provider, consent) unchanged.
- Issue id prefixes preserved for single-field blocks (`hero`, `imgtext`, `embed`).

---

## Unsupported (intentional)

- Nested field paths
- Array / rich-text media extraction
- Dynamic schema engine / reflection / block DSL
- New block types, presets, upload UI, signed URLs, CDN, API routes, DB migrations
- Editor prop shape changes
- Public renderer rewrite

---

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck` | **15/15** packages passed |
| `npm run lint` | **0 errors** (3 pre-existing admin warnings) |
| `npm run build` | **web + admin** succeeded |
