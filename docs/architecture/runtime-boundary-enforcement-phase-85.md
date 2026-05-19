# Runtime Boundary Enforcement Foundation (Phase 85)

## Zweck

Phase 85 ergänzt eine **kleine, explizite Boundary-Enforcement-Schicht** in `@sovereign-cms/core`, die Runtime-Composition-Artefakte defensiv absichert:

- Runtime-Artefakte dürfen nicht persistiert werden.
- Composition-Metadaten sollen provider-neutral bleiben (grobe Erkennung).
- Public- und Admin-Preview-Boundaries dürfen nicht verwechselt werden.
- Renderer und Persistenzpfade übernehmen **keine** Enforcement-Verantwortung.

Dies ist **keine** Runtime Engine, kein Orchestrator, keine Middleware, keine Policy Engine, kein Security Framework und **keine** globale Runtime-Context-API.

## Abgrenzung zu Runtime Composition Boundaries (Phase 84)

| Phase 84 | Phase 85 |
|----------|----------|
| Deklariert statische Boundaries (`PUBLIC_*`, `ADMIN_PREVIEW_*`) | Prüft Boundaries und flache Objekte defensiv |
| `transientOnly`, `persistable`, `artifactKinds` | Strukturierte `RuntimeBoundaryViolation` + `enforce*` / `detect*` |
| `assertRuntimeCompositionTransient` (minimal) | `assertRuntimeBoundaryValid` (erweitert, optional mit erwartetem Modus) |
| Metadaten am Composition-Result | Keine Persistenz von Runtime-Metadaten |

Phase 85 **ersetzt nicht** runtime-composition-contracts, block-runtime-validation, Governance-, Preview-Isolation- oder Media-Contracts.

## Defensive Semantik

### `enforceRuntimeCompositionBoundary(boundary)`

- Prüft `transientOnly === true`, `persistable === false`, gültiger Modus (`public` \| `admin-preview`).
- Gibt `RuntimeBoundaryEnforcementResult` zurück — **wirft nicht**.
- Keine Rekursion, keine Reflection, keine Side Effects.

### `assertRuntimeBoundaryValid(boundary, expectedMode?)`

- Nutzt `enforceRuntimeCompositionBoundary` (und bei `expectedMode` die Modus-Abstimmung).
- Wirft nur bei ungültiger Boundary — keine Logger-Pflicht, keine weiteren Seiteneffekte.

### `detectRuntimeArtifactPersistenceAttempt(input)`

- Flacher Check: erkennbare Top-Level-Keys wie `compositionMetadata`, `runtimeMetadata`, `validationResult`, `previewIsolation`.
- Severity: `warning` — Hinweis vor Persistenz, keine Deep-Scan-Engine.

### `detectProviderLeakage(input)`

- Flacher Check: offensichtliche Provider-Keys (`supabase`, `bucket`, `storageProvider`, `providerClient`, `signedUrl`).
- Severity: `warning` — grobe Heuristik, keine SDK- oder Registry-Erkennung.

## Warum keine Deep Scans / Reflection

- Deterministisches, vorhersagbares Verhalten.
- Keine versteckte Laufzeit-Magie.
- Keine Performance- oder Wartungskosten für rekursive Objekt-Walker.
- Enforcement bleibt **lesbar und auditierbar** — passend zu transient-only Runtime-Semantik.

## Warum Provider-Leakage nur grob erkannt wird

Provider-Neutralität ist ein **Architekturprinzip**, kein vollständiger statischer Beweis. Echte Leakage (URLs in Strings, verschachtelte SDK-Objekte) erfordert Domain-Wissen und gehört in Adapter/Composition-Schichten — nicht in eine globale Scanner-Engine.

## Warum Runtime-Metadaten nicht persistiert werden dürfen

Composition-Metadaten, Validierungsergebnisse und Preview-Isolation sind **transiente Laufzeit-Artefakte**. Sie beschreiben den aktuellen Render-/Preview-Kontext, nicht den kanonischen Content. Persistenz würde:

- Provider- oder Session-Details einfrieren,
- Boundaries zwischen Public und Admin Preview verwischen,
- Renderer mit veralteten Runtime-Zuständen füttern.

`stripMediaCompositionMetadata` und transient-only Boundaries (Phase 84) bleiben die operative Grenze; Phase 85 liefert zusätzliche **defensive Signale** (`detect*`).

## Integration (minimal)

Nach Boundary-Auflösung in:

- `composePublicBlockMedia`
- `composeAdminPreviewBlockMedia`
- `composeBlockMedia`

wird `assertRuntimeBoundaryValid(boundary, expectedMode)` aufgerufen. Bestehendes Compositionsverhalten bleibt unverändert; Renderer und Persistenzpfade wurden nicht angepasst.

`detectRuntimeArtifactPersistenceAttempt` und `detectProviderLeakage` stehen für gezielte Aufrufer bereit (z. B. vor Persistenz) — in Phase 85 **nicht** global verdrahtet.

## Anti-Patterns (verboten)

- Globale Runtime Policy Engine
- Deep Object Reflection / rekursive Runtime-Artifact-Scanner
- Provider Registry oder SDK-spezifische Enforcement-Logik
- Middleware Enforcement Injection
- Renderer-seitiges Enforcement
- Persistenz von Runtime Metadata
- Runtime Context API als Ersatz für explizite Boundaries
