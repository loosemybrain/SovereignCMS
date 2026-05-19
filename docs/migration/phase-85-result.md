# Phase 85 – Runtime Boundary Enforcement Foundation

## Status

Abgeschlossen. `npm run typecheck` und `npm run lint` erfolgreich (siehe unten).

## Neue Dateien

| Pfad | Inhalt |
|------|--------|
| `packages/core/src/runtime-boundary-enforcement.ts` | Violation-Typen, `enforce*`, `assert*`, `detect*` (flach, ohne Rekursion) |
| `docs/architecture/runtime-boundary-enforcement-phase-85.md` | Architektur und Anti-Patterns |
| `docs/migration/phase-85-result.md` | Dieses Dokument |

## Geänderte Dateien

| Pfad | Änderung |
|------|----------|
| `packages/core/src/index.ts` | Export Boundary-Enforcement-Typen und -Helper |
| `packages/runtime/src/media/compose-block-media-core.ts` | `assertRuntimeBoundaryValid` statt `assertRuntimeCompositionTransient` |
| `packages/runtime/src/media/compose-public-block-media.ts` | wie oben, Modus `public` |
| `packages/runtime/src/media/compose-admin-preview-block-media.ts` | wie oben, Modus `admin-preview` |

## Neue Typen / Helper

- `RuntimeBoundaryViolationCode`, `RuntimeBoundaryEnforcementSeverity`, `RuntimeBoundaryViolation`, `RuntimeBoundaryEnforcementResult`
- `createRuntimeBoundaryViolation`
- `enforceRuntimeCompositionBoundary`
- `assertRuntimeBoundaryValid` (optional `expectedMode` für Public/Preview-Abstimmung in Compose)
- `detectRuntimeArtifactPersistenceAttempt`
- `detectProviderLeakage`
- Intern: `enforceRuntimeCompositionModeMatch` (nicht aus `@sovereign-cms/core` exportiert)

## Integration

- Composition-Einstiegspunkte validieren die aufgelöste Boundary direkt nach `getRuntimeCompositionBoundary`.
- `assertRuntimeCompositionTransient` bleibt in Phase 84 für Abwärtskompatibilität exportiert; Compose nutzt Phase-85-Assert.

## Bewusst nicht umgesetzt

- Keine globale Verdrahtung von `detect*` in Persistenz oder Server Actions
- Keine Renderer-, Middleware- oder Policy-Engine-Änderungen
- Keine Provider-Registry / SDK-Erkennung
- Kein Ersatz für Governance-, Preview-Isolation- oder Runtime-Validation-Contracts
## Ausgeführte Checks

```text
npm run typecheck  → 15/15 erfolgreich
npm run lint       → 0 Fehler (bestehende Admin-Warnungen unverändert)
npm run build      → erfolgreich (web + admin)
npm run sprint:finish -- --phase 85 → erfolgreich
```

## Sprint-Artefakte

- `artifacts/phase-zips/SovereignCMS-85-nur-Aenderungen.zip`
- `artifacts/phase-zips/SovereignCMS-85-repo-slim.zip`
