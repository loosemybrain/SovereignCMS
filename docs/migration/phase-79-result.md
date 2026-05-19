# Phase 79 — Block Capability Contract Foundation

## Summary

Static **block capability contracts** describe high-level block semantics (media, form, preview-sensitive, …) separately from Phase 78 **media field contracts**. Governance entry points and runtime media composition use capability helpers where safe; editor UI shows optional quiet hints.

---

## Delivered

| Item | Location |
|------|----------|
| `BlockCapability`, `BlockCapabilityContract` | `packages/core/src/block-capabilities.ts` |
| `BLOCK_CAPABILITY_CONTRACTS` | All 7 existing block types |
| Lookup helpers | `getBlockCapabilityContract`, `getBlockCapabilities`, `hasBlockCapability`, `isMediaCapableBlock`, `isGovernanceSensitiveBlock`, `isPreviewSensitiveBlock` |
| Core exports | `packages/core/src/index.ts` |
| Media contract alignment note | `block-media-contracts.ts` header |
| Composition gate | `isMediaCapableBlock` in `compose-block-media-core.ts` |
| Governance gates | `content-governance.ts`, `page-governance.ts`, `governance-checks.ts` |
| Editor hints | `block-capability-hints.ts`, `editor-selected-block-context.tsx`, `publish-governance-panel.tsx` |
| i18n | `en.ts` / `de.ts` capability hint strings |
| Architecture doc | `docs/architecture/block-capability-contracts-phase-79.md` |

---

## Not implemented

- Dynamic schema engine, plugin registry, reflection, block DSL
- Capability-driven renderers or inspector fields
- Generic validation rule registry
- New block types, presets, API routes, DB migrations, external deps
- Editor prop shape changes
- Security behavior driven by UI hints

---

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck` | **15/15** packages passed |
| `npm run lint` | **0 errors** (3 pre-existing admin warnings) |
| `npm run build` | **web + admin** succeeded |
