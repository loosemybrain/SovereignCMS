# Runtime Artifact Classification Foundation (Phase 89)

## Zweck

Phase 89 klassifiziert **bekannte Runtime-Artefaktarten** statisch nach:

- **Lifetime** (`request` | `composition`)
- **Visibility** (`renderer` | `admin-preview` | `internal-runtime`)
- **Boundary scope** (`public-runtime` | `admin-preview-runtime` | `runtime-internal`)
- **Transient / persistable** (immer `transientOnly: true`, `persistable: false`)

Es ist eine **Taxonomie**, keine Registry, keine Engine und kein Metadata-Framework.

## Abgrenzung

| Schicht | Fokus |
|---------|--------|
| **Runtime Composition Boundaries** (84) | Welche Concerns/Kinds bei Composition gelten |
| **Runtime Read Models** (87) | Renderer-sichere Projektion (`RuntimeReadModelArtifact`) |
| **Projection Integrity** (88) | Defensive Prüfung einer Read-Model-Instanz |
| **Artifact Classification** (89) | Semantik pro **Artifact-Kind** (Sichtbarkeit, Lifetime, Scope) |

Classification **ersetzt** keine der anderen Schichten und **registriert** keine dynamischen Kinds.

## Semantische Namensabgleiche (ohne API-Bruch)

Ältere Typen nutzen teils kürzere Namen — bewusst unverändert:

| Classification (89) | Read Model (87) | Composition (84) |
|---------------------|-----------------|------------------|
| `validation-result` | `validation` | `validation-result` |
| `governance-metadata` | `governance` | — |
| `block-props` | `block-props` | `composed-props` (ähnliche Rolle) |

Neue Features können Classification-Kinds als Referenz nutzen; bestehende Public APIs bleiben stabil.

## Sichtbarkeit

- **Renderer-sichtbar:** `block-props`, `media` — dumb renderers konsumieren nur explizit freigegebene Artefakte.
- **Admin-Preview-sichtbar:** zusätzlich `validation-result`, `preview-isolation`, `governance-metadata`.
- **Internal-only:** `composition-metadata`, `boundary-enforcement-result`, `projection-integrity-result` — dürfen nicht in Renderer-Props oder Public-APIs wandern.

`checkRuntimeArtifactExposure(kind, targetVisibility)` prüft nur Listen-Membership — keine Security Pipeline.

## Warum keine Registry

- Vollständiger `Record<RuntimeArtifactKind, …>` zur Compile-Zeit
- Keine Plugin-Registration, keine String-Inferenz, keine Reflection
- Unbekannte Kinds sind Typfehler, nicht Laufzeit-Fallbacks

## Warum transient-only

Alle Artefakte sind Request-/Composition-Lebensdauer und **nicht persistierbar** (`isRuntimeArtifactPersistable` → immer `false`). Persistenz bleibt bei kanonischen Content-Props; Runtime-Metadaten werden vor Save entfernt.

## Anti-Patterns (verboten)

- Runtime Artifact Registry / Dynamic Artifact Kinds
- Plugin-basierte Artefakte / Metadata Runtime Platform
- Persistierte Runtime-Artefakte
- Renderer-Zugriff auf `internal-runtime`-only Artefakte
- Query/Projection Engine / Runtime Context API
- Deep Artifact Scanning / Runtime Policy Engine
