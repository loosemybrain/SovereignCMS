# Runtime Projection Integrity Foundation (Phase 88)

## Zweck

Phase 88 ergänzt eine **defensive Integritätsschicht** für `RuntimeBlockReadModel`-Projektionen (Phase 87). Sie prüft, ob eine Projektion den Read-Model-Grenzen entspricht — ohne Projection Engine, Query-System oder Validation Framework.

## Abgrenzung

| Schicht | Rolle |
|---------|--------|
| **Runtime Read Models** (87) | Deklaration + Factory (`createRuntimeBlockReadModel`) |
| **Runtime Boundary Enforcement** (85) | Composition-Boundaries, flache Persistenz-/Provider-Checks |
| **Projection Integrity** (88) | Integrität einer **konkreten Read-Model-Instanz** |
| **Composition / Media** | Erzeugt transient composed props — Integrity prüft danach optional |

Integrity **ersetzt nicht** Read Models, Boundary Enforcement, Runtime Validation oder Media Contracts.

## Was geprüft wird

`enforceRuntimeBlockReadModelIntegrity(readModel, { expectedMode? })`:

- Gültiger Modus (`public` \| `admin-preview`)
- `metadata.transient === true`, falls metadata gesetzt
- `metadata.artifacts` ⊆ erlaubte Artefakte der Mode-Boundary
- Kein `preview-isolation` in Public-Projektionen
- Optional: `expectedMode` stimmt mit `readModel.mode` überein
- Flache Props-/Metadata-Checks: Persistenz-Keys, Provider-Leakage (keine Rekursion)

`assertRuntimeProjectionIntegrity` wirft nur bei Verletzungen — keine Side Effects, keine Logger-Pflicht.

## Standalone-Detektoren

- `detectReadModelPersistenceLeakage(props)` — flache Keys wie `compositionMetadata`, `runtimeMetadata`, …
- `detectProjectionProviderLeakage(input)` — grobe Provider-Keys (`supabase`, `signedUrl`, …)

Transient composition props (z. B. `_sovereignMediaComposition`) sind **kein** Persistenz-Leak — sie werden vor Save entfernt und gehören zur Composition-Schicht, nicht zur Integrity-Key-Liste.

## Warum keine Projection Engine

- Kein Mapping von Seiten, kein Batch-Load, kein Cache
- Keine automatische Artefakt-Generierung
- Nur strukturierte Violations für gezielte Aufrufer (Runtime, Tests, spätere Phasen)

## Integration (Phase 88)

`createRuntimeBlockReadModel` und `composeBlockMedia` bleiben unverändert. Aufrufer können nach der Factory integritätsprüfen:

```typescript
const readModel = createRuntimeBlockReadModel({ ... })
assertRuntimeProjectionIntegrity(readModel, "public")
```

## Anti-Patterns (verboten)

- Projection Engine / Query Layer / Data Loader
- Persistierte Read Models oder Universal Metadata Runtime
- Deep Object Reflection / rekursive Scanner
- Provider Registry / SDK-spezifische Integrity-Logik
- Renderer-seitige Integrity-Enforcement
- Globale Runtime Context API
- Publish Blocking aus Integrity-Violations
