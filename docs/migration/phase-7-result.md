# Phase 7 – Ergebnis (Admin Block Renderer)

## Was geändert wurde

- Admin-Blockdarstellung über eine **zentrale Registry** (`renderAdminBlock(block)` in `admin-block-renderer-registry.tsx`).
- Aufspaltung in `block-renderers/` (Hero, Text, Fallback) mit gemeinsamem Kontrakt `AdminBlockRenderer` in `types.ts`.
- Defensive Auswertung von `block.props` in den spezialisierten Renderern.
- Fallback-Komponente für nicht registrierte Typen mit klaren Metadaten (`type`, `id`, Hinweistext).
- Dokumentation unter `docs/architecture/admin-block-rendering.md`.

## Unterstützte Blocktypen

| Typ    | Kurzbeschreibung                          |
| ------ | ----------------------------------------- |
| `hero` | `headline`, `subline` aus `props`        |
| `text` | `body` aus `props`                        |

Alle anderen Typen laufen über den Fallback.

## Fallback-Verhalten

Kein Eintrag in der Registry für `block.type` → `FallbackAdminRenderer` zeigt `type`, `id` und den Hinweis, dass kein Admin-Renderer registriert ist.

## Bekannte Grenzen

- Nur Lese-Darstellung; kein Editor, keine Mutation über die UI.
- Keine Validierung von Prop-Schemata gegen ein zentrales Schema (nur defensive String-/Object-Checks).
- Public-Site-Renderer und Admin-Renderer sind nicht automatisch synchron – neue Blocktypen müssen in beiden Welten ggf. separat ergänzt werden.

## Empfehlung für Phase 8

Phase 8 (Block Editor Foundation) sollte auf dieser Registry aufsetzen: zuerst ein stabiles **Prop-Read-Model** und ein minimaler Editiermodus oder Formularrahmen pro Typ, weiterhin ohne Legacy-Migration und ohne Verknüpfung mit der Public-Render-Pipeline, bis die Datenverträge für Updates festliegen.
