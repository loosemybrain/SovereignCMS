# Phase 90 – Runtime Exposure Discipline Foundation

## Status

Abgeschlossen. `npm run typecheck` und `npm run lint` erfolgreich.

## Neue Dateien

| Pfad | Inhalt |
|------|--------|
| `packages/core/src/runtime-exposure-discipline.ts` | Exposure-Targets/Contexts, Checks, Assert/Boolean-Helper |
| `docs/architecture/runtime-exposure-discipline-phase-90.md` | Architektur und Anti-Patterns |
| `docs/migration/phase-90-result.md` | Dieses Dokument |

## Geänderte Dateien

| Pfad | Änderung |
|------|----------|
| `packages/core/src/index.ts` | Export Exposure-Discipline-Typen und -Helper |

## Neue Typen / Helper

- `RuntimeExposureTarget`, `RuntimeExposureContext`, `RuntimeExposureViolationCode`, `RuntimeExposureSeverity`, `RuntimeExposureViolation`, `RuntimeExposureCheckResult`, `RuntimeArtifactExposureInput`
- `createRuntimeExposureViolation`
- `checkRuntimeArtifactExposureForTarget`
- `assertRuntimeArtifactExposureAllowed`
- `isRuntimeArtifactExposureAllowed`

## Optionale Abgleiche

**Nicht umgesetzt:** Verdrahtung in `runtime-projection-integrity`, `runtime-read-models` oder `checkRuntimeArtifactExposure` (Phase 89) — würde APIs erweitern oder doppeln; Nutzung dokumentiert.

## Bewusst nicht umgesetzt

- Security/Auth/Tenant/Middleware
- Renderer-, Composition- und Persistenz-Änderungen
- Deep Scans, Dynamic Policies, Registry

## Ausgeführte Checks

```text
npm run typecheck  → 15/15 erfolgreich
npm run lint       → 0 Fehler
```
