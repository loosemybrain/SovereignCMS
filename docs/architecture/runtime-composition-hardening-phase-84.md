# Runtime Composition Hardening (Phase 84)

## Purpose

Phase 84 **hardens** the existing media composition path (Phase 77) with explicit **runtime composition boundaries**: what concerns apply per mode, which artifact kinds may appear, and that all composition output is **transient-only** and **never persistable**.

This is not a new composition engine, orchestrator, or global runtime context.

## Boundaries

| Constant | Mode | Concerns | Artifact kinds |
|----------|------|----------|----------------|
| `PUBLIC_RUNTIME_COMPOSITION_BOUNDARY` | `public` | media, external-media, governance, runtime-validation | composed-props, composition-metadata, validation-result |
| `ADMIN_PREVIEW_RUNTIME_COMPOSITION_BOUNDARY` | `admin-preview` | + preview-isolation | + preview-isolation |

Both boundaries set `transientOnly: true` and `persistable: false` (literal types).

### Helpers (core)

| Helper | Role |
|--------|------|
| `getRuntimeCompositionBoundary(mode)` | Returns the static boundary for public or admin-preview |
| `assertRuntimeCompositionTransient(boundary)` | Throws if boundary is not transient-only |
| `isRuntimeCompositionPersistable(boundary)` | Always `false` |
| `createRuntimeCompositionMetadata(mode)` | Small metadata snapshot for composition results |

## Hardened composition result

`MediaCompositionResult<T>` (runtime) now includes:

```ts
metadata: RuntimeCompositionMetadata // { mode, concerns, transient: true }
```

Counters and `value` are unchanged. `stripMediaCompositionMetadata` still removes `_sovereignMediaComposition` from block props before persistence — **metadata on the result object is not written to the database**.

## Integration points

| Function | Change |
|----------|--------|
| `composePublicBlockMedia` | Asserts public boundary before delegating |
| `composeAdminPreviewBlockMedia` | Asserts admin-preview boundary before delegating |
| `composeBlockMedia` | Asserts boundary + attaches `metadata` to result |

Rendering behavior, fallback rules, and tenant resolution are **unchanged**.

## Semantic layering (not merged)

| Layer | Phase | Role in composition |
|-------|-------|---------------------|
| Media contracts | 78 | Which fields hold media references |
| Capabilities | 79 | Block semantics |
| Editor contracts | 80 | Editor surfaces |
| Governance | 81 | Editorial concerns (counters → `mediaCompositionGovernanceIssues`) |
| Preview isolation | 82 | Admin preview treatment (placeholders in core path) |
| Runtime validation | 83 | Block-type hints (not embedded in result yet) |
| **Composition boundaries** | **84** | **Mode-level transient contract** |

## Deliberately not in Phase 84

- Embedding `validateBlockRuntimeSemantics` results in composition output (would widen result shape; documented for a future phase)
- Per-block preview-isolation metadata on the result object (preview behavior already in `composeBlockMedia` via fallbacks)
- Renderer changes
- Global runtime context API
- Provider-specific fields on boundaries

## Anti-patterns

- Runtime orchestrator or composition engine
- Persisting `metadata` or `_sovereignMediaComposition` to the database
- Renderer-side media resolution or governance checks
- Middleware composition injection
- JSON-driven composition policies
- Universal metadata runtime
- Automatic policies inferred from capabilities

## Files

| Path | Role |
|------|------|
| `packages/core/src/runtime-composition-contracts.ts` | Boundaries, metadata type, helpers |
| `packages/runtime/src/media/media-composition.ts` | `metadata` on result |
| `packages/runtime/src/media/compose-*.ts` | Boundary asserts |
| `docs/migration/phase-84-result.md` | Validation record |
