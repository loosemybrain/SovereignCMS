# Runtime Exposure Discipline Foundation (Phase 90)

## Zweck

Phase 90 ergänzt **Exposure Discipline** auf Basis der Artifact Classification (Phase 89): Welche Artefakt-Kinds in welchem **Target** (`renderer`, `admin-preview`, `internal-runtime`) und welchem **Context** (`public-runtime`, `admin-preview-runtime`, `runtime-internal`) erlaubt sind.

Es ist keine Security Engine, kein Access-Control-System und keine Policy-/Middleware-Schicht.

## Abgrenzung

| Schicht | Rolle |
|---------|--------|
| **Artifact Classification** (89) | Statische Sichtbarkeit, Lifetime, Boundary scope pro Kind |
| **Exposure Discipline** (90) | Prüft Target + Context gegen Classification |
| **Projection Integrity** (88) | Konkrete `RuntimeBlockReadModel`-Instanz |
| **Boundary Enforcement** (85) | Composition-Boundaries, flache Persistenz-/Provider-Keys |

Phase 89 `checkRuntimeArtifactExposure(kind, visibility)` prüft nur Target/Visibility — Phase 90 ergänzt **Context** und strukturierte Violation-Codes.

## Prüflogik

`checkRuntimeArtifactExposureForTarget({ kind, target, context })`:

1. Nutzt ausschließlich `getRuntimeArtifactClassification(kind)`
2. `target` muss in `classification.visibility` enthalten sein
3. Renderer + internal-only Kind → `internal-artifact-exposed-to-renderer`
4. Context `public-runtime` + `boundaryScope === "admin-preview-runtime"` → `admin-preview-artifact-exposed-to-public`
5. Gibt `RuntimeExposureCheckResult` zurück — **wirft nicht**

`assertRuntimeArtifactExposureAllowed` wirft nur bei Verletzungen. `isRuntimeArtifactExposureAllowed` ist ein Convenience-Helper.

## Warum keine Auth/Tenant/Policy

Exposure beschreibt **Runtime-Semantik**, nicht Benutzerrechte. Tenant-Isolation und Auth bleiben in Tenancy/Auth-Packages; Renderer bleiben dumb und erhalten nur explizit freigegebene Props.

## Renderer vs. Admin Preview vs. Internal

- **Renderer** sehen nur Kinds mit `renderer` in `visibility` (z. B. `block-props`, `media`).
- **Admin Preview** darf zusätzlich `validation-result`, `preview-isolation`, `governance-metadata` (im passenden Context).
- **Internal-runtime** Artefakte (`composition-metadata`, Enforcement-/Integrity-Results) bleiben aus Renderern fern.

Public- und Admin-Preview-**Contexts** bleiben getrennt: Admin-preview-scoped Artefakte dürfen nicht im `public-runtime` Context exponiert werden.

## Integration (Phase 90)

Keine Änderung an Read Models, Projection Integrity, Composition oder Renderern. Aufrufer können nach Classification/Factory prüfen:

```typescript
assertRuntimeArtifactExposureAllowed({
  kind: "media",
  target: "renderer",
  context: "public-runtime",
})
```

## Anti-Patterns (verboten)

- Security Policy Engine / Access-Control in Exposure Discipline
- Auth-, Tenant- oder User-Entscheidungen hier
- Runtime Middleware Enforcement / Renderer-seitige Exposure Checks
- Deep Artifact Scanning / Dynamic Exposure Policies
- Artifact Registry / persistierte Runtime-Artefakte
