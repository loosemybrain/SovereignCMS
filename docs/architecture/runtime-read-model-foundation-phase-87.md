# Runtime Read Model Foundation (Phase 87)

## Zweck

Phase 87 modelliert **renderer-sichere, transient-only Runtime Read Models**: explizite Projektionen, die aus Runtime Composition entstehen dürfen, ohne neue Engine, Loader oder Query-Schicht.

Ein `RuntimeBlockReadModel` bündelt:

- `blockType` und `mode` (`public` | `admin-preview`)
- shallow-geklonte `props` (renderer-sicher, ohne Persistenzfelder)
- optionale `metadata` mit `artifacts` und `transient: true`

## Abgrenzung

| Schicht | Fokus |
|---------|--------|
| **Runtime Composition Boundaries** (84) | Welche Concerns/Artifact-Kinds bei Composition gelten |
| **Boundary Enforcement** (85) | Defensive Prüfung gegen Persistenz/Provider-Leakage |
| **Runtime Read Models** (87) | Welche transienten Artefakte in einer **Lesemodell-Projektion** erlaubt sind |
| **Media / Validation / Governance** | Fachliche Contracts — Read Models referenzieren sie semantisch, ersetzen sie nicht |

Read Models sind **Deklaration + Factory**, keine Projection Engine.

## Public vs. Admin Preview

| Boundary | Zusätzliche Artefakte |
|----------|------------------------|
| `PUBLIC_RUNTIME_READ_MODEL_BOUNDARY` | block-props, media, composition-metadata, validation, governance |
| `ADMIN_PREVIEW_RUNTIME_READ_MODEL_BOUNDARY` | wie oben + **preview-isolation** |

Beide: `rendererSafe: true`, `transientOnly: true`, `persistable: false`.

## Warum transient-only

Read Models beschreiben den **aktuellen Render-/Preview-Kontext**. Sie dürfen nicht in die Datenbank geschrieben werden (`isRuntimeReadModelPersistable` → immer `false`). Persistenz bleibt bei kanonischen Block-Props; Composition-Metadaten werden weiterhin vor Save entfernt (`stripMediaCompositionMetadata`).

## Warum renderer-safe

Renderer konsumieren nur die geklonten Props und bekannte Fallback-Marker — keine Provider-Clients, keine signed URLs als Persistenzfelder, keine Runtime-Policy in der UI. `createRuntimeBlockReadModel` führt keine Validation und keine Provider-Auflösung durch.

## Keine Projection / Query / Data Loader

- Kein rekursives Mapping von Seitenbäumen
- Kein Caching, kein Batch-Loading, kein GraphQL
- `createRuntimeBlockReadModel` ist eine **reine Factory** (shallow props clone, optionale metadata)

Spätere Features dürfen Read Models **nach** Composition erzeugen, z. B.:

```typescript
const boundary = getRuntimeReadModelBoundary("public")
assertRuntimeReadModelBoundary(boundary)
const readModel = createRuntimeBlockReadModel({
  blockType: block.type,
  mode: "public",
  props: block.props ?? {},
  artifacts: ["block-props", "media"],
})
```

Ohne `MediaCompositionResult` oder Renderer-APIs zu brechen.

## Composition-Integration (Phase 87)

`composePublicBlockMedia` / `composeAdminPreviewBlockMedia` / `composeBlockMedia` bleiben unverändert. Eine Rückgabetyp-Umstellung auf `RuntimeBlockReadModel[]` wäre breaking — daher **keine** Verdrahtung in Phase 87; nur Core-Contracts und Factory.

## Anti-Patterns (verboten)

- Projection Engine / Query Layer / Data Loader Framework
- Persistierte Runtime Read Models
- Provider-spezifische Felder im Read Model
- Renderer-seitige Runtime-Composition
- Globale Runtime Context API
- Dynamic Runtime Shape Generation / JSON-driven Read Models
- Universal Metadata Runtime
