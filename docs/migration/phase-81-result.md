# Phase 81 — Runtime Governance Contract Foundation

## Summary

Static **governance contracts** model editorial risk areas per block type. Admin shows optional contract-based hints; existing governance issue builders and renderers are unchanged.

---

## Delivered

| Item | Location |
|------|----------|
| `BlockGovernanceConcern`, `BlockGovernanceSeverity`, `BlockGovernanceContract` | `packages/core/src/block-governance-contracts.ts` |
| `BLOCK_GOVERNANCE_CONTRACTS` | All 7 existing block types |
| Helpers | `getBlockGovernanceContract`, `getBlockGovernanceConcerns`, `hasBlockGovernanceConcern`, `isGovernanceCriticalBlock`, `isGovernanceRelevantBlock` |
| Core exports | `packages/core/src/index.ts` |
| Governance hints | `apps/admin/src/lib/block-governance-hints.ts` |
| i18n | `editor.orientation.governanceContractHints` (en/de) |
| UI (minimal) | `editor-selected-block-context.tsx`, `publish-governance-panel.tsx` |
| Architecture doc | `docs/architecture/runtime-governance-contracts-phase-81.md` |

---

## Not implemented

- Rule engine, auto-validators, publish blocking from contracts
- Merge with capability / editor / media contracts
- Runtime reflection, JSON rules, inspector automation
- Renderer changes, new block types, API routes, DB migrations

---

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck` | **15/15** packages passed |
| `npm run lint` | **0 errors** (3 pre-existing admin warnings) |
