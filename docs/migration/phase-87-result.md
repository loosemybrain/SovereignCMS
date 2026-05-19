# Phase 87 – Runtime Read Model Foundation

## Status

Abgeschlossen. `npm run typecheck` und `npm run lint` erfolgreich.

## Neue Dateien

| Pfad | Inhalt |
|------|--------|
| `packages/core/src/runtime-read-models.ts` | Boundaries, `RuntimeBlockReadModel`, Helper, Factory |
| `docs/architecture/runtime-read-model-foundation-phase-87.md` | Architektur und Anti-Patterns |
| `docs/migration/phase-87-result.md` | Dieses Dokument |

## Geänderte Dateien

| Pfad | Änderung |
|------|----------|
| `packages/core/src/index.ts` | Export Read-Model-Typen und -Helper |

## Neue Typen / Helper

- `RuntimeReadModelMode`, `RuntimeReadModelArtifact`, `RuntimeReadModelBoundary`, `RuntimeBlockReadModel`
- `PUBLIC_RUNTIME_READ_MODEL_BOUNDARY`, `ADMIN_PREVIEW_RUNTIME_READ_MODEL_BOUNDARY`
- `getRuntimeReadModelBoundary`, `isRuntimeReadModelPersistable`, `assertRuntimeReadModelBoundary`, `createRuntimeBlockReadModel`

## Integration

**Bewusst keine** Änderung an `composePublicBlockMedia`, `composeAdminPreviewBlockMedia`, `composeBlockMedia`, Renderern oder Persistenz — würde `MediaCompositionResult`-API erweitern oder brechen. Nutzung dokumentiert für spätere Phasen.

## Nicht-Ziele

- Projection Engine, Query-System, Data Loader
- Runtime Registry / globale Context API
- Provider-Kopplung, Deep Clone, Validation in der Factory
- Persistenz von Read-Model-Metadaten

## Ausgeführte Checks

```text
npm run typecheck  → 15/15 erfolgreich
npm run lint       → 0 Fehler
npm run build      → erfolgreich (web + admin)
npm run sprint:finish -- --phase 87 → erfolgreich
```

## Sprint-Artefakte

- `artifacts/phase-zips/SovereignCMS-87-nur-Aenderungen.zip`
- `artifacts/phase-zips/SovereignCMS-87-repo-slim.zip`
